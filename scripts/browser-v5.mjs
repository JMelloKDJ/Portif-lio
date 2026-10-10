import fs from 'node:fs/promises';
import path from 'node:path';
import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
const out=path.resolve(process.env.TEST_DIR||'.review/hero-collection');await fs.mkdir(out,{recursive:true});
const base=process.env.PREVIEW_URL||'http://127.0.0.1:4173/Portif-lio/';
const browser=await chromium.launch({channel:'msedge',headless:true}),checks=[],errors=[],violations=[];
const check=(name,pass,detail={})=>{checks.push({name,pass,...detail});if(!pass)console.error('FAIL',name,JSON.stringify(detail));};
const title=(p,id)=>p.locator(`label[for="select-${id}"]`),radio=(p,id)=>p.locator(`[data-select="${id}"]`);
const selected=async(p,id)=>await radio(p,id).isChecked()&&await p.locator('[data-panel]:visible').count()===1&&await p.locator(`[data-panel="${id}"]`).isVisible();
const bounds=p=>p.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,missing:[...document.images].filter(i=>i.getClientRects().length&&i.complete&&!i.naturalWidth).map(i=>i.src)}));
const audit=async(p,name)=>{const a=await new AxeBuilder({page:p}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();violations.push(...a.violations.map(v=>({name,id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})));check('Axe '+name,!a.violations.length);};
try{
 for(const [width,height] of [[320,780],[360,800],[390,844],[768,1024],[1024,768],[1440,900],[1920,1080],[1440,600]]){
  const ctx=await browser.newContext({viewport:{width,height}}),p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));
  await p.goto(base,{waitUntil:'networkidle'});let b=await bounds(p);check('Closed '+width+'x'+height,b.width===b.scroll&&!b.missing.length,b);
  await p.locator('.explorer-trigger').click();
  const url=p.url(),history=await p.evaluate(()=>window.history.length);
  for(const id of ['aatamed','horus','atena']){
   await title(p,id).click();await p.waitForTimeout(450);
   check(`Title selects only ${width} ${id}`,await selected(p,id)&&p.url()===url&&await p.evaluate(()=>window.history.length)===history);
   b=await bounds(p);check(`Selected bounds ${width} ${id}`,b.width===b.scroll&&!b.missing.length,b);
   const overlap=await p.locator(`[data-panel="${id}"]`).evaluate(e=>{const f=e.querySelector('figure').getBoundingClientRect(),h=e.querySelector('.preview-copy h3').getBoundingClientRect();return {gap:h.top-f.bottom,coverWidth:f.width};});
   check(`Copy below decorative sheets ${width} ${id}`,overlap.gap>=21,overlap);
   await p.locator(`[data-panel="${id}"] .choice-cover`).click();check(`Cover inert ${width} ${id}`,p.url()===url&&await p.locator('.choice-cover a').count()===0);
   const target=await title(p,id).boundingBox();check(`Touch target ${width} ${id}`,target.width>=44&&target.height>=44,target);
  }
  check(`Only explicit case CTAs ${width}`,await p.locator('#projetos a').count()===3&&await p.locator('#projetos a').evaluateAll(es=>es.every(e=>e.textContent.startsWith('Abrir o caso'))));
  if([390,1440].includes(width)&&height!==600)await audit(p,width+' selected');
  if(width===390){
   await p.evaluate(()=>{const es=[...document.querySelectorAll('.project-selection h3,.project-selection p,.project-selection a')];const sizes=es.map(e=>parseFloat(getComputedStyle(e).fontSize)*2);es.forEach((e,i)=>e.style.fontSize=sizes[i]+'px');});
   b=await bounds(p);check('200 percent text reflows',b.width===b.scroll,b);
   const fitted=await p.locator('.project-card').evaluateAll(es=>es.every(e=>{const range=document.createRange();range.selectNodeContents(e);return range.getBoundingClientRect().width<=e.getBoundingClientRect().width+1;}));check('Enlarged titles fit without overlap',fitted);
  }
  await ctx.close();console.log('Layout '+width+'x'+height);
 }
 for(const [width,height,touch] of [[1440,900,false],[390,844,true]]){
  const ctx=await browser.newContext({viewport:{width,height},hasTouch:touch,isMobile:touch}),p=await ctx.newPage();
  await p.goto(base,{waitUntil:'networkidle'});await p.keyboard.press('Tab');check('First focus skip '+width,await p.locator('.skip').evaluate(e=>e===document.activeElement));
  await p.locator('.explorer-trigger').focus();await p.keyboard.press('Enter');await p.keyboard.press('Tab');
  check('Tab enters selected native radio '+width,await radio(p,'aatamed').evaluate(e=>e===document.activeElement));
  await p.keyboard.press('ArrowRight');check('Native right selects Horus '+width,await selected(p,'horus'));
  check('Visible keyboard focus '+width,await title(p,'horus').evaluate(e=>getComputedStyle(e).outlineStyle!=='none'));
  await p.keyboard.press('ArrowRight');check('Native right selects Atena '+width,await selected(p,'atena'));
  await radio(p,'aatamed').focus();await p.keyboard.press('Space');check('Space selects Delta '+width,await selected(p,'aatamed'));
  for(const id of ['aatamed','horus','atena']){
   const prior=p.url();if(touch)await title(p,id).tap();else await title(p,id).click();
   check(`${touch?'Touch':'Mouse'} selects without route ${id}`,await selected(p,id)&&p.url()===prior);
   const cta=p.locator(`[data-panel="${id}"] .preview-case-link`);if(touch)await cta.tap();else await cta.click();await p.waitForURL(`**/casos/${id}/`);
   check(`Explicit CTA navigates ${width} ${id}`,new URL(p.url()).pathname===`/Portif-lio/casos/${id}/`);
   await p.goBack({waitUntil:'networkidle'});await p.waitForTimeout(100);
   check(`Browser back restores ${width} ${id}`,await selected(p,id)&&await radio(p,id).evaluate(e=>e===document.activeElement));
  }
  await p.goForward({waitUntil:'networkidle'});check('Forward case '+width,p.url().endsWith('/casos/atena/'));
  await p.locator('.back').click();await p.waitForURL('**/#atena');await p.waitForTimeout(100);check('Explicit return selects '+width,await selected(p,'atena'));
  await p.keyboard.press('Escape');check('Escape closes/focus '+width,await p.locator('[data-explorer]').evaluate(e=>!e.open&&e.querySelector('summary')===document.activeElement));
  await p.keyboard.press('Enter');await title(p,'horus').click();await p.emulateMedia({reducedMotion:'reduce'});await p.waitForTimeout(150);
  check('Reduced motion settles '+width,await p.evaluate(()=>document.getAnimations().every(a=>a.playState!=='running')));
  check('Confirmed telephone '+width,await p.locator('a[href="tel:+5571987723214"]').textContent()==='+55 (71) 98772-3214');
  check('No WhatsApp contact '+width,await p.locator('a[href*="wa.me"],a[href*="whatsapp.com"]').count()===0);
  await ctx.close();
 }
 for(const mode of ['no-js','no-webgl','script-failure','reduced-motion','storage-denied']){
  const ctx=await browser.newContext({viewport:{width:390,height:844},javaScriptEnabled:mode!=='no-js',reducedMotion:mode==='reduced-motion'?'reduce':'no-preference'});
  if(mode==='no-webgl')await ctx.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...a){return String(type).includes('webgl')?null:original.call(this,type,...a);};});
  if(mode==='storage-denied')await ctx.addInitScript(()=>{Storage.prototype.getItem=()=>{throw Error('Blocked')};Storage.prototype.setItem=()=>{throw Error('Blocked')};});
  const p=await ctx.newPage();if(mode==='script-failure')await p.route('**/assets/explorer.js',r=>r.abort());
  await p.goto(base,{waitUntil:'networkidle'});await p.locator('.explorer-trigger').click();
  for(const id of ['aatamed','horus','atena']){const before=p.url();await title(p,id).click();check(`${mode} native selection ${id}`,await selected(p,id)&&p.url()===before);}
  const b=await bounds(p);check(mode+' layout',b.width===b.scroll&&!b.missing.length,b);
  await p.locator('#projetos').screenshot({path:path.join(out,mode+'.png')});
  await p.locator('[data-panel="atena"] .preview-case-link').click();await p.waitForURL('**/casos/atena/');check(mode+' explicit CTA works',p.url().endsWith('/casos/atena/'));await ctx.close();
 }
 for(const width of [390,1440]){
  const ctx=await browser.newContext({viewport:{width,height:width===390?844:900}}),p=await ctx.newPage();
  for(const route of ['','casos/aatamed/','casos/horus/','casos/atena/','casos/matrix/','casos/horus/demonstracao/']){
   const response=await p.goto(base+route,{waitUntil:'networkidle'}),b=await bounds(p);
   check(`Route ${width} ${route}`,response.status()===200&&b.width===b.scroll&&!b.missing.length,b);
   check('No repeated label '+route+' '+width,!/demonstração ilustrativa/i.test(await p.locator('body').innerText()));
   if(route&&width===390)await audit(p,route);
  }
  await ctx.close();
 }
 check('No page errors',!errors.length,{errors});
}catch(e){check('Runner completes',false,{error:e.stack});}
await fs.writeFile(path.join(out,'results.json'),JSON.stringify({browser:browser.version(),base,transport:'Actual HTTP, except specifically named failure injection. Disposable contexts only; no physical mobile device.',checks,violations,errors},null,2));
await browser.close();console.log(JSON.stringify({total:checks.length,passed:checks.filter(c=>c.pass).length,failed:checks.filter(c=>!c.pass)},null,2));if(checks.some(c=>!c.pass))process.exitCode=1;
