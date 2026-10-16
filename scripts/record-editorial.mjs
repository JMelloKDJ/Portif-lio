import {chromium} from 'playwright';import fs from 'node:fs/promises';import path from 'node:path';
const out=path.resolve(process.env.RECORD_DIR||'.review/editorial-recordings');await fs.mkdir(out,{recursive:true});
const base=process.env.PREVIEW_URL||'http://127.0.0.1:4173/Portif-lio/';const browser=await chromium.launch({channel:'msedge',headless:true});
for(const [name,width,height] of [['desktop',1440,900],['mobile',390,844]]){
 const context=await browser.newContext({viewport:{width,height},isMobile:name==='mobile',hasTouch:name==='mobile',recordVideo:{dir:out,size:{width,height}}}),page=await context.newPage(),events=[];
 const mark=async event=>events.push({event,...await page.evaluate(()=>({time:performance.now(),scrollY,url:location.href,selected:document.querySelector('[data-select]:checked')?.dataset.select,animations:document.getAnimations().filter(a=>a.playState==='running').length}))});
 const scroll=async selector=>{
  const target=await page.locator(selector).evaluate(e=>Math.min(document.documentElement.scrollHeight-innerHeight,Math.max(0,e.getBoundingClientRect().top+scrollY-24)));
  for(let n=0;n<100;n++){const y=await page.evaluate(()=>scrollY);if(Math.abs(target-y)<2)break;await page.mouse.wheel(0,Math.sign(target-y)*Math.min(100,Math.abs(target-y)));await page.waitForTimeout(45);}
 };
 const activate=async selector=>name==='mobile'?page.locator(selector).tap():page.locator(selector).click();
 await page.goto(base,{waitUntil:'networkidle'});await mark('hero');await page.waitForTimeout(3500);
 await scroll('#projetos');await page.waitForTimeout(800);await mark('closed');
 await activate('.explorer-trigger');await page.waitForTimeout(900);await mark('delta-open');
 await activate('label[for="select-horus"]');await page.waitForTimeout(800);await mark('horus-selected');
 await activate('label[for="select-atena"]');await page.waitForTimeout(900);await mark('atena-selected');
 if(name==='mobile')await scroll('[data-panel="atena"]');await page.waitForTimeout(1000);
 await activate('[data-panel="atena"] .preview-case-link');await page.waitForURL('**/casos/atena/');await page.waitForLoadState('networkidle');await mark('atena-case');await page.waitForTimeout(1000);
 await page.locator('.back').click();await page.waitForURL('**/#atena');await page.waitForTimeout(700);await mark('restored');
 await scroll('#sobre');await page.waitForTimeout(6000);await mark('about-motion');await scroll('#contato');await activate('.closing-fold .motion-toggle');await page.waitForTimeout(900);await mark('paused');await activate('.closing-fold .motion-toggle');await page.waitForTimeout(1600);await mark('resumed');
 await scroll('#contato');await page.waitForTimeout(1800);await mark('contact');
 const video=page.video();await context.close();await video.saveAs(path.join(out,`${name}-interacao.webm`));
 await fs.writeFile(path.join(out,`${name}-eventos.json`),JSON.stringify({browser:browser.version(),viewport:{width,height},transport:'Real local HTTP; Playwright pointer/touch activation and wheel input. Mobile emulated, not a physical handset. No route fulfillment or fabricated frames.',events},null,2));
 console.log(name+' recorded');
}await browser.close();
