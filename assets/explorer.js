// Native radio inputs also select the preview with JavaScript unavailable.
const explorer=document.querySelector('[data-explorer]');
if(explorer){
 const summary=explorer.querySelector('summary'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const choices=[...explorer.querySelectorAll('[data-project]')],panels=[...explorer.querySelectorAll('[data-panel]')];
 const inputs=[...explorer.querySelectorAll('[data-select]')],key=`portfolio-explorer:${location.pathname}`;
 let selected=choices[0]?.id,lastProject=null,animation;
 const stop=()=>{animation?.cancel();animation=null;};
 const save=()=>{try{sessionStorage.setItem(key,JSON.stringify({open:explorer.open,selected,lastProject}));}catch{}};
 function select(id,animate=false,announce=false){
  if(!choices.some(c=>c.id===id))return;
  stop();selected=id;
  choices.forEach(c=>c.classList.toggle('is-selected',c.id===id));
  inputs.forEach(b=>b.checked=b.dataset.select===id);
  panels.forEach(p=>p.hidden=p.dataset.panel!==id);
  const panel=panels.find(p=>!p.hidden);
  if(announce)explorer.querySelector('[data-preview-status]').textContent=`Prévia: ${choices.find(c=>c.id===id).querySelector('.project-card').textContent.replace('↘','').trim()}`;
  if(animate&&!reduced.matches&&!document.hidden&&Element.prototype.animate){
   animation=panel.animate([{transform:'translateY(12px)',opacity:.35},{transform:'translateY(0)',opacity:1}],{duration:400,easing:'cubic-bezier(.2,.75,.25,1)'});
  }
  save();
 }
 function toggle(open,animate=true){stop();explorer.open=open;save();if(open)select(selected,animate);}
 summary.addEventListener('click',e=>{e.preventDefault();toggle(!explorer.open);});
 explorer.addEventListener('toggle',save);
 inputs.forEach(b=>b.addEventListener('change',()=>{if(b.checked)select(b.dataset.select,true,true);}));
 explorer.classList.add('is-enhanced');
 explorer.addEventListener('keydown',e=>{if(e.key==='Escape'&&explorer.open){e.preventDefault();toggle(false,false);summary.focus({preventScroll:true});summary.scrollIntoView({block:'nearest',behavior:'instant'});}});
 explorer.querySelectorAll('[data-case-shortcut]').forEach(a=>a.addEventListener('click',()=>{lastProject=a.dataset.caseShortcut;selected=lastProject;save();}));
 function reveal(id){
  if(!choices.some(c=>c.id===id))return;
  explorer.open=true;select(id);
  requestAnimationFrame(()=>{const target=choices.find(c=>c.id===id);target.querySelector('[data-select]').focus({preventScroll:true});
   // Bring the whole list and its preview into view, not just the chosen title.
   explorer.querySelector('.project-selection').scrollIntoView({block:'start',behavior:'instant'});});
 }
 const hash=()=>reveal(location.hash.slice(1));
 function restore(event){
  const returning=event?.persisted||performance.getEntriesByType('navigation')[0]?.type==='back_forward';
  if(returning&&lastProject){history.replaceState(history.state,'',`#${lastProject}`);reveal(lastProject);}else hash();
 }
 try{const value=JSON.parse(sessionStorage.getItem(key)||'null');if(value){explorer.open=!!value.open;lastProject=value.lastProject;select(value.selected||value.lastProject||selected);}}catch{}
 window.addEventListener('hashchange',hash);window.addEventListener('pageshow',e=>{stop();restore(e);});
 window.addEventListener('pagehide',stop);window.addEventListener('resize',stop);reduced.addEventListener('change',stop);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});select(selected);restore();
}
