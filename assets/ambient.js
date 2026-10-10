// Ambient movement is opt-in through enhancement; static artwork is the default.
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),buttons=[...document.querySelectorAll('.motion-toggle')],art=[...document.querySelectorAll('[data-ambient]')];
let paused=false;try{paused=sessionStorage.getItem('portfolio-motion-paused')==='true';}catch{}
const visible=new Set();
function sync(){
 art.forEach(a=>a.classList.toggle('is-moving',visible.has(a)&&!paused&&!reduced.matches&&!document.hidden));
 buttons.forEach(button=>{button.hidden=reduced.matches;button.setAttribute('aria-pressed',String(paused));button.innerHTML=paused?'Ativar movimento <span aria-hidden="true">▷</span>':'Pausar movimento <span aria-hidden="true">Ⅱ</span>';});
}
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{for(const e of entries)e.isIntersecting?visible.add(e.target):visible.delete(e.target);sync();},{threshold:.12});art.forEach(a=>observer.observe(a));buttons.forEach(button=>button.addEventListener('click',()=>{paused=!paused;try{sessionStorage.setItem('portfolio-motion-paused',String(paused));}catch{}sync();}));reduced.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);window.addEventListener('pageshow',sync);sync();}
