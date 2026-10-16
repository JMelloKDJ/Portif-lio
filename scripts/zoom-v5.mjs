import fs from 'node:fs/promises';
import path from 'node:path';
import {chromium} from 'playwright';
const out=path.resolve(process.env.TEST_DIR||path.resolve(import.meta.dirname,'../.review/v5-tests'));await fs.mkdir(out,{recursive:true});
const base=process.env.PREVIEW_URL||'http://127.0.0.1:4173/Portif-lio/';
const beforeDir=await fs.mkdtemp(path.join(out,'zoom-baseline-'));
const options={channel:'msedge',headless:true,viewport:null,args:['--window-size=1440,900']};
const before=await chromium.launchPersistentContext(beforeDir,options),bp=await before.newPage();await bp.goto(base);
const unzoomed=await bp.evaluate(()=>({width:innerWidth,dpr:devicePixelRatio,scale:visualViewport.scale}));await before.close();
const profile=await fs.mkdtemp(path.join(out,'zoom-200-'));await fs.mkdir(path.join(profile,'Default'),{recursive:true});
const level=Math.log(2)/Math.log(1.2);
await fs.writeFile(path.join(profile,'Default/Preferences'),JSON.stringify({partition:{default_zoom_level:{x:level},per_host_zoom_levels:{x:{'127.0.0.1':{zoom_level:level,last_modified:'0'}}}}}));
const context=await chromium.launchPersistentContext(profile,options),page=await context.newPage(),routes=[];
for(const route of ['','casos/aatamed/','casos/horus/','casos/atena/','casos/horus/demonstracao/']){
 await page.goto(base+route,{waitUntil:'networkidle'});
 routes.push({route,...await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,dpr:devicePixelRatio,scale:visualViewport.scale,canvas:document.querySelectorAll('canvas').length}))});
 if(!route){await page.locator('.explorer-trigger').click();await page.waitForTimeout(550);routes.push({route:'selection-open',...await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,dpr:devicePixelRatio,scale:visualViewport.scale}))});const cdp=await context.newCDPSession(page);const shot=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false,fromSurface:true});await fs.writeFile(path.join(out,'browser-zoom-200.png'),Buffer.from(shot.data,'base64'));}
}
const result={browser:context.browser().version(),unzoomed,routes,zoom200Verified:routes.every(r=>r.dpr/unzoomed.dpr===2&&r.scale===1),noOverflow:routes.every(r=>r.width===r.scroll),note:'Actual browser host zoom configured only in fresh disposable test profiles. Real HTTP, no page transformation.'};
await context.close();await fs.writeFile(path.join(out,'zoom.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));if(!result.zoom200Verified||!result.noOverflow)process.exitCode=1;
