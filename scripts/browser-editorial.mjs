import fs from 'node:fs/promises';
import path from 'node:path';
import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
const base=process.env.PREVIEW_URL||'http://127.0.0.1:4173/Portif-lio/';
const out=path.resolve(process.env.TEST_DIR||'.review/editorial');await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true}),checks=[],errors=[];
const check=(name,pass,detail)=>checks.push({name,pass,detail});
try{
 for(const [width,height] of [[320,780],[360,800],[390,844],[768,1024],[1024,768],[1440,900],[1920,1080],[1440,600]]){
  const context=await browser.newContext({viewport:{width,height}}),page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base,{waitUntil:'networkidle'});
  const bounds=()=>page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,missing:[...document.images].filter(i=>i.getClientRects().length&&i.complete&&!i.naturalWidth).length}));
  let b=await bounds();check(`Closed layout ${width}x${height}`,b.width===b.scroll&&!b.missing,b);
  await page.locator('.explorer-trigger').click();
  for(const id of ['aatamed','horus','atena']){
   const button=page.locator(`[data-select="${id}"]`);await button.focus();await page.keyboard.press('Space');await page.waitForTimeout(420);
   check(`Preview keyboard ${width} ${id}`,await button.getAttribute('aria-pressed')==='true'&&await button.evaluate(e=>e===document.activeElement)&&await page.locator('[data-panel]:visible').count()===1&&await page.locator(`[data-panel="${id}"]`).isVisible());
   b=await bounds();check(`Selected layout ${width} ${id}`,b.width===b.scroll&&!b.missing,b);
   const rests=await page.waitForFunction(()=>document.getAnimations().filter(a=>!a.effect?.target?.closest('[data-ambient]')).every(a=>a.playState!=='running'),{},{timeout:1000}).then(()=>true,()=>false);
   check(`Resting scene ${width} ${id}`,rests,await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running'&&!a.effect?.target?.closest('[data-ambient]')).map(a=>({target:a.effect?.target?.className,timing:a.effect?.getComputedTiming()}))));
  }
  if([390,1440].includes(width)&&height!==600){const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();check(`Axe selected ${width}`,!axe.violations.length,axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})));}
  if(width===390){
   await page.evaluate(()=>{document.querySelectorAll('.project-selection p,.project-selection h3,.project-selection button,.project-selection a').forEach(e=>e.style.fontSize=`${parseFloat(getComputedStyle(e).fontSize)*2}px`);});
   b=await bounds();check('Text enlargement 200 percent',b.width===b.scroll,b);
  }
  await context.close();
 }
 const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'}),page=await context.newPage();
 await page.goto(base+'#atena',{waitUntil:'networkidle'});check('Direct fragment selects Atena',await page.locator('[data-panel="atena"]').isVisible()&&await page.locator('[data-explorer]').evaluate(e=>e.open));
 await page.locator('[data-select="horus"]').click();check('Reduced motion has no animation',await page.evaluate(()=>document.getAnimations().length===0));
 await page.locator('[data-panel="horus"] .preview-case-link').click();await page.waitForURL('**/casos/horus/');await page.goBack({waitUntil:'networkidle'});
 check('Preview CTA browser return restores Hórus',await page.locator('[data-panel="horus"]').isVisible()&&await page.locator('#horus .project-card').evaluate(e=>e===document.activeElement));
 await context.close();
 check('No page errors',errors.length===0,errors);
}finally{await browser.close();}
await fs.writeFile(path.join(out,'editorial-results.json'),JSON.stringify({checks,errors,passed:checks.every(c=>c.pass)},null,2));
console.log(JSON.stringify({checks:checks.length,passed:checks.filter(c=>c.pass).length,failed:checks.filter(c=>!c.pass)},null,2));
if(checks.some(c=>!c.pass)){console.log(JSON.stringify(checks.filter(c=>!c.pass)));process.exitCode=1;}
