import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root=path.resolve(import.meta.dirname,'..');
const dest=path.resolve(process.env.DELIVERY_DIR||path.join(root,'../delivery-v2'));
if(dest===root||dest.startsWith(root+path.sep))throw new Error('Delivery must be outside public source.');
await fs.mkdir(dest,{recursive:true});
const source=path.join(dest,'source/Portif-lio'),dist=path.join(dest,'dist/Portif-lio'),review=path.join(dest,'review');
await Promise.all([source,dist,review].map(p=>fs.mkdir(p,{recursive:true})));
const ignore=new Set(['.git','node_modules','.review']);
for(const entry of await fs.readdir(root,{withFileTypes:true})){
 if(ignore.has(entry.name)||entry.name.endsWith('.log'))continue;
 await fs.cp(path.join(root,entry.name),path.join(source,entry.name),{recursive:true});
}
for(const name of ['index.html','404.html','.nojekyll','robots.txt','sitemap.xml','assets','casos'])await fs.cp(path.join(root,name),path.join(dist,name),{recursive:true});
const copies=[['.review/v2-round1','screenshots'],['.review/v2-final-recordings','recordings']];
for(const [from,to] of copies)await fs.cp(path.join(root,from),path.join(review,to),{recursive:true});
await fs.mkdir(path.join(review,'checks'),{recursive:true});
for(const name of ['results.json','initial-results.json','zoom.json','performance.json','no-js.png','no-webgl.png','reduced-motion.png','context-loss.png','bundle-failure.png','texture-failure.png','text-200.png','browser-zoom-200.png'])await fs.copyFile(path.join(root,'.review/v2-tests',name),path.join(review,'checks',name));
await fs.copyFile(path.join(root,'.review/structural.json'),path.join(review,'checks/structural.json'));
async function walk(dir,prefix=''){let files=[];for(const d of await fs.readdir(dir,{withFileTypes:true})){const rel=path.posix.join(prefix,d.name);if(d.isDirectory())files.push(...await walk(path.join(dir,d.name),rel));else{const bytes=await fs.readFile(path.join(dir,d.name));files.push({path:rel,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});}}return files;}
const manifest=await walk(dist);await fs.writeFile(path.join(review,'build-manifest.json'),JSON.stringify({files:manifest,bytes:manifest.reduce((n,f)=>n+f.bytes,0)},null,2));
const old=await walk(path.join(dest,'baseline')),now=await walk(source),map=new Map(old.map(x=>[x.path,x]));
await fs.writeFile(path.join(review,'baseline-comparison.json'),JSON.stringify({changed:now.filter(x=>map.has(x.path)&&map.get(x.path).sha256!==x.sha256).map(x=>x.path),added:now.filter(x=>!map.has(x.path)).map(x=>x.path),removed:old.filter(x=>!now.some(y=>y.path===x.path)).map(x=>x.path),unchanged:now.filter(x=>map.get(x.path)?.sha256===x.sha256).map(x=>x.path)},null,2));
console.log(JSON.stringify({dest,source,dist,files:manifest.length,bytes:manifest.reduce((n,f)=>n+f.bytes,0)}));
