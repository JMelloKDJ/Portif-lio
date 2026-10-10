import {renderPhone} from './contact-phone.mjs';
import {renderHomeClosing} from './fold.mjs';
export function renderClosing(p,{about=false}={}){
 if(about)return renderHomeClosing(p);
 const external=(url,label)=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${label} <span aria-hidden="true">↗</span><span class="visually-hidden"> (nova aba)</span></a>`;

 return `<footer class="closing${about?' closing-home':''}"><div class="wrap"><section class="closing-contact" id="contato" aria-labelledby="contact-title"><div class="contact-heading"><p class="eyebrow">Contato</p><h2 id="contact-title">Vamos conversar<span>↗</span></h2><p>Uma oportunidade profissional ou um projeto de dados, automação e IA.</p></div><div class="contact-actions"><a class="closing-mail" href="mailto:${p.email}"><span class="mail-label">Escreva para mim</span><span class="mail-address">${p.email}</span><span class="mail-arrow" aria-hidden="true">↗</span></a><div class="closing-links">${external(p.linkedin,'LinkedIn')}${external(p.github,'GitHub')}${renderPhone(p)}${p.resume?`<a href="/Portif-lio/${p.resume.src}">Currículo ↓</a>`:''}</div></div></section><div class="footer-line"><span><span class="footer-signature">João Victor Coelho de Mello</span><span class="footer-location">Salvador, Bahia · Brasil</span></span><div><a href="#topo">Voltar ao início ↑</a></div></div></div></footer>`;
}
