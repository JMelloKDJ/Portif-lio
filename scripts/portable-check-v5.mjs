import fs from 'node:fs/promises';
import path from 'node:path';
import {createServer} from 'node:http';
import {chromium} from 'playwright';
const root=path.resolve(process.env.PORTABLE_ROOT||'.');
const out=path.resolve(process.env.PORTABLE_RESULT||'.review/portable.json');
const prefix='/Portif-lio/';
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2','.txt':'text/plain'};
const server=createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');if(!url.pathname.startsWith(prefix))throw new Error('prefix');let file=path.resolve(root,decodeURIComponent(url.pathname.slice(prefix.length))||'index.html');if(!file.startsWith(root+path.sep))throw new Error('path');if((await fs.stat(file)).isDirectory())file=path.join(file,'index.html');res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(await fs.readFile(file));}catch{res.writeHead(404);res.end('Not found');}});
await new Promise(resolve=>server.listen(4184,'127.0.0.1',resolve));
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--enable-unsafe-swiftshader']});
const checks=[],page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().startsWith('http://127.0.0.1:4184')&&r.status()>=400)errors.push({url:r.url(),status:r.status()});});
try{
 for(const route of ['','casos/aatamed/','casos/horus/','casos/atena/','casos/matrix/','casos/horus/demonstracao/']){
  const response=await page.goto('http://127.0.0.1:4184'+prefix+route,{waitUntil:'networkidle'});
  if(!route&&!await page.locator('[data-explorer]').evaluate(el=>el.open))await page.locator('.explorer-trigger').click();
  await page.waitForTimeout(550);
  for(const image of await page.locator('img:not(.explorer-flight):visible').all()){await image.scrollIntoViewIfNeeded();await image.evaluate(i=>i.decode());}
  const images=await page.evaluate(()=>[...document.images].filter(i=>i.getClientRects().length).every(i=>i.complete&&i.naturalWidth>0));checks.push({route,status:response.status(),images});
 }
 await page.goto('http://127.0.0.1:4184'+prefix,{waitUntil:'networkidle'});if(!await page.locator('[data-explorer]').evaluate(el=>el.open))await page.locator('.explorer-trigger').click();await page.waitForTimeout(550);
 const selection=await page.locator('.project-card:visible').count()===3;await fs.mkdir(path.dirname(out),{recursive:true});await page.screenshot({path:out.replace('.json','.png')});
 const result={browser:browser.version(),root,checks,selection,errors,pass:selection&&errors.length===0&&checks.every(c=>c.status===200&&c.images)};await fs.writeFile(out,JSON.stringify(result,null,2));console.log(JSON.stringify(result));if(!result.pass)process.exitCode=1;
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
