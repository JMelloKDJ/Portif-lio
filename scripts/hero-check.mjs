import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
const out=path.resolve(process.env.TEST_DIR||path.join(import.meta.dirname,'../.review/v4-tests'));await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
const checks=[],samples=[];
const check=(name,pass,detail={})=>{checks.push({name,pass,...detail});if(!pass)console.error(name,detail);};
const ctx=await browser.newContext({viewport:{width:390,height:844}}),page=await ctx.newPage();
await page.goto('http://127.0.0.1:4173/Portif-lio/',{waitUntil:'networkidle'});
await page.locator('.portrait img').evaluate(i=>i.decode());
check('Original supplied portrait loaded',await page.locator('.portrait img').evaluate(i=>i.currentSrc.endsWith('joao-victor-original-540.webp')&&i.naturalWidth>0));
const mask=await page.locator('.portrait img').evaluate(async i=>{const url=getComputedStyle(i).maskImage.match(/^url\("([^"]+)"\)/)?.[1];if(!url)return {loaded:false};const test=new Image();test.src=url;try{await test.decode();return {loaded:test.naturalWidth===900,path:new URL(url).pathname};}catch{return {loaded:false,path:new URL(url).pathname};}});
check('Foreground mask resolves and decodes',mask.loaded,mask);
for(let i=0;i<64;i++){
 samples.push(await page.evaluate(()=>({word:document.querySelector('[data-typewriter]').textContent,roleHeight:document.querySelector('.hero-role').getBoundingClientRect().height,ctaTop:document.querySelector('.hero-actions').getBoundingClientRect().top,overflow:document.documentElement.scrollWidth-innerWidth})));
 await page.waitForTimeout(200);
}
check('Real erasure and rewrite observed',samples.some(s=>s.word==='Automação.')&&samples.some(s=>s.word==='Análise de dados.')&&samples.some(s=>s.word.length<3));
check('Typing does not move CTA or cause reflow',new Set(samples.map(s=>s.ctaTop)).size===1&&samples.every(s=>s.overflow===0),{heights:[...new Set(samples.map(s=>s.roleHeight))],ctaTops:[...new Set(samples.map(s=>s.ctaTop))]});
await page.locator('.typing-toggle').focus();await page.keyboard.press('Enter');const stopped=await page.locator('[data-typewriter]').textContent();await page.waitForTimeout(1100);
check('Keyboard pause freezes text',stopped===await page.locator('[data-typewriter]').textContent()&&await page.locator('.typing-toggle').getAttribute('aria-pressed')==='true');
await page.keyboard.press('Enter');check('Keyboard resume',await page.locator('.typing-toggle').getAttribute('aria-pressed')==='false');
await page.emulateMedia({reducedMotion:'reduce'});
// MatchMedia's change callback is delivered asynchronously by the browser.
await page.waitForFunction(()=>matchMedia('(prefers-reduced-motion: reduce)').matches&&document.querySelector('[data-typewriter]').textContent==='Dados & IA.');
const text=await page.locator('[data-typewriter]').textContent();await page.waitForTimeout(900);
check('Reduced motion is static',text==='Dados & IA.'&&text===await page.locator('[data-typewriter]').textContent()&&!await page.locator('.typing-toggle').isVisible());
await page.emulateMedia({reducedMotion:'no-preference'});await page.locator('#contato').scrollIntoViewIfNeeded();await page.waitForTimeout(200);const offscreen=await page.locator('[data-typewriter]').textContent();await page.waitForTimeout(1800);
check('Typing stops outside hero',offscreen===await page.locator('[data-typewriter]').textContent());
await fs.writeFile(path.join(out,'hero.json'),JSON.stringify({browser:browser.version(),checks,samples},null,2));
console.log(JSON.stringify({passed:checks.every(c=>c.pass),checks}));await browser.close();if(checks.some(c=>!c.pass))process.exitCode=1;
