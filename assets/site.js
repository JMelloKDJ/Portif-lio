// Enhancement only: the complete portfolio is readable without this module.
// Screen readers get one stable sentence. Only the decorative line is rewritten.
const typed=document.querySelector('[data-typewriter]');
if(typed){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const line=typed.closest('.hero-role'),button=document.querySelector('.typing-toggle');
 const words=['Dados & IA.','Automação.','Análise de dados.'];
 let word=0,letter=words[0].length,deleting=true,timer,visible=false,paused=false;
 const stop=()=>{clearTimeout(timer);timer=undefined;};
 const tick=()=>{
  if(deleting){letter--;typed.textContent=words[word].slice(0,letter);if(letter===0){deleting=false;word=(word+1)%words.length;timer=setTimeout(tick,240);}else timer=setTimeout(tick,42);}
  else{letter++;typed.textContent=words[word].slice(0,letter);if(letter===words[word].length){deleting=true;timer=setTimeout(tick,2200);}else timer=setTimeout(tick,78);}
 };
 const reconcile=()=>{
  stop();button.hidden=reduced.matches;line.classList.toggle('typing-paused',paused||reduced.matches||!visible||document.hidden);
  if(reduced.matches){word=0;letter=words[0].length;deleting=true;typed.textContent=words[0];return;}
  if(visible&&!paused&&!document.hidden)timer=setTimeout(tick,1400);
 };
 button.addEventListener('click',()=>{paused=!paused;button.setAttribute('aria-pressed',String(paused));button.setAttribute('aria-label',paused?'Retomar animação do texto':'Pausar animação do texto');button.firstElementChild.textContent=paused?'▷':'Ⅱ';button.querySelector('.typing-label')?.replaceChildren(paused?'Retomar escrita':'Pausar escrita');reconcile();});
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;reconcile();});observer.observe(line);
 reduced.addEventListener('change',reconcile);document.addEventListener('visibilitychange',reconcile);
 window.addEventListener('pagehide',stop);window.addEventListener('pageshow',reconcile);reconcile();
}

const host=document.querySelector('[data-scene]');
if(host){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const desktop=matchMedia('(min-width: 900px) and (min-height: 651px)');
 const toggle=document.querySelector('.motion-toggle');
 let dispose,loading=false,userDisabled=false,failed=false,near=false,generation=0;
 try{userDisabled=sessionStorage.getItem('portfolio-static')==='true';}catch{}
 const supported=()=>desktop.matches&&!reduced.matches&&!navigator.connection?.saveData;
 async function reconcile(){
  toggle.hidden=!supported()||failed;
  toggle.textContent=userDisabled?'Ativar movimento':'Desativar movimento';
  toggle.setAttribute('aria-pressed',String(userDisabled));
  if(!supported()||userDisabled||failed){generation++;dispose?.();dispose=null;host.dataset.scene='static';return;}
  if(!near||dispose||loading)return;
  loading=true;const token=++generation;
  try{
   const {mountScene}=await import('./scene.js');
   if(token!==generation||!supported()||userDisabled)return;
   const cleanup=await mountScene(host,{onFailure:()=>{failed=true;toggle.hidden=true;}});
   if(token!==generation||!supported()||userDisabled){cleanup();}else dispose=cleanup;
  }catch{failed=true;host.dataset.scene='static';toggle.hidden=true;}
  finally{loading=false;if(token!==generation&&supported()&&!userDisabled&&!failed)queueMicrotask(reconcile);}
 }
 const observer=new IntersectionObserver(entries=>{near=entries[0].isIntersecting;if(near)reconcile();},{rootMargin:'100px'});
 observer.observe(host);
 toggle.addEventListener('click',()=>{userDisabled=!userDisabled;try{sessionStorage.setItem('portfolio-static',String(userDisabled));}catch{}reconcile();});
 reduced.addEventListener('change',reconcile);desktop.addEventListener('change',reconcile);
 window.addEventListener('pagehide',()=>{generation++;dispose?.();dispose=null;});
 window.addEventListener('pageshow',e=>{if(e.persisted)reconcile();});
 reconcile();
}

const navigation=document.querySelector('[data-mobile-nav]');
navigation?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{navigation.open=false;}));
navigation?.addEventListener('keydown',e=>{
  if(e.key==='Escape'){navigation.open=false;navigation.querySelector('summary').focus();}
});

// HTML details is the explicit, keyboard-accessible action for the local demo.
for(const details of document.querySelectorAll('[data-demo]')){
  details.addEventListener('toggle',()=>{
    if(!details.open || details.querySelector('iframe'))return;
    const frame=document.createElement('iframe');
    frame.title='Demonstração conceitual do Hórus com dados fictícios';
    frame.src=details.dataset.demo;frame.loading='lazy';
    frame.setAttribute('sandbox','');
    details.querySelector('.demo-mount').append(frame);
  });
}
