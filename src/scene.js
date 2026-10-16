import {Scene,PerspectiveCamera,WebGLRenderer,SRGBColorSpace,Color,Fog,AmbientLight,DirectionalLight,Group,Mesh,BoxGeometry,PlaneGeometry,MeshBasicMaterial,MeshStandardMaterial,TextureLoader,MathUtils} from 'three';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// One shared stage. Native scroll remains the sole source of progression;
// no wheel interception, scroll smoothing library or pin spacer is used.
export async function mountScene(root,{onFailure=()=>{}}={}){
 const host=root.querySelector('.scene-host');
 const chapters=[...root.querySelectorAll('.chapter')];
 const sources=chapters.map(c=>c.querySelector('.project-visual img').src);
 const scene=new Scene();scene.fog=new Fog('#090b0f',18,45);
 const camera=new PerspectiveCamera(40,1,.1,80);
 let renderer,trigger,observer,resizeObserver,raf=0,dead=false,visible=false;
 let current=0,target=0,last=0,renderCount=0,slowSamples=0,slowTime=0,lowQuality=false;
 let size={w:1,h:1,pw:6,ph:3.75,offset:2.5};
 const textures=[],groups=[];
 const keys=[{x:-.6,y:0},{x:.7,y:-.24},{x:-.25,y:.18}];
 const depth=9; // One plane separation per chapter, with 9 world units at rest.
 function release(){
  if(dead)return;dead=true;cancelAnimationFrame(raf);raf=0;
  trigger?.kill();observer?.disconnect();resizeObserver?.disconnect();
  document.removeEventListener('visibilitychange',onVisibility);
  window.removeEventListener('pagehide',release);
  renderer?.domElement.removeEventListener('webglcontextlost',contextLost);
  scene.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();}});
  textures.forEach(t=>t.dispose());renderer?.dispose();renderer?.domElement.remove();
  root.dataset.scene='static';delete root.dataset.progress;
 }
 function fail(reason){release();root.dataset.sceneReason=reason;onFailure(reason);}
 function contextLost(event){event.preventDefault();fail('context-lost');}
 function onVisibility(){if(document.hidden){cancelAnimationFrame(raf);raf=0;}else wake();}
 function wake(){if(!dead&&visible&&!document.hidden&&!raf)raf=requestAnimationFrame(draw);}
 function cameraValue(key,p){const a=Math.min(1,Math.floor(p)),t=p-a;return MathUtils.lerp(keys[a][key],keys[a+1][key],t);}
 function pose(){
  camera.position.set(cameraValue('x',current),cameraValue('y',current),depth-current*depth);
  camera.lookAt(camera.position.x,camera.position.y,camera.position.z-10);
  groups.forEach((g,i)=>{
   const d=i-current,past=Math.max(0,-d),ahead=Math.max(0,d);
   g.position.set(keys[i].x+size.offset+past*10+ahead*.55,keys[i].y+past*.85-ahead*.15,-i*depth);
   g.rotation.set(-.018+ahead*.055,.025+ahead*.2-past*.7,past*-.055);
   g.scale.set(size.pw,size.ph,1);
   g.visible=d>-.96;
  });
  root.dataset.progress=current.toFixed(4);
 }
 function draw(now){
  raf=0;if(dead||!visible||document.hidden)return;
  const dt=last?Math.min((now-last)/1000,.08):1/60;last=now;
  const moving=Math.abs(target-current)>.0001;
  current=MathUtils.damp(current,target,22,dt); // ~140ms settlement; no ambient drift.
  if(Math.abs(target-current)<.0001)current=target;
  pose();renderer.render(scene,camera);
  root.dataset.renders=String(++renderCount);
  if(moving){
   slowSamples++;slowTime+=dt;
   if(slowSamples>=45){
    const fps=slowSamples/slowTime;slowSamples=0;slowTime=0;
    if(fps<25){if(!lowQuality){lowQuality=true;renderer.setPixelRatio(1);root.dataset.quality='light';}else{fail('sustained-low-fps');return;}}
   }
  }else{slowSamples=0;slowTime=0;last=0;}
  if(current!==target)wake();
 }
 function resize(){
  if(dead)return;
  const w=host.clientWidth,h=host.clientHeight;
  if(!w||!h)return;
  const rect=chapters[0].querySelector('.project-visual').getBoundingClientRect();
  const frustumH=2*Math.tan(MathUtils.degToRad(camera.fov/2))*depth;
  const frustumW=frustumH*w/h;
  size={w,h,pw:frustumW*rect.width/w,ph:frustumW*rect.width/w/1.6,offset:frustumW*((rect.left+rect.width/2)/w-.5)};
  renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();
  ScrollTrigger.refresh();wake();
 }
 try{
  renderer=new WebGLRenderer({alpha:true,antialias:devicePixelRatio<=1.5,powerPreference:'low-power'});
  renderer.outputColorSpace=SRGBColorSpace;
  renderer.setClearColor(new Color('#090b0f'),0);
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
  renderer.domElement.setAttribute('aria-hidden','true');
  renderer.domElement.addEventListener('webglcontextlost',contextLost);
  scene.add(new AmbientLight('#b8c8e6',2));
  const light=new DirectionalLight('#dbe8ff',3);light.position.set(-3,6,10);scene.add(light);
  const loader=new TextureLoader();
  const maps=await Promise.all(sources.map(async src=>{
   const map=await loader.loadAsync(src);
   if(dead){map.dispose();throw new Error('disposed');}
   map.colorSpace=SRGBColorSpace;map.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());textures.push(map);return map;
  }));
  maps.forEach(map=>{
   const g=new Group();
   const frame=new Mesh(new BoxGeometry(1.007,1.012,.075),new MeshStandardMaterial({color:'#26374e',roughness:.65,metalness:.22}));
   const face=new Mesh(new PlaneGeometry(1,1),new MeshBasicMaterial({map}));face.position.z=.051;
   g.add(frame,face);scene.add(g);groups.push(g);
  });
  host.append(renderer.domElement);
  // Plateaus allow stable reading. Only the middle 76% between chapter centers moves.
  const chapterProgress=progress=>{
   const raw=progress*(chapters.length-1),index=Math.min(1,Math.floor(raw));
   const t=MathUtils.clamp((raw-index-.12)/.76,0,1);
   return index+t*t*(3-2*t);
  };
  trigger=ScrollTrigger.create({trigger:chapters[0],start:'center center',endTrigger:chapters.at(-1),end:'center center',invalidateOnRefresh:true,onUpdate:self=>{target=chapterProgress(self.progress);wake();}});
  target=current=chapterProgress(trigger.progress);
  resize();pose();renderer.render(scene,camera);root.dataset.scene='ready';
  observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){last=0;wake();}else{cancelAnimationFrame(raf);raf=0;}},{threshold:0});observer.observe(root);
  resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);
  document.addEventListener('visibilitychange',onVisibility);
  window.addEventListener('pagehide',release,{once:true});
  return release;
 }catch(error){fail(renderer?'asset-or-init-failure':'webgl-unavailable');return ()=>{};}
}
