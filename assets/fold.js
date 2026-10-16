// An analytic satin fold: curvature, surface normal and grazing light evolve together.
// No external assets, Three bundle or dependency. One triangle, one visible-only RAF.
const surface=document.querySelector('.fold-surface'),host=document.querySelector('.home-surface'),projects=document.querySelector('#projetos');
const canvas=surface?.querySelector('canvas'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
let gl,program,phase=1.2,frame=0,last=0,visible=false,paused=false,lost=false;
try{paused=sessionStorage.getItem('portfolio-motion-paused')==='true';}catch{}
function layout(){if(!host||!projects)return;host.style.setProperty('--fold-top',`${projects.getBoundingClientRect().top-host.getBoundingClientRect().top}px`);if(gl&&!lost){const r=surface.getBoundingClientRect(),scale=innerWidth<=700?1:Math.min(devicePixelRatio,1.25);canvas.width=Math.round(r.width*scale);canvas.height=Math.round(r.height*scale);gl.viewport(0,0,canvas.width,canvas.height);render();}}
function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error('Fold shader');return s;}
const fragment=`precision highp float;
uniform vec2 resolution;uniform float phase;
float bell(float x){return exp(-x*x);}
void main(){
 vec2 uv=gl_FragCoord.xy/resolution;uv.y=1.-uv.y;float y=uv.y;
 float mobile=1.-step(700.,resolution.x);
 float envelope=sin(3.14159*y);
 // A broad bend pulls left at the invitation and opens out below it.
 float center=.98-.79*bell((y-.76)/.215);
 float breath=sin(phase+4.8*y)*.048*envelope;
 center+=breath;
 center=mix(center,1.25-.35*bell((y-.79)/.16)+.065*sin(phase+5.*y)*envelope,mobile);
 float slope=(1.58*(y-.76)/(.215*.215))*bell((y-.76)/.215);
 float d=(uv.x-center)/sqrt(1.+slope*slope*.18);
 float width=.065+.02*sin(phase+2.5*y);
 float face=bell((d+width*.75)/(width*1.6));
 float crest=bell(d/(.0045+.002*(.5+.5*sin(phase+5.*y))));
 float diffuse=bell((d+.018)/.043);
 float shadow=bell((d-.065)/.052);
 float light=.65+.35*sin(phase-4.*y);
 float fade=smoothstep(.08,.42,y)*(1.-smoothstep(.91,1.,y));
 float grooves=.5+.5*sin(d*1800.+y*24.);grooves=grooves*bell((d+.027)/.022);
 vec3 base=vec3(9.,12.,17.)/255.;
 vec3 c=base+fade*(face*vec3(.044,.050,.060)+diffuse*vec3(.018,.044,.076)*light+crest*vec3(.095,.17,.26)*light+grooves*vec3(.005,.012,.024)-shadow*vec3(.012,.015,.02));
 // Fine fixed grain belongs to the whole graphite surface, not the moving object.
 float grain=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453)-.5;
 c+=grain*.004;gl_FragColor=vec4(c,1.);
}`;
let uPhase,uResolution;
function render(){if(!gl||lost)return;gl.uniform2f(uResolution,canvas.width,canvas.height);gl.uniform1f(uPhase,phase);gl.drawArrays(gl.TRIANGLES,0,3);surface.dataset.phase=phase.toFixed(4);}
function tick(time){frame=0;if(!visible||paused||reduced.matches||document.hidden||lost){last=0;return;}if(last)phase+=(Math.min(time-last,80)/9000)*Math.PI*2;last=time;render();frame=requestAnimationFrame(tick);}
function sync(){cancelAnimationFrame(frame);frame=0;last=0;surface.dataset.running=String(visible&&!paused&&!reduced.matches&&!document.hidden&&!lost);if(surface.dataset.running==='true')frame=requestAnimationFrame(tick);else render();}
try{
 gl=canvas?.getContext('webgl',{alpha:false,antialias:false,depth:false,stencil:false,powerPreference:'low-power',preserveDrawingBuffer:false});
 if(gl){
  program=gl.createProgram();const vs=shader(gl.VERTEX_SHADER,'attribute vec2 position;void main(){gl_Position=vec4(position,0.,1.);}'),fs=shader(gl.FRAGMENT_SHADER,fragment);gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Fold link');gl.useProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);const location=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,2,gl.FLOAT,false,0,0);uPhase=gl.getUniformLocation(program,'phase');uResolution=gl.getUniformLocation(program,'resolution');
  layout();surface.classList.add('is-rendered');surface.dataset.renderer='webgl';
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();});observer.observe(surface);
  window.addEventListener('portfolio:motion',e=>{paused=e.detail.paused;sync();});reduced.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);window.addEventListener('pageshow',sync);
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;surface.classList.remove('is-rendered');surface.dataset.renderer='svg-context-lost';sync();});
  window.addEventListener('pagehide',()=>{cancelAnimationFrame(frame);last=0;});
 }else if(surface)surface.dataset.renderer='svg';
}catch{if(surface){surface.classList.remove('is-rendered');surface.dataset.renderer='svg-init-failed';}}
// Layout changes when the native collection disclosure opens; no scroll handler or pinning.
if(host){new ResizeObserver(layout).observe(host);window.addEventListener('resize',layout);document.fonts.ready.then(layout);layout();}
