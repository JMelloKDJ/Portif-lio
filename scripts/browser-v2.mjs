import fs from 'node:fs/promises';
import path from 'node:path';
import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
const root=path.resolve(import.meta.dirname,'..'),out=path.resolve(process.env.TEST_DIR||path.join(root,'.review/v3-tests'));await fs.mkdir(out,{recursive:true});
const base=process.env.PREVIEW_URL||'http://127.0.0.1:4173/Portif-lio/';
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--enable-unsafe-swiftshader']});
const checks=[],violations=[],errors=[],requests=[];
const check=(name,pass,detail={})=>{checks.push({name,pass,...detail});if(!pass)console.error('FAIL',name,JSON.stringify(detail));};
const routes=['','casos/aatamed/','casos/horus/','casos/atena/','casos/matrix/','casos/horus/demonstracao/'];
const center=async(page,id)=>{await page.locator(id).evaluate(el=>scrollTo({top:el.getBoundingClientRect().top+scrollY+el.clientHeight/2-innerHeight/2,behavior:'instant'}));await page.waitForTimeout(700);};
try{
 for(const [width,height] of [[320,780],[360,800],[390,844],[768,1024],[1024,768],[1440,900],[1920,1080],[1440,600]]){
  const ctx=await browser.newContext({viewport:{width,height}}),page=await ctx.newPage();
  page.on('pageerror',e=>errors.push({width,message:e.message}));
  page.on('response',r=>{if(r.status()>=400)errors.push({width,url:r.url(),status:r.status()});});
  page.on('request',r=>{if(!r.url().startsWith(base)&&!r.url().startsWith('data:'))requests.push(new URL(r.url()).origin);});
  for(const route of routes){
   const response=await page.goto(base+route,{waitUntil:'networkidle'});
   const state=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,missing:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src)}));
   check(`Layout ${width}x${height} ${route||'home'}`,response.status()===200&&state.scroll<=width&&state.h1===1&&!state.missing.length,state);
   if([390,1440].includes(width)&&height!==600&&route!=='casos/matrix/'){
    const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa','best-practice']).analyze();
    violations.push(...audit.violations.map(v=>({route,width,id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})));
    check(`axe ${width} ${route||'home'}`,audit.violations.length===0,{count:audit.violations.length});
   }
  }
  console.log(`Layout ${width}x${height} completed`);await ctx.close();
 }
 const ctx=await browser.newContext({viewport:{width:1440,height:900}}),p=await ctx.newPage();
 await p.goto(base,{waitUntil:'networkidle'});
 check('Scene bundle deferred at top',!(await p.evaluate(()=>performance.getEntriesByType('resource').some(r=>r.name.endsWith('/scene.js')))));
 await p.keyboard.press('Tab');check('Skip link first',await p.locator('.skip').evaluate(el=>el===document.activeElement));
 await p.keyboard.press('Enter');check('Skip reaches main',await p.locator('main').evaluate(el=>el===document.activeElement));
 await p.locator('.hero-actions .button').focus();check('Visible focus',await p.evaluate(()=>getComputedStyle(document.activeElement).outlineStyle==='solid'));
 await p.keyboard.press('Enter');await p.waitForTimeout(650);check('Project anchor',new URL(p.url()).hash==='#projetos');
 await center(p,'#aatamed');await p.waitForFunction(()=>document.querySelector('[data-scene]').dataset.scene==='ready');
 check('One shared WebGL canvas',await p.locator('canvas').count()===1);
 const plateaus=[];
 for(const id of ['#aatamed','#horus','#atena','#horus','#aatamed']){await center(p,id);plateaus.push(Number(await p.locator('[data-scene]').getAttribute('data-progress')));}
 check('Scroll progression reverses',plateaus.every((v,i)=>Math.abs(v-[0,1,2,1,0][i])<.001),{plateaus});
 const before=await p.locator('[data-scene]').getAttribute('data-renders');await p.waitForTimeout(500);
 check('Renderer stops at rest',before===await p.locator('[data-scene]').getAttribute('data-renders'));
 await center(p,'#contato');const off=await p.locator('[data-scene]').getAttribute('data-renders');await p.waitForTimeout(400);check('Renderer stops outside view',off===await p.locator('[data-scene]').getAttribute('data-renders'));
 await p.locator('.motion-toggle').click();check('Manual motion off',await p.locator('canvas').count()===0);
 await p.locator('.motion-toggle').click();await center(p,'#horus');await p.waitForFunction(()=>document.querySelector('[data-scene]').dataset.scene==='ready');check('Manual motion on',await p.locator('canvas').count()===1);
 await p.emulateMedia({reducedMotion:'reduce'});await p.waitForFunction(()=>document.querySelectorAll('canvas').length===0);check('Live reduced-motion cleanup',await p.locator('canvas').count()===0);await p.emulateMedia({reducedMotion:'no-preference'});
 await p.goto(base+'casos/aatamed/',{waitUntil:'networkidle'});await p.locator('.back').click();await p.waitForTimeout(700);check('Return to originating case',new URL(p.url()).hash==='#aatamed');
 await p.goto(base+'casos/horus/',{waitUntil:'networkidle'});check('No automatic iframe',await p.locator('iframe').count()===0);
 await p.locator('.demo summary').focus();await p.keyboard.press('Enter');await p.waitForSelector('iframe');await p.frameLocator('iframe').getByRole('heading',{name:'Uma leitura de indicadores.'}).waitFor();check('Keyboard loads synthetic demo',true);
 await p.reload({waitUntil:'networkidle'});check('Direct case reload',await p.locator('h1').textContent()==='Do indicador à próxima ação.');
 await ctx.close();
 const mobile=await browser.newContext({viewport:{width:390,height:844}}),mp=await mobile.newPage();await mp.goto(base,{waitUntil:'networkidle'});
 await mp.locator('.mobile-nav summary').focus();await mp.keyboard.press('Enter');await mp.keyboard.press('Tab');check('Mobile menu keyboard',await mp.evaluate(()=>document.activeElement.textContent==='Projetos'));
 await mp.keyboard.press('Escape');check('Escape restores menu focus',await mp.locator('.mobile-nav').evaluate(el=>!el.open&&document.activeElement===el.querySelector('summary')));
 await center(mp,'#horus');check('Mobile uses static layout without 3D download',await mp.locator('canvas').count()===0&&!(await mp.evaluate(()=>performance.getEntriesByType('resource').some(r=>r.name.endsWith('/scene.js')))));
 await mobile.close();
 for(const mode of ['no-js','reduced-motion','no-webgl','bundle-failure','context-loss','texture-failure']){
  const context=await browser.newContext({viewport:{width:1440,height:900},javaScriptEnabled:mode!=='no-js',reducedMotion:mode==='reduced-motion'?'reduce':'no-preference'}),pg=await context.newPage();
  if(mode==='no-webgl')await pg.addInitScript(()=>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(t,...a){return /webgl/.test(t)?null:get.call(this,t,...a);};});
  if(mode==='bundle-failure')await pg.route('**/scene.js',r=>r.abort());
  // Only WebGL's texture request fails; the HTML fallback remains available.
  if(mode==='texture-failure')await pg.route('**/delta.svg',r=>r.request().headers().origin?r.abort():r.continue());
  await pg.goto(base,{waitUntil:'networkidle'});
  if(mode==='no-js'){await pg.locator('a[href="#projetos"]').first().click();await pg.locator('#aatamed .text-link').click();check('No JS direct case link',pg.url()===base+'casos/aatamed/');await pg.goto(base,{waitUntil:'networkidle'});}
  await center(pg,'#aatamed');await pg.waitForTimeout(400);
  if(mode==='context-loss'){await pg.locator('canvas').evaluate(c=>c.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());await pg.waitForTimeout(100);}
  const state=await pg.evaluate(()=>({scene:document.querySelector('[data-scene]').dataset.scene,reason:document.querySelector('[data-scene]').dataset.sceneReason,canvas:document.querySelectorAll('canvas').length,opacity:getComputedStyle(document.querySelector('.project-visual img')).opacity,links:document.querySelectorAll('[data-project] .text-link').length}));
  check(`Fallback ${mode}`,state.scene==='static'&&state.canvas===0&&state.opacity==='1'&&state.links===3,state);
  await pg.screenshot({path:path.join(out,mode+'.png')});await context.close();
 }
 const zoom=await browser.newContext({viewport:{width:1440,height:900}}),zp=await zoom.newPage();await zp.goto(base,{waitUntil:'networkidle'});
 // 200% text resize plus separate half-width layout covers reflow without pretending pinch-zoom is browser zoom.
 await zp.evaluate(()=>{const els=[...document.querySelectorAll('body *')].filter(el=>[...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()));const sizes=els.map(el=>parseFloat(getComputedStyle(el).fontSize));els.forEach((el,i)=>el.style.fontSize=sizes[i]*2+'px');});
 let zi=await zp.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));check('200% text reflow',zi.scroll<=zi.width,zi);await zp.screenshot({path:path.join(out,'text-200.png'),fullPage:true});
 await zp.setViewportSize({width:720,height:450});await zp.reload({waitUntil:'networkidle'});zi=await zp.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));check('200% layout equivalent 1440 to 720',zi.scroll<=zi.width,zi);await zp.screenshot({path:path.join(out,'layout-200.png')});await zoom.close();
 check('No application errors on real HTTP',errors.length===0,{errors});
 const origins=[...new Set(requests)];
 const html=await fs.readFile(path.join(root,'index.html'),'utf8');
 check('No external runtime in built HTML',!/<(?:script|link)[^>]+(?:src|href)="https?:/i.test(html.replace(/<link rel="canonical"[^>]+>/g,''))&&!html.includes('kaspersky'));
 check('No unexpected external origin',origins.every(o=>o==='http://me.kis.v2.scr.kaspersky-labs.com'),{origins,hostInjectionObserved:origins.includes('http://me.kis.v2.scr.kaspersky-labs.com')});
}catch(error){check('Harness completion',false,{error:error.stack});}
finally{
 await fs.writeFile(path.join(out,'results.json'),JSON.stringify({date:new Date().toISOString(),browser:browser.version(),base,transport:'Real local HTTP; no fulfillment. Failure tests explicitly abort a selected resource.',checks,violations,errors,requests},null,2));
 await browser.close();console.log(JSON.stringify({checks:checks.length,passed:checks.filter(x=>x.pass).length,failed:checks.filter(x=>!x.pass).length,violations:violations.length}));
 if(checks.some(x=>!x.pass))process.exitCode=1;
}
