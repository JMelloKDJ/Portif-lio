// One original scene shared by the SVG fallback and the WebGL renderer.
// Coordinates describe solid, bevelled parts; no downloaded model or texture.
export function scene() {
  const faces=[]; let object=0;
  const palette={chalk:[.79,.80,.77],dark:[.17,.20,.21],blue:[.13,.26,.87],metal:[.54,.58,.59],light:[.93,.93,.89]};
  function box(x,y,z,w,h,d,color,group=0,r=.045) {
    const c=palette[color],id=object++;
    const ring=(yy,inset)=>[[-w/2+inset,-d/2+r],[-w/2+r,-d/2+inset],[w/2-r,-d/2+inset],[w/2-inset,-d/2+r],[w/2-inset,d/2-r],[w/2-r,d/2-inset],[-w/2+r,d/2-inset],[-w/2+inset,d/2-r]].map(([a,b])=>[x+a,y+yy,z+b]);
    const bottom=ring(0,0), edge=ring(Math.max(h-r,0),0), top=ring(h,Math.min(r*.65,w/8,d/8));
    function face(points,normal,shade) {faces.push({points,normal,color:c.map(v=>Math.min(1,v*shade)),group,object:id,layer:y+h/2});}
    face(top,[0,1,0],1.10);
    for(let i=0;i<8;i++) {
      const j=(i+1)%8,dx=bottom[j][0]-bottom[i][0],dz=bottom[j][2]-bottom[i][2],l=Math.hypot(dx,dz);
      const n=[dz/l,0,-dx/l];
      face([bottom[i],bottom[j],edge[j],edge[i]],n,.77);
      face([edge[i],edge[j],top[j],top[i]],[n[0]*.7,.7,n[2]*.7],1.17);
    }
  }
  box(0,0,0,4.65,.27,3.65,'dark');
  box(0,.27,0,4.47,.07,3.47,'metal');
  for(const x of [-1.65,1.65]) for(const z of [-1.15,1.15]) box(x,.34,z,.15,.55,.15,'metal',1,.02);
  box(0,.89,0,4.05,.22,3.10,'chalk',1);
  box(0,1.11,0,3.94,.04,3.00,'light',1,.025);
  for(const x of [-1.35,1.35]) for(const z of [-.90,.90]) box(x,1.15,z,.11,.59,.11,'metal',2,.018);
  box(-.22,1.74,-.12,3.28,.30,2.53,'blue',2);
  box(-.22,2.04,-.12,3.15,.035,2.40,'blue',2,.025);
  for(const x of [-1.01,.13]) for(const z of [-.66,.41]) {
    box(x,2.075,z,.89,.13,.80,'light',3);
    box(x,2.205,z,.64,.028,.55,'chalk',3,.025);
  }
  // Circuit bus and connectors expose the relationship between the layers.
  box(1.38,.38,.93,.10,.08,1.35,'blue',1,.015);
  box(1.38,.46,1.54,.10,.43,.10,'blue',1,.015);
  box(.92,1.16,.97,1.05,.08,.09,'blue',2,.012);
  box(1.40,1.24,.97,.09,.50,.09,'blue',2,.012);
  box(2.06,.38,-.67,.36,.31,.84,'chalk',1);
  for(const z of [-.91,-.66,-.41]) box(2.06,.70,z,.21,.035,.085,'dark',1,.008);
  for(const x of [-1.70,-1.36,-1.02]) box(x,.09,1.84,.18,.085,.035,'metal',0,.01);
  for(const x of [-1.80,1.80]) for(const z of [-1.27,1.27]) box(x,1.155,z,.075,.025,.075,'dark',1,.018);
  return faces;
}

// Fixed orthographic camera; the geometry stays identical in both renderers.
export function project([x,y,z],rotation=0) {
  const a=.72+rotation,ca=Math.cos(a),sa=Math.sin(a);
  return [(x*ca-z*sa)*.287,(-x*sa*.49-z*ca*.49+y*.87-1.13)*.287,(x*sa*.87+z*ca*.87+y*.49)*.12];
}

export function staticSVG() {
  const shapes=scene().filter(f=>f.normal[0]*Math.sin(.72)*.87+f.normal[1]*.49+f.normal[2]*Math.cos(.72)*.87>0).map(f=>{
    const points=f.points.map(p=>project(p));
    return {...f,depth:points.reduce((s,p)=>s+p[2],0)/points.length,xy:points.map(([x,y])=>`${(320+x*295).toFixed(2)},${(245-y*295).toFixed(2)}`).join(' ')};
  }).sort((a,b)=>a.object===b.object?a.depth-b.depth:a.layer-b.layer||a.object-b.object);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="500" viewBox="0 0 640 500"><defs><radialGradient id="shade"><stop stop-color="#17232b" stop-opacity=".19"/><stop offset="1" stop-color="#17232b" stop-opacity="0"/></radialGradient></defs><ellipse cx="320" cy="407" rx="239" ry="66" fill="url(#shade)"/>${shapes.map(f=>`<polygon points="${f.xy}" fill="rgb(${f.color.map(v=>Math.round(v*255)).join(',')})" stroke="rgb(${f.color.map(v=>Math.round(v*255)).join(',')})" stroke-width=".45"/>`).join('')}</svg>`;
}
