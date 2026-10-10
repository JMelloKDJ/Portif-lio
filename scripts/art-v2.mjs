import fs from 'node:fs/promises';
const dest=new URL('../assets/',import.meta.url);
const text=(x,y,str,size=22,color='#a7b5c9',extra='')=>`<text x="${x}" y="${y}" fill="${color}" font-size="${size}" ${extra}>${str}</text>`;
const line=(x1,y1,x2,y2,c='#33465e')=>`<path d="M${x1} ${y1}H${x2}V${y2}" fill="none" stroke="${c}" stroke-width="2"/>`;
const dot=(x,y)=>`<circle cx="${x}" cy="${y}" r="5" fill="#75a7ff"/>`;
const shell=(label,word,body)=>`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000"><defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#152235"/><stop offset="1" stop-color="#090e17"/></linearGradient><linearGradient id="blue" x2="1" y2="1"><stop stop-color="#689aff"/><stop offset="1" stop-color="#2860d7"/></linearGradient><pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M80 0H0V80" fill="none" stroke="#8faad1" stroke-opacity=".05"/></pattern></defs><rect width="1600" height="1000" rx="18" fill="url(#bg)"/><rect width="1600" height="1000" fill="url(#grid)"/><g font-family="Arial, sans-serif">${text(80,88,label,24,'#c5d5ed','letter-spacing="4"')}${text(80,188,word,62,'#f2f5fa','letter-spacing="-2"')}${body}<path d="M80 894H1520" stroke="#394352"/>${text(80,946,'Demonstração ilustrativa',24,'#c6d2e3')}${text(1520,946,'JOÃO VICTOR  /  PROJETOS',19,'#96a8c2','text-anchor="end" letter-spacing="3"')}</g></svg>`;
const delta=shell('DELTA  /  ESTADO CONVERSACIONAL','Entender. Validar. Continuar.',`
 <path d="M1078 120V810" stroke="#7a9edd" stroke-opacity=".1" stroke-width="220"/>
 <rect x="80" y="280" width="650" height="224" rx="12" fill="#e2eafa"/>
 ${text(112,330,'01   COMPREENSÃO',22,'#294d7e','letter-spacing="2"')}${text(112,394,'Uma interpretação',40,'#152e52')}${text(112,447,'que pode ser revista.',40,'#152e52')}
 <rect x="80" y="540" width="650" height="224" rx="12" fill="#142942" stroke="#426187"/>
 ${text(112,590,'02   FATOS E AUTORIZAÇÕES',22,'#9ebee9','letter-spacing="2"')}${text(112,654,'O que foi confirmado.',40,'#eaf1fd')}${text(112,710,'Com limites explícitos.',30,'#9bb3d2')}
 ${line(730,392,850,520)}${line(730,652,850,520)}${line(850,520,970,520,'#86b0f9')}${dot(850,520)}
 <rect x="970" y="362" width="548" height="316" rx="18" fill="url(#blue)"/>
 ${text(1006,422,'03   VALIDAÇÃO',23,'#0a244e','letter-spacing="2"')}${text(1006,500,'Estado coerente.',42,'#07182f')}${text(1006,562,'Próxima interação.',36,'#07182f')}
 <path d="M1010 624H1420m-15-10 15 10-15 10" fill="none" stroke="#173c75" stroke-width="3"/>
 ${text(82,828,'INTERPRETAÇÃO ≠ AUTORIZAÇÃO',21,'#8eadd8','letter-spacing="3"')}
`);
const horus=shell('HÓRUS  /  INDICADORES + PIPELINE','Do dado à rotina.',`
 <g transform="translate(80 272)"><rect width="850" height="446" rx="14" fill="#e8edf2"/>
 ${text(34,56,'ACOMPANHAMENTO ILUSTRATIVO',22,'#37526b','letter-spacing="2"')}
 <path d="M40 130H810M40 205H810M40 280H810M40 355H810" stroke="#c4cfd9"/>
 <path d="M42 356C117 350 126 270 213 296S356 305 425 228 545 282 620 155 742 172 806 99V395H42Z" fill="#4385dd" fill-opacity=".14"/>
 <path d="M42 356C117 350 126 270 213 296S356 305 425 228 545 282 620 155 742 172 806 99" fill="none" stroke="#2b67ba" stroke-width="6"/>
 ${text(42,426,'ENTRADAS FICTÍCIAS · SEM DADOS OPERACIONAIS',18,'#476079','letter-spacing="1"')}</g>
 <g transform="translate(1015 293)">${text(0,0,'LEITURA DE STATUS',21,'#aac1de','letter-spacing="2"')}
 ${[[86,'No alvo','#88c9b1'],[204,'Atenção','#e8c676'],[322,'Fora do alvo','#e3a1a1']].map(([y,s,c])=>`<circle cx="20" cy="${y}" r="10" fill="${c}"/>${text(54,y+10,s,32,'#e5ecf5')}<path d="M0 ${y+48}H440" stroke="#2b415a"/>`).join('')}</g>
 <g transform="translate(80 790)">${text(0,0,'DADOS',23,'#c4d4e9','letter-spacing="2"')}${text(402,0,'STATUS',23,'#c4d4e9','letter-spacing="2"')}${text(832,0,'ALERTAS',23,'#c4d4e9','letter-spacing="2"')}${text(1270,0,'ROTINA',23,'#c4d4e9','letter-spacing="2"')}<path d="M118-8H355m-12-8 12 8-12 8M515-8H782m-12-8 12 8-12 8M969-8H1220m-12-8 12 8-12 8" fill="none" stroke="#6297e7" stroke-width="2"/></g>
`);
const atena=shell('ATENA  /  CONHECIMENTO + IA','Conhecimento em circulação.',`
 <g transform="translate(130 315)"><rect x="0" y="0" width="300" height="270" rx="9" fill="#253b56" stroke="#4d6687"/><rect x="-22" y="22" width="300" height="270" rx="9" fill="#364f6d" stroke="#6782a3"/><rect x="-44" y="44" width="300" height="270" rx="9" fill="#e1e9f3"/>
 ${text(-8,104,'BASE',24,'#28476d','letter-spacing="3"')}<path d="M-8 148H212M-8 180H185M-8 212H200M-8 244H154" stroke="#9caec4" stroke-width="5"/></g>
 <path d="M430 490H610" stroke="#719de0" stroke-width="2"/>
 <rect x="610" y="327" width="370" height="350" rx="16" fill="url(#blue)"/>
 ${text(656,398,'RECUPERAR',23,'#0b254c','letter-spacing="2"')}${text(656,470,'Conectar',46,'#081b37')}${text(656,526,'o contexto.',46,'#081b37')}<path d="M656 607H914" stroke="#234f90" stroke-width="2"/>
 <path d="M980 500H1064V384H1160M1064 500V655H1160" fill="none" stroke="#719de0" stroke-width="2"/>${dot(1064,500)}
 ${text(1178,390,'Conversa',38,'#eaf1fb')}${text(1178,433,'+ apoio humano',24,'#a8bbd3')}${text(1178,661,'Conteúdo',38,'#eaf1fb')}${text(1178,704,'+ aprovação',24,'#a8bbd3')}
 ${text(82,824,'INGESTÃO → RECUPERAÇÃO → INTERAÇÃO',22,'#a5bfdf','letter-spacing="2"')}
`);
await Promise.all([['delta.svg',delta],['horus-v2.svg',horus],['atena-v2.svg',atena]].map(([name,svg])=>fs.writeFile(new URL(name,dest),svg)));
