import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const encoded=async name=>(await fs.readFile(path.join(root,'assets',name))).toString('base64');
const [sans,display,photo,mask]=await Promise.all(['manrope-latin.woff2','instrument-serif-latin.woff2','joao-victor-original.webp','joao-victor-mask.webp'].map(encoded));
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1200,height:630}});
await page.setContent(`<html lang="pt-BR"><head><style>
@font-face{font-family:Manrope;src:url(data:font/woff2;base64,${sans})}@font-face{font-family:Instrument;src:url(data:font/woff2;base64,${display})}
*{box-sizing:border-box}body{margin:0;background:#090b0f;color:#f1f3f7;font-family:Manrope,Arial}main{position:relative;z-index:2;padding:106px 80px}
small{font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#b1c0d6}h1{font:400 110px/1.04 Instrument,Georgia;letter-spacing:-3.5px;margin:28px 0 20px}h2{font-size:32px;line-height:1.5;color:#78a2ff;font-weight:450;letter-spacing:-1px;margin:0}p{font-size:21px;color:#b8c2d2;line-height:1.75;margin:32px 0 0}
.photo{position:absolute;right:40px;bottom:0;width:425px;height:auto;filter:grayscale(.5) brightness(.84) contrast(1.07);mask-image:url(data:image/webp;base64,${mask}),linear-gradient(90deg,transparent,#000 23%,#000 77%,transparent),linear-gradient(#000 62%,#000d 74%,transparent 98%);mask-mode:luminance,alpha,alpha;mask-size:100% 100%;mask-position:center;mask-repeat:no-repeat;mask-composite:intersect}
footer{position:absolute;bottom:40px;left:80px;color:#a2afc4;font-size:13px;border-top:1px solid #282f3b;padding-top:20px;width:1040px}
</style></head><body><main><small>Engenharia de Produção · UFBA</small><h1>João Victor.</h1><h2>Dados &amp; IA.</h2><p>Conecto análise e tecnologia<br>para resolver problemas reais.</p></main><img class="photo" src="data:image/webp;base64,${photo}" alt="Retrato de João Victor"><footer>Salvador, Bahia &nbsp; / &nbsp; Portfólio pessoal</footer></body></html>`);
await page.evaluate(()=>document.fonts.ready);await page.locator('img').evaluate(i=>i.decode());
await page.screenshot({path:path.join(root,'assets/social.png')});await browser.close();
