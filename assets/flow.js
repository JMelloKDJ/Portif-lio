// The home's satin line, carried through a case page. It rests on the side
// opposite each block ([data-side]) and crosses in the gaps between blocks.
// One viewport-sized canvas drawn in page space: scrolling only moves the view.
const surface=document.querySelector('[data-flow]'),canvas=surface?.querySelector('.flow-canvas');
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),MAX=16;
let gl,u={},phase=1.2,frame=0,last=0,paused=false,lost=false,queued=0,scale=1;
let ys=new Float32Array(MAX),xs=new Float32Array(MAX),count=2,height=1;
try{paused=sessionStorage.getItem('portfolio-motion-paused')==='true';}catch{}
const fragment=`precision highp float;
uniform vec2 resolution;uniform float phase,scale,scroll,width,height;uniform vec3 tone;
uniform float ys[${MAX}],xs[${MAX}];uniform int count;
float bell(float x){return exp(-x*x);}
void main(){
 float X=gl_FragCoord.x/scale,Y=(resolution.y-gl_FragCoord.y)/scale+scroll;
 float c=xs[0],s=0.;
 for(int i=0;i<${MAX-1};i++){
  if(i>=count-1)break;
  float y0=ys[i],y1=ys[i+1],dx=xs[i+1]-xs[i],t=clamp((Y-y0)/max(y1-y0,1.),0.,1.);
  c+=dx*t*t*(3.-2.*t);s+=dx*6.*t*(1.-t)/max(y1-y0,1.);
 }
 // A slow breath along the whole line, as on the home.
 float k=Y/1700.,amp=.03*width;
 c+=amp*sin(phase+4.8*k);s+=amp*4.8/1700.*cos(phase+4.8*k);
 float U=max(width,1100.),d=(X-c)/sqrt(1.+s*s)/U;
 float w=.065+.02*sin(phase+2.5*k);
 float face=bell((d+w*.75)/(w*1.6));
 float crest=bell(d/(.0045+.002*(.5+.5*sin(phase+5.*k))));
 float diffuse=bell((d+.018)/.043);
 float shadow=bell((d-.065)/.052);
 float light=.65+.35*sin(phase-4.*k);
 float fade=smoothstep(0.,280.,Y)*(1.-smoothstep(height-260.,height,Y));
 float grooves=(.5+.5*sin(d*1800.+k*24.))*bell((d+.027)/.022);
 vec3 c3=vec3(9.,12.,17.)/255.+fade*(face*vec3(.044,.050,.060)+diffuse*tone*.076*light+crest*tone*.26*light+grooves*tone*.024-shadow*vec3(.012,.015,.02));
 float grain=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453)-.5;
 gl_FragColor=vec4(c3+grain*.004,1.);
}`;
// Control points: a block on the left sends the line right, and vice versa.
function route(){
 const W=innerWidth,mobile=W<=700,top=surface.getBoundingClientRect().top;
 // On phones the text spans the width, so the line only sways along the right edge.
 const at={left:mobile?1.02:.78,right:mobile?.9:.2,cover:mobile?1.02:.6};
 const pts=[[0,mobile?1.1:1.02]];
 for(const el of surface.querySelectorAll('[data-side]')){
  const r=el.getBoundingClientRect(),y=r.top-top,x=at[el.dataset.side]??.5;
  if(!r.height)continue;
  pts.push([y+r.height*.5,x]);
 }
 // One point per block, so the line bends broadly and never holds then turns.
 // Consecutive blocks on the same side share a single bend at their middle.
 const merged=[];
 for(let i=0;i<pts.length;){let j=i;while(j+1<pts.length&&pts[j+1][1]===pts[i][1])j++;merged.push([(pts[i][0]+pts[j][0])/2,pts[i][1]]);i=j+1;}
 // Past the last block it leaves through the bottom edge, as on the home.
 merged.push([surface.offsetHeight+500,mobile?1.1:.62]);merged.length=Math.min(merged.length,MAX);
 height=surface.offsetHeight;count=merged.length;
 ys=new Float32Array(MAX);xs=new Float32Array(MAX);merged.forEach(([y,x],i)=>{ys[i]=y;xs[i]=x*W;});
}
function layout(){
 if(!gl||lost)return;scale=innerWidth<=700?1:Math.min(devicePixelRatio,1.25);
 canvas.width=Math.round(innerWidth*scale);canvas.height=Math.round(innerHeight*scale);gl.viewport(0,0,canvas.width,canvas.height);route();draw();
}
function draw(){
 if(!gl||lost)return;
 gl.uniform2f(u.resolution,canvas.width,canvas.height);gl.uniform1f(u.phase,phase);gl.uniform1f(u.scale,scale);
 gl.uniform1f(u.scroll,-surface.getBoundingClientRect().top);gl.uniform1f(u.width,innerWidth);gl.uniform1f(u.height,height);
 gl.uniform1fv(u.ys,ys);gl.uniform1fv(u.xs,xs);gl.uniform1i(u.count,count);gl.drawArrays(gl.TRIANGLES,0,3);
}
const running=()=>!paused&&!reduced.matches&&!document.hidden&&!lost;
function tick(time){frame=0;if(!running()){last=0;return;}if(last)phase+=(Math.min(time-last,80)/9000)*Math.PI*2;last=time;draw();frame=requestAnimationFrame(tick);}
function sync(){cancelAnimationFrame(frame);frame=0;last=0;surface.dataset.running=String(running());if(running())frame=requestAnimationFrame(tick);else draw();}
function onScroll(){if(frame||queued)return;queued=requestAnimationFrame(()=>{queued=0;draw();});}
function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error('Flow shader');return s;}
try{
 gl=canvas?.getContext('webgl',{alpha:false,antialias:false,depth:false,stencil:false,powerPreference:'low-power'});
 if(gl){
  const program=gl.createProgram(),vs=shader(gl.VERTEX_SHADER,'attribute vec2 position;void main(){gl_Position=vec4(position,0.,1.);}'),fs=shader(gl.FRAGMENT_SHADER,fragment);
  gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Flow link');gl.useProgram(program);
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  const position=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
  for(const name of ['resolution','phase','scale','scroll','width','height','tone','count'])u[name]=gl.getUniformLocation(program,name);
  u.ys=gl.getUniformLocation(program,'ys[0]');u.xs=gl.getUniformLocation(program,'xs[0]');
  const hex=surface.dataset.tone||'#4f8cff',rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255),peak=Math.max(...rgb);
  gl.uniform3f(u.tone,...rgb.map(v=>v/peak));
  layout();surface.classList.add('is-rendered');surface.dataset.renderer='webgl';sync();
  addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',layout);
  new ResizeObserver(()=>{route();draw();}).observe(surface);document.fonts.ready.then(layout);
  addEventListener('portfolio:motion',e=>{paused=e.detail.paused;sync();});reduced.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);addEventListener('pageshow',sync);
  addEventListener('pagehide',()=>{cancelAnimationFrame(frame);last=0;});
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;surface.classList.remove('is-rendered');surface.dataset.renderer='context-lost';sync();});
 }
}catch{surface?.classList.remove('is-rendered');if(surface)surface.dataset.renderer='static';}
