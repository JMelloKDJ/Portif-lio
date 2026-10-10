// All identity, project content and navigation remain semantic HTML.
export function renderHome({header,contact,portrait,chapter,selected,p,arrow}) {
 return `${header()}
<main id="conteudo" tabindex="-1">
 <section class="hero wrap ${p.portrait?'with-portrait':'without-portrait'}" aria-labelledby="hero-title">
  <div class="hero-copy">
   <div class="hero-intro">
    <p class="hello">Engenharia de Produção · UFBA</p>
    <h1 id="hero-title">João Victor<span>.</span></h1>
    <p class="hero-role"><span class="visually-hidden">Dados, automação e IA aplicada.</span><span class="typing-line" aria-hidden="true"><span data-typewriter>Dados &amp; IA.</span><span class="typing-cursor">|</span></span></p>
   </div>
   <div class="hero-body">
    <p class="hero-value">Conecto análise e tecnologia<br>para resolver problemas reais.</p>
    <div class="hero-actions"><a class="button" href="#projetos">Ver projetos <span aria-hidden="true">↗</span></a><a class="secondary-button" href="#contato">Vamos conversar</a></div>
    <div class="hero-socials">
     <a href="${p.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn de João Victor (nova aba)">LinkedIn ${arrow}</a>
     <a href="${p.github}" target="_blank" rel="noopener noreferrer" aria-label="GitHub de João Victor (nova aba)">GitHub ${arrow}</a>
     <button class="typing-toggle" type="button" aria-label="Pausar animação do texto" aria-pressed="false" hidden><span aria-hidden="true">Ⅱ</span><span class="typing-label">Pausar escrita</span></button>
    </div>
   </div>
  </div>
  <figure class="portrait ${p.portrait?'has-portrait':'is-pending'}" aria-label="${p.portrait?'Retrato pessoal':'Fotografia pessoal ainda não fornecida'}">${portrait}</figure>
  <div class="hero-bottom"><p>Salvador, Bahia <span>Brasil</span></p><a href="#projetos">Trabalhos selecionados <span aria-hidden="true">↓</span></a></div>
 </section>
 <section class="projects" id="projetos" aria-labelledby="projects-title">
  <div class="projects-heading wrap"><div><p class="eyebrow">Dados · Automação · IA aplicada</p><h2 id="projects-title">Projetos selecionados<span>.</span></h2></div><button class="motion-toggle" type="button" hidden aria-pressed="false">Desativar movimento</button></div>
  <nav class="projects-navigation wrap" aria-label="Índice dos projetos"><a href="#aatamed"><span>01</span> Delta</a><a href="#horus"><span>02</span> Hórus</a><a href="#atena"><span>03</span> Atena</a></nav>
  <div class="showcase" data-scene="static"><div class="scene-track" aria-hidden="true"><div class="scene-shell"><div class="scene-host"></div></div></div>${selected.map(chapter).join('')}</div>
 </section>
 <section class="about wrap" id="sobre" aria-labelledby="about-title">
  <p class="eyebrow">Um pouco sobre mim</p>
  <div class="about-grid"><h2 id="about-title">Engenharia na formação.<br><span>Tecnologia na prática.</span></h2><div><p>Estudo Engenharia de Produção na UFBA e gosto de conectar o que parece separado: processos, dados e tecnologia.</p><p>Nos projetos da EJ ADM UFBA e na evolução do agente Delta, na AATAMED, meu foco foi entender o problema e construir soluções que possam ser examinadas e melhoradas.</p><a class="text-link" href="${p.linkedin}" target="_blank" rel="noopener noreferrer">Mais sobre meu percurso ${arrow}<span class="visually-hidden"> (LinkedIn, nova aba)</span></a></div></div>
  <div class="practice"><span>Onde posso contribuir</span><p>Dados &amp; BI <span aria-hidden="true">↗</span> Automação <span aria-hidden="true">↗</span> IA aplicada</p></div>
 </section>
</main>${contact()}`;
}
