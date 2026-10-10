import {createServer} from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const port=Number(process.env.PORT||4173),prefix='/Portif-lio/';
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2','.xml':'application/xml','.txt':'text/plain'};
createServer(async(req,res)=>{
 try{
  let u=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(u==='/'){res.writeHead(302,{Location:prefix});res.end();return;}
  if(!u.startsWith(prefix)){res.writeHead(404);res.end('Not found');return;}
  const rel=u.slice(prefix.length),parts=rel.split('/');
  if(parts.some(p=>p.startsWith('.')||p==='node_modules'||p==='scripts'||p==='content')||rel==='README.md'||rel==='package.json'||rel==='package-lock.json')throw new Error('Not public');
  let target=path.resolve(root,rel||'index.html');
  if(!target.startsWith(root+path.sep))throw new Error('Invalid path');
  const stat=await fs.stat(target);
  if(stat.isDirectory()){
   if(!u.endsWith('/')){res.writeHead(301,{Location:u+'/'});res.end();return;}
   target=path.join(target,'index.html');
  }
  res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(await fs.readFile(target));
 }catch{res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(await fs.readFile(path.join(root,'404.html')).catch(()=>Buffer.from('Not found')));}
}).listen(port,'127.0.0.1',()=>console.log(`Preview: http://127.0.0.1:${port}${prefix}`));
