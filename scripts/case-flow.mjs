import {renderContact} from './fold.mjs';
// A case reads as one flow: each block sits on one side and the light line
// (assets/flow.js) rests on the other, crossing in the gaps between them.
const tones={aatamed:['#4f8cff','#9cbcff'],horus:['#7b3cff','#b9a2ff'],atena:['#3aa0b0','#8fd5df'],matrix:['#4f8cff','#9cbcff']};
export function renderCase(c,{p,next,header,e,arrow}){
 const name=x=>x.slug==='aatamed'?'Delta':x.name;
 const [tone,text]=tones[c.slug]||tones.matrix;
 const block=(side,label,title,body,extra='')=>`<section class="flow-block wrap" data-side="${side}" aria-labelledby="${label}-title"${extra}><div class="flow-copy"><h2 class="eyebrow flow-label" id="${label}-title">${title}</h2>${body}</div></section>`;
 const decisions=`<ol class="flow-decisions">${c.solutions.map(s=>`<li><h3>${e(s.title)}</h3><p>${e(s.text)}</p></li>`).join('')}</ol>`;
 const demo=c.demo?`<details class="demo" data-demo="demonstracao/"><summary>Explorar demonstração</summary><div class="demo-content"><div class="demo-mount"></div><a class="text-link" href="demonstracao/" target="_blank" rel="noopener">Abrir em nova aba ${arrow}<span class="visually-hidden"> (nova aba)</span></a></div></details>`:'';
 const owner=c.slug==='aatamed'?'AATAMED · ':'';
 return `<div class="case-surface" data-flow data-tone="${tone}" style="--tone:${tone};--tone-text:${text}"><canvas class="flow-canvas" aria-hidden="true"></canvas>${header}<main id="conteudo" class="case-flow" tabindex="-1">
<section class="flow-hero wrap" data-side="left" aria-labelledby="case-title"><a class="back" href="../../#${c.featured?c.slug:'projetos'}">← Voltar aos projetos</a><p class="eyebrow">${owner}${e(c.category)}</p><h1 id="case-title">${e(name(c))}.<br><span>${e(c.title)}</span></h1><p class="flow-intro">${e(c.summary)}</p><dl class="flow-meta"><div><dt>Recorte</dt><dd>${e(c.stage)}</dd></div><div><dt>Contribuição</dt><dd>${e(c.homeRole||'Arquitetura + engenharia')}</dd></div></dl></section>
<figure class="flow-cover wrap" data-side="cover"><div class="flow-frame"><img src="../../${c.cover}" width="1600" height="1000" alt="${e(c.alt)}"></div><figcaption>${e(c.evidence)}</figcaption></figure>
${block('right','problema','01 — O problema',`<p class="flow-statement">${e(c.problem)}</p><p>${e(c.context)}</p><p class="flow-aside"><strong>Para quem</strong>${e(c.audience)}</p>`)}
${block('left','contribuicao','02 — Minha contribuição',`<p class="flow-lead">${e(c.role)}</p><p class="flow-note">${e(c.collaboration)}</p>`)}
${block('right','decisoes','03 — Decisões do projeto',decisions)}
${block('left','entrega','04 — O que foi entregue',`<p class="flow-lead">${e(c.result)}</p>${demo}`)}
${block('right','limites','05 — Estágio e limites',`<p class="flow-lead"><strong>${e(c.stage)}.</strong> ${e(c.period)}</p><p>${e(c.limitations)}</p><ul class="flow-tools" aria-label="Ferramentas de apoio">${c.technologies.map(t=>`<li>${e(t)}</li>`).join('')}</ul>`)}
<nav class="flow-next wrap" data-side="right" aria-label="Próximo projeto"><a href="../${next.slug}/"><span class="eyebrow">Próximo projeto</span><span class="flow-next-name">${e(name(next))} ${arrow}</span><span class="flow-next-title">${e(next.title)}</span></a></nav>
</main>${renderContact(p)}</div>`;
}
