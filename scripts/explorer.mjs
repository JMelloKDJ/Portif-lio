const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function renderExplorer(cases){
 const name=c=>c.slug==='aatamed'?'Delta':c.name;
 return `<section class="projects-explorable wrap" id="projetos" aria-labelledby="projects-title">
 <div class="explorer-heading"><div><p class="eyebrow">Dados · Automação · IA</p><h2 id="projects-title">Projetos selecionados<span>.</span></h2></div><p class="collection-count">01 — 03 <span>Do problema à entrega</span></p></div>
 <details class="project-explorer" data-explorer>
 <summary class="explorer-trigger" aria-controls="project-selection">
 <span class="explorer-teaser" aria-hidden="true">${cases.map((c,i)=>`<span class="stack-plane plane-${i}" data-preview="${c.slug}"><img src="${escape(c.cover)}" alt="" width="1200" height="750" loading="lazy"></span>`).join('')}</span>
 <span class="explore-invitation"><span class="invitation-note">Três perspectivas.<br>Uma forma de construir.</span><span class="explore-control"><span class="closed-label">Abrir coleção</span><span class="open-label">Recolher coleção</span><span class="explore-icon" aria-hidden="true">↗</span></span></span><span class="teaser-caption">Demonstração ilustrativa</span>
 </summary>
 <div class="project-selection" id="project-selection">
 <div class="project-index" aria-label="Projetos selecionados">${cases.map((c,i)=>`<article class="project-choice${i===0?' is-selected':''}" id="${c.slug}" data-project="${c.slug}"><div class="choice-copy"><span class="choice-number" aria-hidden="true">${c.number}</span><a class="project-card" href="casos/${c.slug}/"><h3>${escape(name(c))}<span aria-hidden="true">↗</span></h3><p>${escape(c.indexDescription)}</p><span class="case-action">Abrir caso <span aria-hidden="true">↗</span></span></a></div><button type="button" class="preview-button" data-select="${c.slug}" aria-pressed="${i===0}" aria-controls="preview-${c.slug}" aria-label="Ver prévia de ${escape(name(c))}" hidden><span aria-hidden="true">⊞</span><span>Prévia</span></button></article>`).join('')}<p class="index-note">Abra o caso pelo nome ou pela capa. Prévia troca o destaque.</p></div>
 <div class="preview-stage">${cases.map((c,i)=>`<section class="project-preview" id="preview-${c.slug}" data-panel="${c.slug}" aria-labelledby="preview-title-${c.slug}"${i?' hidden':''}><figure><a class="choice-cover" href="casos/${c.slug}/" data-case-shortcut="${c.slug}" aria-label="Abrir caso ${escape(name(c))}" data-preview="${c.slug}"><img src="${escape(c.cover)}" alt="${escape(c.alt)}" width="1200" height="750" loading="lazy"><span class="cover-action">Abrir caso <span aria-hidden="true">↗</span></span></a><figcaption>Demonstração ilustrativa</figcaption></figure><div class="preview-copy"><h3 id="preview-title-${c.slug}">${escape(c.title)}</h3><p>${escape(c.homeSummary||c.summary)}</p><a class="preview-case-link text-link" href="casos/${c.slug}/" data-case-shortcut="${c.slug}">Ver caso ${escape(name(c))} <span aria-hidden="true">↗</span></a></div></section>`).join('')}</div>
 <p class="visually-hidden" role="status" data-preview-status></p>
 </div></details>
 <nav class="project-shortcuts" aria-label="Acesso direto aos casos"><span>Ir direto ao caso</span>${cases.map(c=>`<a href="casos/${c.slug}/" data-case-shortcut="${c.slug}">${escape(name(c))} <span aria-hidden="true">↗</span></a>`).join('')}</nav>
 </section>`;
}
