// Progressive enhancement: the disclosure and case links remain native HTML.
const explorer=document.querySelector('[data-explorer]');
if(explorer){
 const summary=explorer.querySelector('summary'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const choices=[...explorer.querySelectorAll('[data-project]')],panels=[...explorer.querySelectorAll('[data-panel]')];
 const buttons=[...explorer.querySelectorAll('[data-select]')],key=`portfolio-explorer:${location.pathname}`;
 let selected=choices[0]?.id,lastProject=null,animation;
 const stop=()=>{animation?.cancel();animation=null;};
 const save=()=>{try{sessionStorage.setItem(key,JSON.stringify({open:explorer.open,selected,lastProject}));}catch{}};
 function select(id,animate=false,announce=false){
  if(!choices.some(c=>c.id===id))return;
  stop();selected=id;
  choices.forEach(c=>c.classList.toggle('is-selected',c.id===id));
  buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.select===id)));
  panels.forEach(p=>p.hidden=p.dataset.panel!==id);
  const panel=panels.find(p=>!p.hidden);
  if(announce)explorer.querySelector('[data-preview-status]').textContent=`Prévia: ${choices.find(c=>c.id===id).querySelector('h3').textContent.replace('↗','').trim()}`;
  if(animate&&!reduced.matches&&!document.hidden&&Element.prototype.animate){
   animation=panel.querySelector('.choice-cover').animate([{transform:'perspective(1000px) translateY(16px) rotateY(-8deg) scale(.975)',opacity:.45},{transform:'perspective(1000px) translateY(0) rotateY(0) scale(1)',opacity:1}],{duration:360,easing:'cubic-bezier(.2,.75,.25,1)'});
  }
  save();
 }
 function toggle(open,animate=true){stop();explorer.open=open;save();if(open)select(selected,animate);}
 summary.addEventListener('click',e=>{e.preventDefault();toggle(!explorer.open);});
 explorer.addEventListener('toggle',save);
 buttons.forEach(b=>{b.hidden=false;b.addEventListener('click',()=>select(b.dataset.select,true,true));});
 explorer.classList.add('is-enhanced');
 explorer.addEventListener('keydown',e=>{if(e.key==='Escape'&&explorer.open){e.preventDefault();toggle(false,false);summary.focus({preventScroll:true});summary.scrollIntoView({block:'nearest',behavior:'instant'});}});
 const remember=id=>{lastProject=id;selected=id;save();};
 explorer.querySelectorAll('.project-card').forEach(a=>a.addEventListener('click',()=>remember(a.closest('[data-project]').id)));
 document.querySelectorAll('[data-case-shortcut]').forEach(a=>a.addEventListener('click',()=>{explorer.open=true;remember(a.dataset.caseShortcut);}));
 function reveal(id){
  if(!choices.some(c=>c.id===id))return;
  explorer.open=true;select(id);
  requestAnimationFrame(()=>{const target=choices.find(c=>c.id===id);target.querySelector('a').focus({preventScroll:true});target.scrollIntoView({block:'nearest',behavior:'instant'});});
 }
 const hash=()=>reveal(location.hash.slice(1));
 function restore(event){
  const returning=event?.persisted||performance.getEntriesByType('navigation')[0]?.type==='back_forward';
  if(returning&&lastProject){history.replaceState(history.state,'',`#${lastProject}`);reveal(lastProject);}else hash();
 }
 try{const value=JSON.parse(sessionStorage.getItem(key)||'null');if(value){explorer.open=!!value.open;lastProject=value.lastProject;select(value.selected||value.lastProject||selected);}}catch{}
 window.addEventListener('hashchange',hash);window.addEventListener('pageshow',e=>{stop();restore(e);});
 window.addEventListener('pagehide',stop);window.addEventListener('resize',stop);reduced.addEventListener('change',stop);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});restore();
}
