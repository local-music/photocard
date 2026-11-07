import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
const canvas=document.getElementById('scene');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;
const scene=new THREE.Scene();scene.background=new THREE.Color('#f5f6f8');
const camera=new THREE.PerspectiveCamera(38,1,.1,2000);camera.position.set(145,-175,155);
const controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.dampingFactor=.07;controls.minDistance=70;controls.maxDistance=700;
scene.add(new THREE.HemisphereLight(0xffffff,0x9ca9c1,2.6));const light=new THREE.DirectionalLight(0xffffff,2.7);light.position.set(-80,-110,240);light.castShadow=true;light.shadow.mapSize.set(2048,2048);light.shadow.camera.left=-300;light.shadow.camera.right=300;light.shadow.camera.top=300;light.shadow.camera.bottom=-300;scene.add(light);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(1500,1500),new THREE.ShadowMaterial({opacity:.13}));ground.receiveShadow=true;ground.position.z=-6;scene.add(ground);
let root=new THREE.Group();scene.add(root);let coverPivot=null,modelPieces=[],lastSignature='',targetOpen=0,actualOpen=0,rotating=false,exploded=false;
const material=(hex)=>new THREE.MeshStandardMaterial({color:hex,roughness:.7,metalness:0});
function addBox(parent,name,x,y,z,w,h,t,color,exportable=true){let mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,t),material(color));mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;mesh.name=name;parent.add(mesh);if(exportable)modelPieces.push({name,mesh,color});return mesh}
function build(){const s=window.bookAPI.state,d=window.bookAPI.dims;scene.remove(root);root=new THREE.Group();scene.add(root);modelPieces=[];let W=d.w,H=d.h,th=2.2,pg=2.7,wall=2.6,clear=.5;const cw=W-5,ch=H-5;const total=th*2+s.pages*pg;
// Back plate and flexible-looking spine representation; all exported as separate solid pieces.
addBox(root,'Back cover',0,0,th/2,W,H,th,s.cover);
for(let i=0;i<s.pages;i++){let group=new THREE.Group();root.add(group);let z=th+i*pg+pg/2;let edgeW=(cw-2*wall)/2,edgeH=(ch-2*wall)/2;
// Four frame rails make a real, open photo cavity, accessible from the short edge.
addBox(group,`Page ${i+1} left rail`,-cw/2+wall/2,0,z,wall,ch,pg,s.page);
addBox(group,`Page ${i+1} right rail`,cw/2-wall/2,0,z,wall,ch,pg,s.page);
addBox(group,`Page ${i+1} bottom rail`,0,-ch/2+wall/2,z,cw-2*wall,wall,pg,s.page);
// Backing sheet at the bottom of the pocket. A thin top lip is visual only; open upper end for photos.
addBox(group,`Page ${i+1} backing`,0,0,z-pg*.37,cw-2*wall,ch-2*wall,.55,s.page);
}
// Front cover is pivoted around the left or upper edge, so opening changes the actual 3D geometry.
coverPivot=new THREE.Group();let horizontal=s.direction==='horizontal';coverPivot.position.set(horizontal?0:-W/2,horizontal?H/2:0,total);root.add(coverPivot);
addBox(coverPivot,'Front cover',horizontal?0:W/2,horizontal?-H/2:0,th/2,W,H,th,s.cover);
if(s.coverType!=='blank'){addBox(coverPivot,'Photo cover pocket',horizontal?0:W/2,horizontal?-H/2:0,th+.22,W*.66,H*.7,.45,'#ffffff',false)}
addBox(root,'Spine',horizontal?0:-W/2+1.1,horizontal?H/2-1.1:0,total/2,horizontal?W:2.2,horizontal?2.2: H,total,s.cover);
root.position.z=0;targetOpen=window.bookAPI.step===3||window.bookAPI.step===5?1:targetOpen;
const radius=Math.max(W,H,total);controls.target.set(0,0,total/2);camera.position.set(radius*1.65,-radius*1.85,radius*1.5);controls.update();}
function resize(){const r=canvas.getBoundingClientRect();let w=Math.max(1,r.width),h=Math.max(1,r.height);if(canvas.width!==Math.round(w*renderer.getPixelRatio())||canvas.height!==Math.round(h*renderer.getPixelRatio())){renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}}
function loop(){resize();let s=window.bookAPI.state;let sig=JSON.stringify(s)+':'+window.bookAPI.step;if(sig!==lastSignature){lastSignature=sig;build()}actualOpen+=(targetOpen-actualOpen)*.085;if(coverPivot){if(s.direction==='horizontal')coverPivot.rotation.x=-actualOpen*Math.PI*.92;else coverPivot.rotation.y=-actualOpen*Math.PI*.92;}if(rotating)root.rotation.z+=.004;controls.update();renderer.render(scene,camera);requestAnimationFrame(loop)}
// Existing toolbar buttons now control the WebGL geometry.
document.getElementById('toggleBook').onclick=()=>{targetOpen=1-targetOpen;document.getElementById('toggleBook').textContent=targetOpen?'Close book':'Open book'};
document.getElementById('spin').onclick=()=>{rotating=!rotating;document.getElementById('spin').textContent=rotating?'Stop rotation':'Auto rotate'};
document.getElementById('view').onclick=()=>{root.rotation.set(0,0,0);camera.position.set(145,-175,155);controls.target.set(0,0,20);controls.update()};
document.getElementById('explode').onclick=()=>{exploded=!exploded;document.getElementById('explode').textContent=exploded?'Assemble':'Explode parts';root.children.forEach((c,i)=>{if(c!==coverPivot)c.position.x=exploded?(i%2?1:-1)*Math.floor(i/2)*2:0})};
function meshXml(mesh){mesh.updateWorldMatrix(true,false);let g=mesh.geometry.clone();g.applyMatrix4(mesh.matrixWorld);const pos=g.getAttribute('position');const index=g.getIndex();let vertices=[],triangles=[];if(index){for(let i=0;i<pos.count;i++)vertices.push(`<vertex x="${pos.getX(i).toFixed(5)}" y="${pos.getY(i).toFixed(5)}" z="${pos.getZ(i).toFixed(5)}"/>`);for(let i=0;i<index.count;i+=3)triangles.push(`<triangle v1="${index.getX(i)}" v2="${index.getX(i+1)}" v3="${index.getX(i+2)}"/>`)}else{for(let i=0;i<pos.count;i++)vertices.push(`<vertex x="${pos.getX(i).toFixed(5)}" y="${pos.getY(i).toFixed(5)}" z="${pos.getZ(i).toFixed(5)}"/>`);for(let i=0;i<pos.count;i+=3)triangles.push(`<triangle v1="${i}" v2="${i+1}" v3="${i+2}"/>`)}g.dispose();return `<mesh><vertices>${vertices.join('')}</vertices><triangles>${triangles.join('')}</triangles></mesh>`}
window.exportReal3mf=()=>window.export3mfFallback();
loop();
