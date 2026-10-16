import fs from 'node:fs/promises';import {chromium} from 'playwright';
const out='.review/v5-tests';await fs.mkdir(out,{recursive:true});const browser=await chromium.launch({channel:'msedge',headless:true}),checks=[];
for(const width of [320,360,390,768,1024,1440,1920]){
 const page=await browser.newPage({viewport:{width,height:900}});await page.goto('http://127.0.0.1:4173/Portif-lio/',{waitUntil:'networkidle'});
 const state=await page.evaluate(()=>{const section=document.querySelector('[data-explorer]').getBoundingClientRect();return {width:innerWidth,overflow:document.documentElement.scrollWidth-innerWidth,clearance:Math.min(...[...document.querySelectorAll('.stack-plane')].map(el=>section.bottom-el.getBoundingClientRect().bottom))};});
 checks.push({...state,pass:state.overflow===0&&state.clearance>=8});
 if(width===1920){await page.locator('#projetos').scrollIntoViewIfNeeded();await page.screenshot({path:out+'/1920-stack.png'});}
 await page.close();
}await browser.close();await fs.writeFile(out+'/stack-bounds.json',JSON.stringify(checks,null,2));console.log(JSON.stringify(checks));if(checks.some(c=>!c.pass))process.exitCode=1;
