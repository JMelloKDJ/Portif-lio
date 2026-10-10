import {chromium} from 'playwright';import fs from 'node:fs/promises';import path from 'node:path';
const out=path.resolve(process.env.RECORD_DIR||'.review/v5-recordings');await fs.mkdir(out,{recursive:true});const base=process.env.PREVIEW_URL||'http://127.0.0.1:4173/Portif-lio/';
const browser=await chromium.launch({channel:'msedge',headless:true});
for(const [name,width,height] of [['desktop',1440,900],['mobile',390,844]]){
 const context=await browser.newContext({viewport:{width,height},hasTouch:name==='mobile',recordVideo:{dir:out,size:{width,height}}});const page=await context.newPage(),events=[];
 const mark=async event=>events.push({event,...await page.evaluate(()=>({time:performance.timeOrigin+performance.now(),y:scrollY,path:location.pathname+location.hash,open:document.querySelector('[data-explorer]')?.open,focus:document.activeElement?.getAttribute('aria-label')||document.activeElement?.className}))});
 async function wheelTo(selector,center=false){
  const target=await page.locator(selector).evaluate((el,center)=>Math.max(0,Math.min(el.getBoundingClientRect().top+scrollY-(center?innerHeight/2-el.clientHeight/2:24),document.documentElement.scrollHeight-innerHeight)),center);
  for(let n=0;n<220;n++){const y=await page.evaluate(()=>scrollY);if(Math.abs(target-y)<3)break;await page.mouse.wheel(0,Math.sign(target-y)*Math.min(90,Math.abs(target-y)));await page.waitForTimeout(45);}
 }
 const activate=async locator=>{if(name==='mobile')await locator.tap();else await locator.click();};
 await page.goto(base,{waitUntil:'networkidle'});await mark('hero');await page.waitForTimeout(1700);
 await wheelTo('#projetos');await page.waitForTimeout(1000);await mark('closed');
 await activate(page.locator('.explorer-trigger'));await mark('opening');await page.waitForTimeout(1500);await mark('open');
 await activate(page.locator('#horus .project-card'));await page.waitForURL('**/casos/horus/');await page.waitForLoadState('networkidle');await mark('detail-horus');await page.waitForTimeout(1300);
 await wheelTo('.case-visual',true);await page.waitForTimeout(1000);
 await wheelTo('.back');await activate(page.locator('.back'));await page.waitForURL('**/#horus');await page.waitForTimeout(1000);await mark('returned-open');
 await activate(page.locator('#atena .project-card'));await page.waitForURL('**/casos/atena/');await page.waitForLoadState('networkidle');await page.waitForTimeout(1000);await mark('detail-atena');
 await page.goBack({waitUntil:'domcontentloaded'});await page.waitForTimeout(1000);await mark('browser-back-atena');
 await page.keyboard.press('Escape');await page.waitForTimeout(750);await mark('closed-escape');
 await page.keyboard.press('Enter');await page.waitForTimeout(850);await mark('reopened');
 await wheelTo('#sobre');await page.waitForTimeout(700);await wheelTo('#contato');await page.waitForTimeout(1100);await mark('contact');
 const video=page.video();await context.close();await video.saveAs(path.join(out,`${name}-interaction.webm`));
 await fs.writeFile(path.join(out,`${name}-trace.json`),JSON.stringify({browser:browser.version(),viewport:{width,height},transport:'Actual local HTTP. Real pointer/touch activation, wheel input, Escape, Enter and case navigation. No request fulfillment or synthesized frames.',events},null,2));console.log(JSON.stringify({name,events:events.length}));
}await browser.close();
