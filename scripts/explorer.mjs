const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function renderExplorer(cases){
 const name=c=>c.slug==='aatamed'?'Delta':c.name;
 const choices=cases.map((c,i)=>`<article class="project-choice${i===0?' is-selected':''}" id="${c.slug}" data-project="${c.slug}"><span class="choice-number" aria-hidden="true">${c.number}</span><div class="choice-copy"><h3><input class="project-radio" type="radio" name="project-preview" id="select-${c.slug}" data-select="${c.slug}" aria-controls="preview-${c.slug}"${i===0?' checked':''}><label class="project-card" for="select-${c.slug}">${escape(name(c))}<span class="selection-mark" aria-hidden="true">↘</span></label></h3><p>${escape(c.indexDescription)}</p></div></article>`).join('');
 const panels=cases.map((c,i)=>`<section class="project-preview" id="preview-${c.slug}" data-panel="${c.slug}" aria-labelledby="preview-title-${c.slug}"><div class="preview-heading" aria-hidden="true"><span>${escape(name(c))}</span><span>${c.number} / 03</span></div><figure class="choice-cover" data-preview="${c.slug}"><img src="${escape(c.cover)}" alt="${escape(c.alt)}" width="1200" height="750" loading="lazy"></figure><div class="preview-copy"><h3 id="preview-title-${c.slug}">${escape(c.title)}</h3><p>${escape(c.homeSummary||c.summary)}</p><a class="preview-case-link text-link" href="casos/${c.slug}/" data-case-shortcut="${c.slug}">Abrir o caso <span class="visually-hidden">${escape(name(c))}</span><span aria-hidden="true">↗</span></a></div></section>`).join('');
 return `<section class="projects-explorable wrap" id="projetos" aria-labelledby="projects-title">
 <div class="explorer-heading"><div><p class="eyebrow">Dados · Automação · IA</p><h2 id="projects-title">Projetos selecionados<span>.</span></h2></div><p class="collection-count">01 — 03 <span>Do problema à entrega</span></p></div>
 <details class="project-explorer" data-explorer>
 <summary class="explorer-trigger" aria-controls="project-selection">
 <span class="explorer-teaser" aria-hidden="true">${cases.map((c,i)=>`<span class="stack-plane plane-${i}" data-preview="${c.slug}"><img src="${escape(c.cover)}" alt="" width="1200" height="750" loading="lazy"></span>`).join('')}</span>
 <span class="explore-invitation"><span class="invitation-note">Três perspectivas.<br>Uma forma de construir.</span><span class="explore-control"><span class="closed-label">Abrir coleção</span><span class="open-label">Recolher coleção</span><span class="explore-icon" aria-hidden="true">↗</span></span></span>
 </summary>
 <div class="project-selection" id="project-selection">
 <div class="project-index"><div role="radiogroup" aria-label="Prévia do projeto" aria-describedby="selection-help">${choices}</div><p class="index-note" id="selection-help">Selecione um título para explorar. <br>“Abrir o caso” leva aos detalhes.</p></div>
 <div class="preview-stage">${panels}</div>
 <p class="visually-hidden" role="status" data-preview-status></p>
 </div></details></section>`;
}
