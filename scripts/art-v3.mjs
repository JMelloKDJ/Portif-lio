// Original explanatory visuals. Every value and conversation below is synthetic.
import fs from 'node:fs/promises';
const dest=new URL('../assets/',import.meta.url);
const t=(x,y,s,size=26,color='#9baac1',extra='')=>`<text x="${x}" y="${y}" fill="${color}" font-size="${size}" ${extra}>${s}</text>`;
const rect=(x,y,w,h,fill='#172235',r=18,stroke='#30425d')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}"/>`;
const shell=(brand,tagline,body)=>`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000"><defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#172438"/><stop offset="1" stop-color="#0c121d"/></linearGradient><linearGradient id="blue" x2="1" y2="1"><stop stop-color="#3779ee"/><stop offset="1" stop-color="#2754b3"/></linearGradient><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#5d9cff" stop-opacity=".32"/><stop offset="1" stop-color="#5d9cff" stop-opacity="0"/></linearGradient></defs><rect width="1600" height="1000" rx="20" fill="url(#bg)"/><g font-family="Arial, sans-serif">${t(80,114,brand,60,'#f2f5fb','font-weight="600" letter-spacing="-2"')}${t(82,164,tagline,26,'#acbbd2')}<circle cx="1450" cy="92" r="7" fill="#7ea9fd"/><circle cx="1480" cy="92" r="7" fill="#38506f"/><circle cx="1510" cy="92" r="7" fill="#38506f"/><path d="M80 208H1520" stroke="#344055"/>${body}<path d="M80 893H1520" stroke="#344055"/>${t(1518,948,'JOÃO VICTOR  /  PROJETOS',19,'#9aacc7','text-anchor="end" letter-spacing="2"')}</g></svg>`;
const delta=shell('Delta.','Uma conversa muda. O contexto acompanha.',`
 ${t(80,278,'CONVERSA SINTÉTICA',22,'#98acc9','letter-spacing="2"')}
 ${rect(80,314,625,115,'#1b2a40')}${t(114,384,'Prefiro a opção A.',37,'#f1f5fb')}
 ${rect(154,458,625,128,'url(#blue)',18,'#4e86e7')}${t(189,512,'Pode mudar',36,'#fff')}${t(189,556,'para a opção B?',36,'#fff')}
 <path d="M389 615v51h176" fill="none" stroke="#527bb9" stroke-width="2"/><circle cx="391" cy="615" r="4" fill="#8eb7ff"/>
 ${t(80,754,'Interpretar não é autorizar.',37,'#dce7f8')}${t(80,803,'Exemplo criado para explicar o fluxo.',24,'#9aaecb')}
 ${rect(892,277,628,560,'#101b2a',22,'#3c5377')}${t(932,337,'ESTADO PROPOSTO',23,'#9ebae7','letter-spacing="2"')}
 <path d="M930 367h550" stroke="#30425c"/>
 ${t(932,427,'Preferência',27,'#98aac5')}${t(932,485,'Opção B',44,'#f1f5ff')}
 ${t(932,562,'Autorização',27,'#98aac5')}${rect(930,584,270,62,'#2b2c2d',12,'#6a5b36')}${t(952,626,'Pendente',28,'#e7cb8a')}
 <path d="M933 695h548" stroke="#30425c"/>
 <circle cx="947" cy="756" r="16" fill="#254981"/><path d="m940 756 5 5 10-11" fill="none" stroke="#a1c3ff" stroke-width="3"/>
 ${t(983,754,'Validar antes',30,'#d5e4fc')}${t(983,795,'de executar.',30,'#d5e4fc')}
`);
const horus=shell('Hórus.','Uma leitura comum. Um próximo passo claro.',`
 ${rect(80,264,928,406,'#101b2a',18,'#30445f')}${t(118,316,'ACOMPANHAMENTO',22,'#98acc9','letter-spacing="2"')}
 <g stroke="#27384f" stroke-width="1"><path d="M120 371H969M120 449H969M120 527H969M120 605H969"/></g>
 <path d="M120 588C220 568 237 471 322 493S420 530 484 444 622 504 694 389 845 424 968 349V624H120Z" fill="url(#area)"/>
 <path d="M120 588C220 568 237 471 322 493S420 530 484 444 622 504 694 389 845 424 968 349" fill="none" stroke="#76a8ff" stroke-width="6"/>
 <circle cx="968" cy="349" r="10" fill="#abcaff"/>
 ${t(1091,301,'LEITURA DE STATUS',22,'#a8bbd8','letter-spacing="1"')}
 ${[[379,'No alvo','#8bc8b1'],[485,'Atenção','#e3c17e'],[591,'Fora do alvo','#dca0a1']].map(([y,s,c])=>`<circle cx="1112" cy="${y-9}" r="9" fill="${c}"/>${t(1142,y,s,33,'#e5ecf8')}<path d="M1090 ${y+34}h426" stroke="#30425c"/>`).join('')}
 ${[[80,'01','Dados'],[450,'02','Status'],[820,'03','Alertas'],[1190,'04','Rotina']].map(([x,n,s],i)=>`${rect(x,728,330,109,i===2?'#234d96':'#18273c',15,i===2?'#4d7fcc':'#344e70')}${t(x+24,774,n,19,'#9bb9eb')}${t(x+24,814,s,32,'#f0f5fc')}${i<3?`<path d="M${x+345} 782h15m-7-6 7 6-7 6" fill="none" stroke="#80a6e4" stroke-width="2"/>`:''}`).join('')}
 ${t(80,873,'DADOS FICTÍCIOS · NÃO REPRODUZ O PAINEL OPERACIONAL',18,'#94a8c8','letter-spacing="1"')}
`);
const atena=shell('Atena.','Conhecimento que chega a quem precisa.',`
 ${rect(80,270,1440,118,'#101b2a',17,'#3a5274')}<circle cx="134" cy="326" r="17" fill="none" stroke="#8fabd5" stroke-width="3"/><path d="m147 340 13 13" stroke="#8fabd5" stroke-width="3"/>
 ${t(191,341,'Como encontro um conteúdo da equipe?',36,'#dbe6f7')}
 ${t(80,443,'PERGUNTA ILUSTRATIVA',20,'#8da6cc','letter-spacing="2"')}
 ${rect(80,505,422,282,'#1c2b42',18,'#3e5578')}${t(116,560,'01 / BASE',22,'#9eb8df','letter-spacing="1"')}
 ${t(116,620,'Documentos',38,'#eaf1ff')}${t(116,670,'organizados.',38,'#eaf1ff')}<path d="M118 724h220m-220 19h163" stroke="#667fa5" stroke-width="4"/>
 ${rect(589,505,422,282,'url(#blue)',18,'#5286e3')}${t(625,560,'02 / RECUPERAÇÃO',22,'#d0e1ff','letter-spacing="1"')}
 ${t(625,620,'Contexto',38,'#fff')}${t(625,670,'relevante.',38,'#fff')}${t(625,742,'RAG',22,'#d7e5ff','letter-spacing="4"')}
 ${rect(1098,505,422,282,'#1c2b42',18,'#3e5578')}${t(1134,560,'03 / INTERAÇÃO',22,'#9eb8df','letter-spacing="1"')}
 ${t(1134,620,'Conversa',38,'#eaf1ff')}${t(1134,670,'+ apoio humano.',32,'#eaf1ff')}${t(1134,742,'CONTEÚDO + APROVAÇÃO',18,'#a1bce7')}
 <path d="M519 646h49m-12-9 12 9-12 9M1028 646h49m-12-9 12 9-12 9" fill="none" stroke="#7da7e5" stroke-width="3"/>
 ${t(80,852,'BASE → CONTEXTO → USO NO DIA A DIA',22,'#a8bddc','letter-spacing="2"')}
`);
for(const [file,svg] of [['delta.svg',delta],['horus-v2.svg',horus],['atena-v2.svg',atena]])await fs.writeFile(new URL(file,dest),svg);
