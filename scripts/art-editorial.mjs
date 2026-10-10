// Original vector compositions: explanatory covers, not screenshots of products.
import fs from 'node:fs/promises';
const dest=new URL('../assets/',import.meta.url);
const svg=(body)=>`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750" viewBox="0 0 1200 750"><g font-family="Arial, sans-serif">${body}</g></svg>`;
const text=(x,y,value,size=30,fill='#f2f5fa',other='')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${other}>${value}</text>`;
const delta=svg(`<defs><linearGradient id="blue" x2="1" y2="1"><stop stop-color="#306cec"/><stop offset="1" stop-color="#1547b3"/></linearGradient></defs><rect width="1200" height="750" fill="url(#blue)"/><path d="M-80 570L1010 -60M120 820L1270 80" stroke="#fff" stroke-opacity=".06" stroke-width="150"/>
${text(62,96,'Delta',64,'#fff','font-weight="600" letter-spacing="-3"')}${text(65,142,'CONTEXTO &amp; DECISÃO',20,'#d4e1ff','letter-spacing="3"')}
<g transform="translate(110 210) rotate(-4 260 125)"><path d="M30 0H520Q550 0 550 30V170Q550 200 520 200H70L20 235V200Q0 200 0 175V30Q0 0 30 0" fill="#f1f4fa"/>${text(38,70,'A conversa muda.',36,'#12233d','font-weight="600"')}${text(38,130,'“Prefiro a opção B.”',31,'#344966')}</g>
<g transform="translate(510 380) rotate(3 275 105)"><rect width="565" height="230" rx="16" fill="#0d203f" stroke="#b6ceff" stroke-opacity=".3"/><circle cx="43" cy="48" r="8" fill="#86adff"/>${text(66,56,'ESTADO DA CONVERSA',20,'#b2caff','letter-spacing="2"')}${text(34,116,'Preferência atualizada.',32,'#fff','font-weight="600"')}<path d="M35 143H530" stroke="#4a6386"/>${text(35,188,'Autorização pendente',26,'#c4d4ed')}<circle cx="516" cy="182" r="13" fill="none" stroke="#b5c8e9" stroke-width="2"/></g>
${text(64,698,'Interpretar não é autorizar.',27,'#edf3ff')}${text(1130,698,'01',24,'#c7d9ff','text-anchor="end"')}`);
const horus=svg(`<rect width="1200" height="750" fill="#151d27"/><path d="M850 0V750M1000 0V750" stroke="#ffffff08"/>
${text(62,96,'Hórus',64,'#f2f5fa','font-weight="600" letter-spacing="-3"')}${text(65,142,'METAS EM ACOMPANHAMENTO',20,'#a6b8d0','letter-spacing="3"')}
<path d="M340 371H443M763 371H852" stroke="#7297d6" stroke-width="4"/><path d="M427 356l16 15-16 15M836 356l16 15-16 15" fill="none" stroke="#7297d6" stroke-width="4"/>
<path d="M83 294H331V448H83Z" fill="#202e40" stroke="#526984" stroke-width="2"/><path d="M105 421H309" stroke="#7297d6" stroke-width="5"/>
${text(106,339,'INDICADOR',21,'#a6b8d0','letter-spacing="2"')}${text(106,389,'Entregas',40,'#f2f5fa','font-weight="600"')}
<rect x="463" y="294" width="280" height="154" rx="77" fill="#2b4770"/><circle cx="506" cy="376" r="9" fill="#b8d3ff"/>
${text(533,339,'STATUS',21,'#b8cdec','letter-spacing="2"')}${text(533,389,'Atenção',39,'#f2f5fa','font-weight="600"')}
<path d="M897 294H1108Q1133 294 1133 319V423Q1133 448 1108 448H936L895 478V448Q873 448 873 423V319Q873 294 897 294" fill="#d2e2f7"/>
${text(902,339,'AVISO',21,'#3a567d','letter-spacing="2"')}${text(902,389,'Equipe',40,'#172d4b','font-weight="600"')}
${text(64,698,'Do indicador ao acompanhamento.',27,'#dce5f3')}${text(1130,698,'02',24,'#a6b8d0','text-anchor="end"')}`);
const atena=svg(`<rect width="1200" height="750" fill="#202d43"/><circle cx="1140" cy="30" r="310" fill="#5474a7" fill-opacity=".08"/>
${text(1130,96,'Atena',64,'#f2f5fa','font-weight="600" letter-spacing="-3" text-anchor="end"')}${text(1130,142,'CAPACITAÇÃO &amp; ATENDIMENTO',20,'#b4c4db','letter-spacing="3" text-anchor="end"')}
<g transform="translate(130 218) rotate(-9 190 195)"><rect x="26" y="-9" width="340" height="356" rx="5" fill="#6f8fbf"/><rect x="12" y="0" width="340" height="356" rx="5" fill="#b4c8e4"/><rect y="14" width="340" height="356" rx="5" fill="#ecf0f6"/><rect x="25" y="43" width="7" height="290" fill="#4b77b9"/>
${text(62,100,'TRILHAS',22,'#526987','letter-spacing="3"')}${text(61,175,'Conhecimento',29,'#1d3452','font-weight="600"')}${text(61,216,'para aprender.',29,'#1d3452','font-weight="600"')}<path d="M62 266H276M62 291H234" stroke="#a7b8cf" stroke-width="5"/></g>
<path d="M494 346C595 346 523 297 632 297" stroke="#92b5ec" stroke-width="3" fill="none"/><path d="M619 283l15 14-15 14" stroke="#92b5ec" stroke-width="3" fill="none"/>
<path d="M670 219H1053Q1078 219 1078 244V362Q1078 387 1053 387H744L704 413V387H670Q645 387 645 362V244Q645 219 670 219" fill="#416fba"/>
${text(678,273,'WHATSAPP',20,'#d4e3fb','letter-spacing="2"')}${text(678,328,'Como funciona?',34,'#fff','font-weight="600"')}
<path d="M863 412V464" stroke="#92b5ec" stroke-width="3"/><path d="M849 451l14 15 14-15" stroke="#92b5ec" stroke-width="3" fill="none"/>
<circle cx="696" cy="533" r="43" fill="#d7e3f4"/><circle cx="696" cy="524" r="10" fill="#29466f"/><path d="M678 555q0-20 18-20t18 20" fill="#29466f"/>
${text(759,526,'Próximo passo:',25,'#aebfd7')}${text(759,563,'a equipe assume.',29,'#edf3fc','font-weight="600"')}
${text(64,698,'Conteúdo, conversa e apoio humano.',27,'#dce5f3')}${text(1130,698,'03',24,'#a6b8d0','text-anchor="end"')}`);
for(const [name,content] of [['delta-editorial.svg',delta],['horus-editorial.svg',horus],['atena-editorial.svg',atena]])await fs.writeFile(new URL(name,dest),content);
