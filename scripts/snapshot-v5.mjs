import fs from 'node:fs/promises';import path from 'node:path';import {createHash} from 'node:crypto';
const root=path.resolve(import.meta.dirname,'..'),out=path.join(root,'.review/v5-tests');
const files=['index.html','assets/explorer.css','assets/explorer.js','assets/site-v4.css','assets/site.js','content/portfolio.json','scripts/home-v5.mjs','scripts/explorer.mjs','scripts/build-v2.mjs','casos/aatamed/index.html','casos/horus/index.html','casos/atena/index.html'];
const hashes=await Promise.all(files.map(async file=>({file,sha256:createHash('sha256').update(await fs.readFile(path.join(root,file))).digest('hex')})));
const previous=JSON.parse(await fs.readFile(path.join(out,'served-hashes.json'),'utf8'));
const changed=hashes.filter(h=>previous.files.find(p=>p.file===h.file)?.sha256!==h.sha256).map(h=>h.file);
await fs.writeFile(path.join(out,'served-hashes.json'),JSON.stringify({...previous,at:new Date().toISOString(),files:hashes,changedSincePreviousSnapshot:changed},null,2));console.log(JSON.stringify({changed}));
