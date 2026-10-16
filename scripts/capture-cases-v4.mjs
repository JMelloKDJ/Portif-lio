import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
const out=path.resolve(process.env.CAPTURE_DIR||path.join(import.meta.dirname,'../.review/v4-verified'));await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
const base=process.env.PREVIEW_URL||'http://127.0.0.1:4173/Portif-lio/';
const results=[];
for(const width of [1440,390]){
 const page=await browser.newPage({viewport:{width,height:width===390?844:900}});
 for(const slug of ['aatamed','horus','atena']){
  await page.goto(base+'casos/'+slug+'/',{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.locator('.case-visual img').evaluate(i=>i.decode());
  await page.screenshot({path:path.join(out,`${width}-case-${slug}-hero.png`)});
  await page.screenshot({path:path.join(out,`${width}-case-${slug}-full.png`),fullPage:true});
  const visual=await page.locator('.case-visual img').evaluate(i=>({image:i.naturalWidth,width:innerWidth,scroll:document.documentElement.scrollWidth}));
  results.push({width,slug,...visual});
 }
 await page.close();
}
await browser.close();
await fs.writeFile(path.join(out,'case-states.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results));
