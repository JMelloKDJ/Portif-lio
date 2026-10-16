import {chromium} from 'playwright';import fs from 'node:fs/promises';import path from 'node:path';
const out=path.resolve(process.env.CAPTURE_DIR||'.review/v5-evidence');await fs.mkdir(out,{recursive:true});const base=process.env.PREVIEW_URL||'http://127.0.0.1:4173/Portif-lio/';
const browser=await chromium.launch({channel:'msedge',headless:true}),states=[];
for(const [width,height] of [[390,844],[1440,900],[320,780],[768,1024],[1440,600]]){
 const page=await browser.newPage({viewport:{width,height}});await page.goto(base,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
 await page.screenshot({path:path.join(out,`${width}-${height}-hero.png`)});
 for(const mode of ['closed','open']){
  if(mode==='open'){await page.locator('.explorer-trigger').click();await page.waitForTimeout(600);}
  await page.locator('#projetos').evaluate(el=>scrollTo({top:el.getBoundingClientRect().top+scrollY-16,behavior:'instant'}));
  await page.locator(mode==='open'?'.choice-cover img':'.explorer-teaser img').evaluateAll(images=>Promise.all(images.map(i=>i.decode())));
  await page.mouse.move(width-8,8);await page.screenshot({path:path.join(out,`${width}-${height}-${mode}.png`)});
  states.push({width,height,mode,...await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,sectionHeight:document.querySelector('#projetos').clientHeight,homeHeight:document.documentElement.scrollHeight,open:document.querySelector('[data-explorer]').open,ghosts:document.querySelectorAll('.explorer-flight').length}))});
 }
 if(width===390||width===1440&&height===900){
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:path.join(out,`${width}-${height}-full-open.png`),fullPage:true});
  await page.locator('#horus .project-card').click();await page.waitForURL('**/casos/horus/');await page.waitForLoadState('networkidle');await page.screenshot({path:path.join(out,`${width}-${height}-detail.png`)});
  await page.locator('.back').click();await page.waitForURL('**/#horus');await page.waitForTimeout(600);await page.screenshot({path:path.join(out,`${width}-${height}-returned.png`)});
  await page.keyboard.press('Escape');await page.waitForTimeout(600);await page.locator('#projetos').evaluate(el=>scrollTo({top:el.getBoundingClientRect().top+scrollY-16,behavior:'instant'}));await page.screenshot({path:path.join(out,`${width}-${height}-closed-focus.png`)});
 }
 await page.close();
}await browser.close();await fs.writeFile(path.join(out,'states.json'),JSON.stringify(states,null,2));console.log(JSON.stringify(states));
