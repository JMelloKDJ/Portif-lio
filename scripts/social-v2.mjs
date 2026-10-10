import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const font=(await fs.readFile(path.join(root,'assets/manrope-latin.woff2'))).toString('base64');
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
await page.setContent(`<html lang="pt-BR"><head><style>@font-face{font-family:m;src:url(data:font/woff2;base64,${font})}*{box-sizing:border-box}body{margin:0;background:#080b10;color:#f2f5fa;font-family:m,Arial}main{padding:62px 72px}small{font-size:17px;letter-spacing:3px;color:#a8b7ce}h1{font-size:136px;font-weight:550;line-height:.92;letter-spacing:-10px;margin:39px 0 30px}h1 span{color:#84aeff}p{font-size:26px;color:#c6d0e0;line-height:1.5}footer{position:absolute;bottom:49px;left:72px;right:72px;border-top:1px solid #2a374c;padding-top:22px;display:flex;justify-content:space-between;font-size:15px;color:#aabbd4}.index{position:absolute;right:75px;top:156px;font-size:20px;line-height:2.8;color:#84aeff}.index div{border-bottom:1px solid #263247;min-width:280px}</style></head><body><main><small>ENGENHARIA DE PRODUÇÃO · UFBA</small><h1>João<br>Victor<span>.</span></h1><p>Dados, automação e IA<br>aplicados a problemas reais.</p><div class="index"><div>01 &nbsp; AATAMED / Delta</div><div>02 &nbsp; Hórus</div><div>03 &nbsp; Atena</div></div></main><footer><span>João Victor Coelho de Mello</span><span>Salvador, Bahia · Brasil</span></footer></body></html>`);
await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:path.join(root,'assets/social.png')});await browser.close();
