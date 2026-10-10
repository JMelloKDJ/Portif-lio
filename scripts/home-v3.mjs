// Personal introduction and selected work stay in HTML; motion only enhances them.
export function renderHome({header,contact,portrait,chapter,selected,p,arrow}) {
 const github='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 19c-4.2 1.3-4.2-2-6-2m12 5v-3.8a3.3 3.3 0 0 0-.9-2.6c3-.4 6.2-1.5 6.2-6.8a5.3 5.3 0 0 0-1.5-3.7 4.9 4.9 0 0 0-.1-3.6s-1.2-.4-3.9 1.5a13 13 0 0 0-7.1 0C5 1.1 3.8 1.5 3.8 1.5a4.9 4.9 0 0 0-.1 3.6 5.3 5.3 0 0 0-1.5 3.7c0 5.3 3.2 6.4 6.2 6.8A3.3 3.3 0 0 0 7.5 18v4" transform="translate(1 0) scale(.9)"/></svg>';
 return `${header()}
<main id="conteudo" tabindex="-1">
 <section class="hero wrap ${p.portrait?'with-portrait':'without-portrait'}" aria-labelledby="hero-title">
  <div class="hero-copy">
   <p class="hello">Olá, eu sou</p>
   <h1 id="hero-title">João Victor<span>.</span></h1>
   <p class="hero-role"><span class="visually-hidden">Dados, automação e IA aplicada.</span><span class="typing-line" aria-hidden="true"><span data-typewriter>Dados &amp; IA.</span><span class="typing-cursor">|</span></span><button class="typing-toggle" type="button" aria-label="Pausar animação do texto" aria-pressed="false" hidden><span aria-hidden="true">Ⅱ</span></button></p>
   <p class="hero-value">Conecto análise e tecnologia<br>para resolver problemas reais.</p>
   <p class="hero-context">Engenharia de Produção <span aria-hidden="true">·</span> UFBA</p>
   <div class="hero-actions"><a class="button" href="#projetos">Ver projetos <span aria-hidden="true">↗</span></a><a class="secondary-button" href="#contato">Vamos conversar</a></div>
   <div class="hero-socials"><a href="${p.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn de João Victor (nova aba)"><span class="linkedin-icon" aria-hidden="true">in</span></a><a href="${p.github}" target="_blank" rel="noopener noreferrer" aria-label="GitHub de João Victor (nova aba)">${github}</a><span>Salvador, Bahia <span aria-hidden="true">—</span> Brasil</span></div>
  </div>
  <figure class="portrait ${p.portrait?'has-portrait':'is-pending'}" aria-label="${p.portrait?'Retrato pessoal':'Fotografia pessoal ainda não fornecida'}">${portrait}</figure>
  <div class="hero-bottom"><p>Dados <span aria-hidden="true">/</span> Automação <span aria-hidden="true">/</span> IA aplicada</p><a href="#projetos">Explore os projetos <span aria-hidden="true">↓</span></a></div>
 </section>
 <section class="projects" id="projetos" aria-labelledby="projects-title">
  <div class="projects-heading wrap"><div><p class="eyebrow">Três projetos. Diferentes desafios.</p><h2 id="projects-title">Ideias em prática<span>.</span></h2></div><button class="motion-toggle" type="button" hidden aria-pressed="false">Desativar movimento</button></div>
  <div class="showcase" data-scene="static"><div class="scene-track" aria-hidden="true"><div class="scene-shell"><div class="scene-host"></div></div></div>${selected.map(chapter).join('')}</div>
 </section>
 <section class="about wrap" id="sobre" aria-labelledby="about-title">
  <p class="eyebrow">Prazer, João Victor.</p>
  <div class="about-grid"><h2 id="about-title">Curioso por natureza.<br><span>Prático por escolha.</span></h2><div><p>Estudo Engenharia de Produção na UFBA e gosto de conectar o que parece separado: processos, dados e tecnologia.</p><p>Nos projetos da EJ ADM UFBA e na evolução do agente Delta, na AATAMED, meu foco foi entender o problema e construir soluções que possam ser examinadas e melhoradas.</p><a class="text-link" href="${p.linkedin}" target="_blank" rel="noopener noreferrer">Mais sobre meu percurso ${arrow}<span class="visually-hidden"> (LinkedIn, nova aba)</span></a></div></div>
  <div class="practice"><span>Onde posso contribuir</span><p>Dados &amp; BI <span aria-hidden="true">↗</span> Automação <span aria-hidden="true">↗</span> IA aplicada</p></div>
 </section>
</main>${contact()}`;
}
