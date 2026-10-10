import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root=path.resolve(import.meta.dirname,'..');
const dest=path.resolve(process.env.DELIVERY_DIR||path.join(root,'../delivery-v5'));
if(dest===root||dest.startsWith(root+path.sep))throw new Error('Delivery must be outside source.');
const source=path.join(dest,'source/Portif-lio'),dist=path.join(dest,'dist/Portif-lio'),review=path.join(dest,'review');
await Promise.all([source,dist,review].map(p=>fs.mkdir(p,{recursive:true})));
for(const entry of await fs.readdir(root,{withFileTypes:true})){
 if(['.git','node_modules','.review'].includes(entry.name)||entry.name.endsWith('.log'))continue;
 await fs.cp(path.join(root,entry.name),path.join(source,entry.name),{recursive:true});
}
for(const name of ['index.html','404.html','.nojekyll','robots.txt','sitemap.xml','assets','casos'])await fs.cp(path.join(root,name),path.join(dist,name),{recursive:true});
await fs.cp(path.join(root,'.review/v5-evidence'),path.join(review,'screenshots'),{recursive:true});
await fs.mkdir(path.join(review,'recordings'),{recursive:true});
for(const name of ['desktop-interaction.mp4','mobile-interaction.mp4','desktop-interaction.webm','mobile-interaction.webm','desktop-trace.json','mobile-trace.json','desktop-frames.jpg','mobile-frames.jpg'])await fs.copyFile(path.join(root,'.review/v5-recordings',name),path.join(review,'recordings',name));
await fs.mkdir(path.join(review,'checks'),{recursive:true});
for(const entry of await fs.readdir(path.join(root,'.review/v5-tests'),{withFileTypes:true}))if(entry.isFile()&&/\.(json|png)$/.test(entry.name))await fs.copyFile(path.join(root,'.review/v5-tests',entry.name),path.join(review,'checks',entry.name));
await fs.copyFile(path.join(root,'.review/structural.json'),path.join(review,'checks/structural.json'));
async function walk(dir,prefix=''){let entries=[];for(const f of await fs.readdir(dir,{withFileTypes:true})){const name=path.posix.join(prefix,f.name);if(f.isDirectory())entries.push(...await walk(path.join(dir,f.name),name));else{const data=await fs.readFile(path.join(dir,f.name));const actual=await fs.readFile(path.join(root,name));if(!data.equals(actual))throw new Error('Mismatch: '+name);entries.push({path:name,bytes:data.length,sha256:createHash('sha256').update(data).digest('hex')});}}return entries;}
const files=await walk(dist);await fs.writeFile(path.join(review,'build-manifest.json'),JSON.stringify({matchesLocalSource:true,files,bytes:files.reduce((s,f)=>s+f.bytes,0)},null,2));
console.log(JSON.stringify({source,dist,files:files.length,bytes:files.reduce((s,f)=>s+f.bytes,0)}));
