import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
const out=process.env.RECORD_DIR||path.resolve(import.meta.dirname,'../.review/v3-recordings');await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--enable-unsafe-swiftshader']});
for(const [name,width,height] of [['desktop',1440,900],['mobile',390,844]]){
 const context=await browser.newContext({viewport:{width,height},recordVideo:{dir:out,size:{width,height}}});
 const page=await context.newPage(),trace=[];
 await page.goto(process.env.PREVIEW_URL||'http://127.0.0.1:4173/Portif-lio/',{waitUntil:'networkidle'});
 // Hold the real first screen long enough to record erasure and rewriting.
 await page.waitForTimeout(name==='desktop'?9500:4500);
 async function scrollToElement(selector){
  const to=await page.locator(selector).evaluate(el=>Math.max(0,Math.min(el.getBoundingClientRect().top+scrollY+el.clientHeight/2-innerHeight/2,document.documentElement.scrollHeight-innerHeight)));
  let y=await page.evaluate(()=>scrollY);
  for(let guard=0;Math.abs(to-y)>3&&guard<180;guard++){
   await page.mouse.wheel(0,Math.sign(to-y)*Math.min(42,Math.abs(to-y)));
   await page.waitForTimeout(45);
   y=await page.evaluate(()=>scrollY);
   trace.push(await page.evaluate(()=>({time:performance.now(),y:scrollY,state:{...document.querySelector('[data-scene]').dataset}})));
  }
  await page.waitForTimeout(650);
 }
 for(const selector of ['#aatamed','#horus','#atena','#sobre','#contato'])await scrollToElement(selector);
 if(name==='desktop'){await scrollToElement('#atena');await scrollToElement('#horus');await scrollToElement('#aatamed');}
 const video=page.video();await context.close();await video.saveAs(path.join(out,`${name}-scroll.webm`));
 await fs.writeFile(path.join(out,`${name}-trace.json`),JSON.stringify({browser:browser.version(),viewport:{width,height},transport:'Real local HTTP. Playwright wheel input. No request fulfillment or frame synthesis.',trace},null,2));
 console.log(JSON.stringify({name,samples:trace.length,last:trace.at(-1)}));
}
await browser.close();
