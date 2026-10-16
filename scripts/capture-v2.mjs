import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
const out=process.env.CAPTURE_DIR||path.resolve(import.meta.dirname,'../.review/v2-round1');await fs.mkdir(out,{recursive:true});
const base=process.env.PREVIEW_URL||'http://127.0.0.1:4173/Portif-lio/';
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--enable-unsafe-swiftshader']});
const stats=[];
for(const [width,height] of [[1440,900],[390,844],[768,1024],[1440,600]]){
 const context=await browser.newContext({viewport:{width,height}}),page=await context.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base,{waitUntil:'networkidle'});await page.screenshot({path:path.join(out,`${width}-${height}-hero.png`)});
 for(const id of ['aatamed','horus','atena','contato']){
  await page.locator('#'+id).evaluate(el=>window.scrollTo({top:el.getBoundingClientRect().top+scrollY+el.clientHeight/2-innerHeight/2,behavior:'instant'}));
  await page.waitForTimeout(900);
  await page.screenshot({path:path.join(out,`${width}-${height}-${id}.png`)});
  stats.push({width,height,id,state:await page.locator('[data-scene]').evaluate(el=>({...el.dataset})),errors,overflow:await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)});
 }
 // A full-page screenshot cannot represent a moving sticky canvas at several
 // scroll positions. Capture the complete static alternative for this artifact.
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);
 for(const image of await page.locator('img').all()){await image.scrollIntoViewIfNeeded();await image.evaluate(i=>i.decode());}
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
 await page.waitForTimeout(100);
 await page.screenshot({path:path.join(out,`${width}-${height}-full.png`),fullPage:true});
 await context.close();
}
await fs.writeFile(path.join(out,'states.json'),JSON.stringify(stats,null,2));console.log(JSON.stringify(stats));await browser.close();
