import fs from 'node:fs/promises';import path from 'node:path';import {chromium} from 'playwright';import AxeBuilder from '@axe-core/playwright';
const out=path.resolve(process.env.TEST_DIR||'.review/v5-tests');await fs.mkdir(out,{recursive:true});
const base=process.env.PREVIEW_URL||'http://127.0.0.1:4173/Portif-lio/';
const browser=await chromium.launch({channel:'msedge',headless:true});
const checks=[],errors=[],violations=[],externalOrigins=new Set();
const check=(name,pass,detail={})=>{checks.push({name,pass,...detail});if(!pass)console.error('FAIL',name,JSON.stringify(detail));};
const state=page=>page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,missing:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>new URL(i.src).pathname)}));
const audit=async(page,label)=>{const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa','best-practice']).analyze();violations.push(...result.violations.map(v=>({label,id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})));check('axe '+label,!result.violations.length);};
try{
 for(const [width,height] of [[320,780],[360,800],[390,844],[768,1024],[1024,768],[1440,900],[1920,1080],[1440,600]]){
  const layoutContext=await browser.newContext({viewport:{width,height}}),page=await layoutContext.newPage();
  page.on('pageerror',error=>errors.push({width,error:error.message}));
  page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)errors.push({width,path:new URL(r.url()).pathname,status:r.status()});});
  page.on('request',r=>{if(!r.url().startsWith(base)&&!r.url().startsWith('data:'))externalOrigins.add(new URL(r.url()).origin);});
  for(const route of ['', 'casos/aatamed/','casos/horus/','casos/atena/','casos/matrix/','casos/horus/demonstracao/']){
   const response=await page.goto(base+route,{waitUntil:'networkidle'});const s=await state(page);
   check(`Layout ${width}×${height} ${route||'closed'}`,response.status()===200&&s.scroll===s.width&&s.h1===1&&!s.missing.length,s);
   if([390,1440].includes(width)&&height!==600)await audit(page,`${width} ${route||'closed'}`);
   if(!route){
    await page.locator('.explorer-trigger').click();await page.waitForTimeout(550);
    const opened=await state(page);check(`Open layout ${width}×${height}`,opened.width===opened.scroll&&await page.locator('.project-card:visible').count()===3,opened);
    if([390,1440].includes(width)&&height!==600)await audit(page,`${width} open`);
    await page.locator('.explorer-trigger').click();await page.waitForTimeout(550);
    check(`Close ${width}×${height}`,await page.locator('.project-card:visible').count()===0&&await page.locator('[data-case-shortcut]:visible').count()===3);
   }
  }
  console.log(`Layout ${width}×${height} completed`);await layoutContext.close();
 }
 const interactionContext=await browser.newContext({viewport:{width:1440,height:900}}),page=await interactionContext.newPage();
 await page.goto(base,{waitUntil:'networkidle'});await page.keyboard.press('Tab');
 check('Skip link is first focus',await page.locator('.skip').evaluate(el=>el===document.activeElement));await page.keyboard.press('Enter');check('Skip moves to main',await page.locator('main').evaluate(el=>el===document.activeElement));
 await page.locator('.hero-actions a[href="#projetos"]').click();await page.waitForTimeout(750);
 check('Projects anchor lands on section',Math.abs(await page.locator('#projetos').evaluate(el=>el.getBoundingClientRect().top))<80);
 await page.locator('.explorer-trigger').focus();await page.keyboard.press('Space');await page.waitForTimeout(550);await page.keyboard.press('Tab');
 check('Keyboard opens and reaches first case',await page.locator('#aatamed a').evaluate(el=>el===document.activeElement));
 check('Visible case keyboard focus',await page.locator('#aatamed a').evaluate(el=>getComputedStyle(el).outlineStyle!=='none'));
 await page.keyboard.press('Escape');await page.waitForTimeout(550);
 check('Escape closes and returns focus',await page.locator('[data-explorer]').evaluate(el=>!el.open&&el.querySelector('summary')===document.activeElement));
 await page.keyboard.press('Enter');await page.waitForTimeout(550);
 for(const slug of ['aatamed','horus','atena']){
  await page.locator(`#${slug} .project-card`).click();await page.waitForURL(`**/casos/${slug}/`);await page.waitForLoadState('networkidle');
  check(`Case ${slug} opens from selection`,await page.locator('main h1').count()===1);
  await page.locator('.back').click();await page.waitForURL(`**/#${slug}`);await page.waitForTimeout(550);
  check(`Case ${slug} back restores open and focus`,await page.locator('[data-explorer]').evaluate(el=>el.open)&&await page.locator(`#${slug} a`).evaluate(el=>el===document.activeElement));
 }
 await page.goto(base+'#projetos',{waitUntil:'networkidle'});await page.locator('#horus .project-card').click();await page.waitForURL('**/casos/horus/');await page.goBack({waitUntil:'domcontentloaded'});await page.waitForTimeout(550);
 check('Browser Back preserves selection and focus',await page.locator('[data-explorer]').evaluate(el=>el.open)&&await page.locator('#horus a').evaluate(el=>el===document.activeElement));
 await page.locator('.explorer-trigger').focus();await page.keyboard.press('Escape');await page.waitForTimeout(550);
 await page.locator('.explorer-trigger').evaluate(el=>{for(let i=0;i<8;i++)el.click();});await page.waitForTimeout(650);
 check('Rapid reversal leaves clean closed state',await page.locator('[data-explorer]').evaluate(el=>!el.open)&&!await page.locator('.explorer-flight').count()&&await page.locator('[data-case-shortcut]:visible').count()===3);
 await page.locator('.explorer-trigger').click();await page.setViewportSize({width:390,height:844});await page.waitForTimeout(200);
 check('Resize during transition restores all covers',!await page.locator('.explorer-flight').count()&&await page.locator('.choice-cover').evaluateAll(es=>es.every(el=>getComputedStyle(el).opacity==='1')));
 await interactionContext.close();
 for(const mode of ['no-js','no-webgl','script-failure','reduced-motion','storage-denied']){
  const context=await browser.newContext({viewport:{width:390,height:844},javaScriptEnabled:mode!=='no-js',reducedMotion:mode==='reduced-motion'?'reduce':'no-preference'});
  if(mode==='no-webgl')await context.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return String(type).includes('webgl')?null:original.call(this,type,...args);};});
  if(mode==='storage-denied')await context.addInitScript(()=>{Storage.prototype.getItem=()=>{throw Error('Storage blocked')};Storage.prototype.setItem=()=>{throw Error('Storage blocked')};});
  const pg=await context.newPage();if(mode==='script-failure')await pg.route('**/assets/explorer.js',route=>route.abort());
  await pg.goto(base,{waitUntil:'networkidle'});await pg.locator('.explorer-trigger').focus();await pg.keyboard.press('Enter');
  if(mode==='reduced-motion')check('Reduced motion has no transition ghosts',!await pg.locator('.explorer-flight').count());
  await pg.waitForTimeout(550);const s=await state(pg);
  check(`Usable ${mode}`,await pg.locator('.project-card:visible').count()===3&&!s.missing.length&&s.scroll===s.width,s);
  await pg.screenshot({path:path.join(out,mode+'.png')});
  await pg.locator('#atena .project-card').click();await pg.waitForURL('**/casos/atena/');await pg.locator('.back').click();await pg.waitForURL('**/#atena');await pg.waitForTimeout(200);
  check(`Case return ${mode}`,await pg.locator('#atena .project-card').isVisible());
  await context.close();
 }
 const ctx=await browser.newContext({viewport:{width:390,height:844}}),mobile=await ctx.newPage();await mobile.goto(base,{waitUntil:'networkidle'});
 await mobile.locator('[data-mobile-nav] summary').click();await mobile.locator('[data-mobile-nav] a[href="#contato"]').click();await mobile.waitForTimeout(750);
 check('Mobile menu closes on anchor',await mobile.locator('[data-mobile-nav]').evaluate(el=>!el.open)&&await mobile.locator('#contato').evaluate(el=>el.getBoundingClientRect().top<innerHeight));
 await mobile.goto(base+'#projetos',{waitUntil:'networkidle'});await mobile.locator('.explorer-trigger').click();await mobile.waitForTimeout(550);
 await mobile.evaluate(()=>{const elements=[...document.querySelectorAll('.choice-copy *')];const sizes=elements.map(el=>parseFloat(getComputedStyle(el).fontSize)*2);elements.forEach((el,i)=>el.style.fontSize=`${sizes[i]}px`);});
 const text=await state(mobile);check('Project text at 200% reflows',text.width===text.scroll,text);await ctx.close();
 check('No page or local resource errors',!errors.length,{errors});
}catch(error){check('Runner completes',false,{error:error.stack});}
await fs.writeFile(path.join(out,'results.json'),JSON.stringify({date:new Date().toISOString(),browser:browser.version(),base,checks,violations,errors,externalOrigins:[...externalOrigins],transport:'Real HTTP. Only named failure tests disable a feature or abort explorer.js.'},null,2));
console.log(JSON.stringify({checks:checks.length,passed:checks.filter(c=>c.pass).length,failed:checks.filter(c=>!c.pass).length,violations:violations.length}));await browser.close();if(checks.some(c=>!c.pass))process.exitCode=1;
