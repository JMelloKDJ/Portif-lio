import path from 'node:path';
import fs from 'node:fs/promises';
// Serve exact build bytes through browser interception. This keeps machine-level
// injected scripts out of the controlled audit without changing host settings.
// Raw HTTP measurements must be retained separately if the host injects content.
export async function exactBuild(context,root){
 root=path.resolve(root);
 await context.route('http://127.0.0.1:4173/Portif-lio/**',async route=>{
  const u=new URL(route.request().url()),rel=decodeURIComponent(u.pathname.slice('/Portif-lio/'.length));
  let file=path.resolve(root,rel||'index.html');
  if(!file.startsWith(root+path.sep)){await route.abort();return;}
  try{
   if((await fs.stat(file)).isDirectory())file=path.join(file,'index.html');
   const contentType={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.woff2':'font/woff2','.png':'image/png','.txt':'text/plain','.xml':'application/xml'}[path.extname(file)]||'application/octet-stream';
   await route.fulfill({path:file,contentType});
  }catch{await route.fulfill({status:404,body:'Not found'});}
 });
}
