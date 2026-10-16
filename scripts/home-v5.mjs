import {contours} from './contours.mjs';
import {renderExplorer} from './explorer.mjs';
import {renderClosing} from './closing.mjs';
import {renderFold} from './fold.mjs';
// All identity, project content and navigation remain semantic HTML.
export function renderHome({header,contact,portrait,chapter,selected,p,arrow}) {
 return `${header()}
<div class="home-surface">${renderFold()}<main id="conteudo" tabindex="-1">
 <section class="hero wrap ${p.portrait?'with-portrait':'without-portrait'}" aria-labelledby="hero-title">
  ${contours('hero')}<div class="hero-copy">
   <div class="hero-intro">
    <p class="hello">Engenharia de Produção · UFBA</p>
    <h1 id="hero-title">João Victor<span>.</span></h1>
    <p class="hero-role">Dados &amp; IA.</p>
   </div>
   <div class="hero-body">
    <p class="hero-value">Conecto análise e tecnologia<br>para resolver problemas reais.</p>
    <div class="hero-actions"><a class="button" href="#projetos">Ver projetos <span aria-hidden="true">↗</span></a><a class="secondary-button" href="#contato">Vamos conversar</a></div>
    <div class="hero-socials">
     <a href="${p.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn de João Victor (nova aba)">LinkedIn ${arrow}</a>
     <a href="${p.github}" target="_blank" rel="noopener noreferrer" aria-label="GitHub de João Victor (nova aba)">GitHub ${arrow}</a>
    </div>
   </div>
  </div>
  <figure class="portrait ${p.portrait?'has-portrait':'is-pending'}" aria-label="${p.portrait?'Retrato pessoal':'Fotografia pessoal ainda não fornecida'}">${portrait}</figure>
  <div class="hero-bottom"><button class="motion-toggle" type="button" aria-pressed="false" hidden>Pausar movimento <span aria-hidden="true">Ⅱ</span></button><p>Salvador, Bahia <span>Brasil</span></p><a href="#projetos">Trabalhos selecionados <span aria-hidden="true">↓</span></a></div>
 </section>
 ${renderExplorer(selected)}
${renderClosing(p,{about:true}).replace('<footer','</main><footer')}</div>`;
}
