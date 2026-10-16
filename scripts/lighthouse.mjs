import fs from 'node:fs/promises';
import path from 'node:path';
import {chromium} from 'playwright';
import lighthouse from 'lighthouse';
import {exactBuild} from './test-support.mjs';
import os from 'node:os';
const root=path.resolve(import.meta.dirname,'..');
const output=path.join(root,'.review/lighthouse');await fs.mkdir(output,{recursive:true});
const profileDir=await fs.mkdtemp(path.join(os.tmpdir(),'portfolio-lighthouse-'));
const context=await chromium.launchPersistentContext(profileDir,{channel:process.env.BROWSER_CHANNEL||'msedge',headless:true,args:['--remote-debugging-port=9225','--enable-unsafe-swiftshader']});
await exactBuild(context,root);
const runs=[];
try{
 for(const profile of ['mobile','desktop'])for(let i=1;i<=3;i++){
  const options={port:9225,logLevel:'error',output:'json',onlyCategories:['performance','accessibility','best-practices','seo']};
  if(profile==='desktop')Object.assign(options,{formFactor:'desktop',screenEmulation:{mobile:false,width:1440,height:900,deviceScaleFactor:1,disabled:false},throttling:{rttMs:40,throughputKbps:10240,cpuSlowdownMultiplier:1,requestLatencyMs:0,downloadThroughputKbps:0,uploadThroughputKbps:0}});
  const {lhr,report}=await lighthouse('http://127.0.0.1:4173/Portif-lio/',options);
  await fs.writeFile(path.join(output,`${profile}-${i}.json`),report);
  const result={profile,run:i,version:lhr.lighthouseVersion,url:lhr.finalDisplayedUrl,fetchTime:lhr.fetchTime,scores:Object.fromEntries(Object.entries(lhr.categories).map(([k,v])=>[k,Math.round(v.score*100)])),lcp:lhr.audits['largest-contentful-paint'].numericValue,cls:lhr.audits['cumulative-layout-shift'].numericValue,tbt:lhr.audits['total-blocking-time'].numericValue,settings:lhr.configSettings,issues:Object.entries(lhr.audits).filter(([,a])=>a.score!==null&&a.score<.9).map(([id,a])=>({id,title:a.title,score:a.score,displayValue:a.displayValue}))};
  runs.push(result);console.log(JSON.stringify({profile,run:i,scores:result.scores,lcp:result.lcp,cls:result.cls,tbt:result.tbt}));
 }
 const median=a=>a.sort((a,b)=>a-b)[Math.floor(a.length/2)];
 const medians=Object.fromEntries(['mobile','desktop'].map(profile=>{
  const group=runs.filter(r=>r.profile===profile);
  return [profile,{scores:Object.fromEntries(Object.keys(group[0].scores).map(k=>[k,median(group.map(r=>r.scores[k]))])),lcp:median(group.map(r=>r.lcp)),cls:median(group.map(r=>r.cls)),tbt:median(group.map(r=>r.tbt))}];
 }));
 await fs.writeFile(path.join(output,'summary.json'),JSON.stringify({browser:context.browser().version(),transport:'Exact local build intercepted by Playwright to exclude host-injected scripts; raw HTTP results retained separately.',runs,medians,fieldINP:'not measured'},null,2));
 console.log(JSON.stringify({medians}));
}finally{await context.close();}
