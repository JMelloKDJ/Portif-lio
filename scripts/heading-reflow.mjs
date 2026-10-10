import fs from 'node:fs/promises';import path from 'node:path';import {chromium} from 'playwright';
const out=path.resolve(process.env.TEST_DIR||'.review/heading-reflow');await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true}),rows=[];
for(const width of [320,390,1440])for(const scale of [1,2]){
 const ctx=await browser.newContext({viewport:{width,height:width===1440?900:844},reducedMotion:'reduce'}),p=await ctx.newPage();
 await p.goto('http://127.0.0.1:4173/Portif-lio/',{waitUntil:'networkidle'});await p.locator('.explorer-trigger').click();
 if(scale===2)await p.locator('#projects-title').evaluate(e=>e.style.fontSize=parseFloat(getComputedStyle(e).fontSize)*2+'px');
 await p.locator('#projetos').evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));
 const geometry=await p.locator('#projects-title').evaluate(e=>{
  const r=document.createRange();r.selectNodeContents(e);const section=e.closest('#projetos').getBoundingClientRect(),heading=e.closest('.explorer-heading').getBoundingClientRect(),box=e.getBoundingClientRect();
  const rects=[...r.getClientRects()].filter(x=>x.width>0).map(x=>x.toJSON());
  const count=document.querySelector('.collection-count'),c=count.getBoundingClientRect();
  const allFit=rects.every(x=>x.left>=section.left-.5&&x.right<=section.right+.5&&x.top>=section.top-.5&&x.bottom<=section.bottom+.5);
  const countOverlaps=getComputedStyle(count).display!=='none'&&rects.some(x=>x.left<c.right&&x.right>c.left&&x.top<c.bottom&&x.bottom>c.top);
  return {font:getComputedStyle(e).fontSize,text:e.textContent,rects,box:box.toJSON(),heading:heading.toJSON(),section:section.toJSON(),count:c.toJSON(),documentWidth:document.documentElement.scrollWidth,viewport:innerWidth,allFit,countOverlaps,clip:getComputedStyle(document.querySelector('.home-surface')).overflow};
 });
 rows.push({width,scale,...geometry,pass:geometry.allFit&&!geometry.countOverlaps&&geometry.documentWidth===width});
 await p.screenshot({path:path.join(out,`${width}-${scale*100}.png`)});await ctx.close();
}
await browser.close();await fs.writeFile(path.join(out,'heading-reflow.json'),JSON.stringify(rows,null,2));console.log(JSON.stringify(rows.map(({width,scale,pass,allFit,countOverlaps})=>({width,scale,pass,allFit,countOverlaps}))));if(rows.some(x=>!x.pass))process.exitCode=1;
