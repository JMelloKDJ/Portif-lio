import fs from 'node:fs/promises';
import path from 'node:path';
import {chromium} from 'playwright';
const out=path.resolve(process.env.TEST_DIR||path.resolve(import.meta.dirname,'../.review/v3-tests'));await fs.mkdir(out,{recursive:true});
const base=process.env.PREVIEW_URL||'http://127.0.0.1:4173/Portif-lio/';
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--enable-unsafe-swiftshader']}),runs=[];
for(const mode of ['desktop-local','mobile-throttled'])for(let run=1;run<=3;run++){
 const context=await browser.newContext({viewport:mode==='desktop-local'?{width:1440,height:900}:{width:390,height:844}});
 await context.addInitScript(()=>{
  window.lab={lcp:0,cls:0,longTasks:[]};
  new PerformanceObserver(list=>{for(const x of list.getEntries())window.lab.lcp=x.startTime;}).observe({type:'largest-contentful-paint',buffered:true});
  new PerformanceObserver(list=>{for(const x of list.getEntries())if(!x.hadRecentInput)window.lab.cls+=x.value;}).observe({type:'layout-shift',buffered:true});
  new PerformanceObserver(list=>{for(const x of list.getEntries())window.lab.longTasks.push(x.duration);}).observe({type:'longtask',buffered:true});
 });
 const page=await context.newPage();const cdp=await context.newCDPSession(page);await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
 if(mode==='mobile-throttled'){await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:93750});await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});}
 await page.goto(base,{waitUntil:'networkidle'});await page.waitForTimeout(1600);
 const metrics=await page.evaluate(()=>{const n=performance.getEntriesByType('navigation')[0],rs=performance.getEntriesByType('resource');return {...window.lab,dcl:n.domContentLoadedEventEnd,load:n.loadEventEnd,htmlBytes:n.encodedBodySize,initialResources:rs.filter(r=>r.name.startsWith(location.origin)).map(r=>({path:new URL(r.name).pathname,bytes:r.encodedBodySize,duration:r.duration})),externalOrigins:[...new Set(rs.filter(r=>!r.name.startsWith(location.origin)&&!r.name.startsWith('data:')).map(r=>new URL(r.name).origin))]};});
 runs.push({mode,run,...metrics});console.log(JSON.stringify({mode,run,lcp:metrics.lcp,cls:metrics.cls,load:metrics.load}));await context.close();
}
const context=await browser.newContext({viewport:{width:1440,height:900}}),page=await context.newPage();await page.goto(base,{waitUntil:'networkidle'});
await page.locator('#aatamed').evaluate(el=>scrollTo({top:el.getBoundingClientRect().top+scrollY+el.clientHeight/2-innerHeight/2,behavior:'instant'}));await page.waitForFunction(()=>document.querySelector('[data-scene]').dataset.scene==='ready');
await page.evaluate(()=>{window.renderSamples=[];let active=true;window.stopSample=()=>active=false;function sample(t){window.renderSamples.push({t,n:Number(document.querySelector('[data-scene]').dataset.renders||0)});if(active)requestAnimationFrame(sample);}requestAnimationFrame(sample);});
for(let i=0;i<60;i++){await page.mouse.wheel(0,20);await page.waitForTimeout(35);}
await page.evaluate(()=>window.stopSample());const samples=await page.evaluate(()=>window.renderSamples);
const active=samples.filter((s,i)=>i&&s.n!==samples[i-1].n);const intervals=active.slice(1).map((s,i)=>s.t-active[i].t).filter(v=>v<150).sort((a,b)=>a-b);
const frames={count:active.length,medianIntervalMs:intervals[Math.floor(intervals.length/2)],p95IntervalMs:intervals[Math.floor(intervals.length*.95)],rendererMode:await page.locator('[data-scene]').getAttribute('data-quality'),note:'Observed render-count changes during real wheel input in headless Edge with SwiftShader. Not physical GPU/mobile evidence.'};
await context.close();
const median=a=>a.sort((x,y)=>x-y)[Math.floor(a.length/2)];
const medians=Object.fromEntries(['desktop-local','mobile-throttled'].map(mode=>[mode,{lcp:median(runs.filter(r=>r.mode===mode).map(r=>r.lcp)),cls:median(runs.filter(r=>r.mode===mode).map(r=>r.cls)),load:median(runs.filter(r=>r.mode===mode).map(r=>r.load))}]));
await fs.writeFile(path.join(out,'performance.json'),JSON.stringify({browser:browser.version(),transport:'Real HTTP, fresh browser contexts, cache disabled. Host antivirus injection retained and origins recorded.',throttle:'mobile: 150ms latency, 1.6Mbit/s download, 4x CPU. Desktop: unthrottled loopback.',portrait:'Actual supplied portrait included: responsive WebP 540w / 900w. HTML image, separate from WebGL.',runs,medians,frames,fieldINP:'not measured'},null,2));
console.log(JSON.stringify({medians,frames}));await browser.close();
