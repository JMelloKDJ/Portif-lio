import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {gzipSync} from 'node:zlib';
const root=path.resolve(import.meta.dirname,'..');
const c=JSON.parse(await fs.readFile(path.join(root,'content/portfolio.json'),'utf8'));
const pages=['index.html','404.html',...c.cases.map(x=>`casos/${x.slug}/index.html`),'casos/horus/demonstracao/index.html'];
let links=0;
for(const route of pages){
 const html=await fs.readFile(path.join(root,route),'utf8');
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1,route+': one h1');
 assert.match(html,/<html lang="pt-BR">/);
 assert.match(html,/<main id="conteudo"/);
 assert.match(html,/<meta name="description"/);
 assert.match(html,/<link rel="canonical" href="https:\/\/jmellokdj.github.io\/Portif-lio\//);
 assert.doesNotMatch(html,/app\.powerbi\.com|<iframe|PORTFOLIO_(REDESIGN_BRIEF|DIRECAO)|96,36|\+20|\+12|Bruma/);
 for(const match of html.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)){
  const href=match[1];if(/^(https?:|mailto:|tel:)/.test(href))continue;
  let file=href.startsWith('/Portif-lio/')?path.join(root,href.slice(12)):path.resolve(root,path.dirname(route),href);
  const st=await fs.stat(file).catch(()=>null);
  assert.ok(st,`${route}: missing ${href}`);
  if(st.isDirectory())assert.ok((await fs.stat(path.join(file,'index.html'))).isFile());
  links++;
 }
}
const sizes={};let js=0,svg=0;
for(const name of await fs.readdir(path.join(root,'assets'),{recursive:true})){
 if((await fs.stat(path.join(root,'assets',name))).isDirectory())continue;
 const b=await fs.readFile(path.join(root,'assets',name));sizes[name]={bytes:b.length,gzip:gzipSync(b).length};
 if(name.endsWith('.js'))js+=gzipSync(b).length;
 if(name.endsWith('.svg'))svg+=b.length;
}
assert.ok(js<300*1024,`JS gzip budget: ${js}`);
assert.ok(svg<102400,`SVG budget: ${svg}`);
assert.ok(sizes['manrope-latin.woff2'].bytes<66560);
for(const x of c.cases){assert.equal(x.publication,'public');for(const key of ['context','role','collaboration','stage','period','solutions','evidence','result','limitations','links','cover','alt'])assert.ok(x[key],x.slug+': '+key);}
assert.deepEqual(c.cases.filter(x=>x.featured).map(x=>x.slug),['aatamed','horus','atena']);
const home=await fs.readFile(path.join(root,'index.html'),'utf8');
assert.equal((home.match(/data-project=/g)||[]).length,3);
assert.equal((home.match(/data-explorer/g)||[]).length,1);
assert.match(home,/<details class="project-explorer"/);
assert.doesNotMatch(home,/scene-host|class="chapter/);
if(!c.person.portrait)assert.match(home,/Retrato real pendente/);
if(!c.person.resume)assert.doesNotMatch(home,/>Currículo/);
await fs.mkdir(path.join(root,'.review'),{recursive:true});
await fs.writeFile(path.join(root,'.review/structural.json'),JSON.stringify({pages:pages.length,localReferences:links,sizes,totalJSGzip:js,totalSVG:svg},null,2));
console.log(JSON.stringify({pages:pages.length,localReferences:links,totalJSGzip:js,totalSVG:svg,passed:true}));
