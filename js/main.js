import * as THREE from '../vendor/three/three.module.js';
import { oakTexture, plasterTexture, weaveTexture } from './textures.js';

export const scene = new THREE.Scene();
scene.background = new THREE.Color('#e8e4da');
export const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.1, 100);
export let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#studio'), antialias: true });
} catch (error) {
  document.querySelector('#error').hidden = false;
  throw error;
}
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.3;

const standard = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.7, ...extra });
const oak = standard('#ffffff', { map: oakTexture });
const plaster = standard('#ffffff', { map: plasterTexture });
const fabric = standard('#c77450', { map: weaveTexture });
const green = standard('#355f50');
const dark = standard('#263b36');
const cream = standard('#eee3c9');
const brass = new THREE.MeshPhongMaterial({ color: '#d4ab60', specular: '#fff2cb', shininess: 100 });
const glass = new THREE.MeshPhysicalMaterial({ color: '#9ebcb0', roughness: 0.12, transmission: 0.8, thickness: 0.18, ior: 1.45 });

function mesh(name, geometry, material, x, y, z, parent = scene) {
  const object = new THREE.Mesh(geometry, material);
  object.name = name; object.position.set(x, y, z);
  object.castShadow = object.receiveShadow = true; parent.add(object); return object;
}
const box = (name, w, h, d, material, x, y, z, parent) => mesh(name, new THREE.BoxGeometry(w, h, d), material, x, y, z, parent);
const cylinder = (name, top, bottom, height, material, x, y, z) => mesh(name, new THREE.CylinderGeometry(top, bottom, height, 32), material, x, y, z);

// Open-front architectural cutaway, built fresh for this art studio.
box('Studio foundation', 10.3, 0.3, 8.3, dark, 0, -0.23, 0);
box('Oak floor', 10, 0.16, 8, oak, 0, -0.04, 0);
box('Plaster back wall', 10, 4.5, 0.18, plaster, 0, 2.2, -4);
box('Sage left wall', 0.18, 4.5, 8, green, -5, 2.2, 0);
box('Back skirting', 10, 0.15, 0.12, cream, 0, 0.15, -3.84);
box('Side skirting', 0.12, 0.15, 8, cream, -4.84, 0.15, 0);
// Glowing window inset and mullions; no external models.
const windowGlow = new THREE.MeshBasicMaterial({ color: '#f9edca' });
box('Window daylight', 0.06, 2.7, 3.2, windowGlow, -4.88, 2.7, -1.8);
for (const z of [-3.45, -1.8, -0.15]) box('Window vertical frame', 0.18, 2.86, 0.09, cream, -4.78, 2.7, z);
for (const y of [1.3, 2.7, 4.1]) box('Window horizontal frame', 0.18, 0.09, 3.4, cream, -4.78, y, -1.8);
box('Window sill', 0.42, 0.12, 3.6, oak, -4.7, 1.25, -1.8);

// Workbench with paint jars, notebooks and a glass vase.
box('Workbench top', 3.9, 0.18, 1.5, oak, -2.6, 1.65, -2.1);
for (const x of [-4.2, -1]) for (const z of [-2.65, -1.55]) box('Workbench leg', 0.1, 1.55, 0.1, dark, x, 0.8, z);
box('Sketchbook', 0.72, 0.08, 0.52, cream, -2.55, 1.81, -2.05).rotation.y = 0.2;
for (let i = 0; i < 4; i++) cylinder('Paint jar', 0.1, 0.1, 0.25, standard(['#b55237','#d0b557','#477877','#dfc5a1'][i]), -3.8 + i * 0.28, 1.9, -2.45);
cylinder('Glass vase', 0.17, 0.24, 0.65, glass, -1.5, 2.04, -2.3);
for (let i = 0; i < 3; i++) {
  const stem = cylinder('Flower stem', 0.013, 0.013, 0.7, green, -1.5 + i * 0.06, 2.5, -2.3);
  stem.rotation.z = (i - 1) * 0.17;
  mesh('Flower', new THREE.IcosahedronGeometry(0.12, 1), standard('#cb8049'), -1.5 + (i - 1) * 0.13, 2.88, -2.3);
}
cylinder('Stool seat', 0.43, 0.43, 0.15, oak, -2.5, 0.95, -0.55);
for (const [x,z] of [[-0.25,-0.2],[0.25,-0.2],[0,0.27]]) box('Stool leg',0.07,0.9,0.07,dark,-2.5+x,0.45,-0.55+z);

// Easel with raised geometric artwork over a woven canvas.
const easel = new THREE.Group(); easel.position.set(1, 0, -1.2); easel.rotation.y = -0.16; scene.add(easel);
for (const x of [-0.72,0.72]) box('Easel upright',0.09,3.4,0.1,oak,x,1.7,0,easel).rotation.z = x * -0.12;
box('Easel rear support',0.1,2.5,0.1,oak,0,1.25,-0.55,easel).rotation.x=-0.35;
box('Canvas frame',2.15,2.55,0.14,oak,0,2.1,0.09,easel);
box('Woven artwork canvas',1.98,2.38,0.06,new THREE.MeshStandardMaterial({map:weaveTexture,roughness:1}),0,2.1,0.2,easel);
box('Easel ledge',2.4,0.12,0.35,oak,0,0.78,0.15,easel);
const sun = mesh('Terracotta circle',new THREE.CircleGeometry(0.55,64),standard('#bc6344'),0.2,2.55,0.242,easel);
box('Abstract green block',0.85,1.1,0.025,green,-0.35,1.63,0.25,easel);
box('Abstract ochre block',0.72,0.52,0.03,standard('#c89b47'),0.42,1.34,0.26,easel);

// Reading bench and textile rug.
box('Woven rug',4.6,0.025,2.5,standard('#ddd1ad',{map:weaveTexture}),1.1,0.065,1.65);
box('Bench base',2.8,0.2,1.1,oak,2.9,0.4,2.05);
box('Terracotta upholstered seat',2.7,0.3,1.02,fabric,2.9,0.65,2.05);
box('Upholstered backrest',2.8,0.8,0.2,fabric,2.9,1.05,2.58);
for(const x of [1.8,4])for(const z of [1.7,2.4])box('Bench foot',0.12,0.35,0.12,dark,x,0.2,z);
box('Cream cushion',0.6,0.5,0.22,standard('#f4e4bd',{map:weaveTexture}),2.1,1,2.35).rotation.z=0.15;

// Brass sculpture on a pedestal, with slow rotation.
box('Sculpture plinth',0.85,1,0.85,cream,3.6,0.55,-2.75);
export const sculpture = mesh('Polished brass torus',new THREE.TorusKnotGeometry(0.36,0.1,100,16),brass,3.6,1.62,-2.75);
box('Floating display shelf',3.1,0.12,0.4,oak,1.8,3.65,-3.65);
for(let i=0;i<7;i++)box('Color study book',0.14,0.35+i%3*0.08,0.25,standard(['#bb6347','#b6a375','#4d7363'][i%3]),0.6+i*0.17,3.89,-3.62);
cylinder('Ceramic shelf bowl',0.25,0.15,0.24,standard('#bc6548'),2.75,3.83,-3.6);

function plant(x,z,scale=1) {
  cylinder('Terracotta planter',0.3*scale,0.23*scale,0.55*scale,standard('#b97657'),x,0.28*scale,z);
  cylinder('Soil',0.27*scale,0.27*scale,0.03,dark,x,0.56*scale,z);
  for(let i=0;i<9;i++){
    const angle=i*2.4;
    const leaf=mesh('Plant leaf',new THREE.SphereGeometry(1,12,8),green,x+Math.sin(angle)*0.28*scale,(0.8+i*0.065)*scale,z+Math.cos(angle)*0.25*scale);
    leaf.scale.set(0.13*scale,0.42*scale,0.07*scale);leaf.rotation.z=Math.sin(angle)*0.8;leaf.rotation.y=angle;
  }
}
plant(-4.1,2.7,1.4); plant(4.15,-0.4,1);
// Floor lamp; its bulb emits light through a real PointLight.
cylinder('Lamp base',0.35,0.35,0.08,dark,0.4,0.12,2.9);
cylinder('Brass lamp stem',0.035,0.035,2.8,brass,0.4,1.55,2.9);
cylinder('Lamp shade',0.23,0.48,0.48,cream,0.4,2.95,2.9);
mesh('Lamp bulb',new THREE.SphereGeometry(0.12,20,12),new THREE.MeshBasicMaterial({color:'#ffdf99'}),0.4,2.72,2.9);

export const lights = {
  fill: new THREE.HemisphereLight('#ecf3ff','#79694e',2.1),
  sun: new THREE.DirectionalLight('#ffebc5',3.4),
  lamp: new THREE.PointLight('#ffb965',15,8,2),
  art: new THREE.SpotLight('#fff0da',32,12,Math.PI/6,0.55,2)
};
lights.sun.position.set(-3,8,4); lights.sun.castShadow=true;
lights.sun.shadow.mapSize.set(2048,2048);Object.assign(lights.sun.shadow.camera,{left:-8,right:8,top:8,bottom:-8,near:0.5,far:30});lights.sun.shadow.normalBias=0.04;
lights.lamp.position.set(0.4,2.65,2.9);
lights.art.position.set(1,4.4,0.3);lights.art.target.position.set(1,2,-1.2);scene.add(lights.art.target);
for(const light of Object.values(lights))scene.add(light);

const target = new THREE.Vector3(0,1.2,0);
const view = { yaw:0.66, pitch:0.59, radius:23 };
function updateCamera(){
  const radius=view.radius*(innerWidth<700?1.48:1);
  camera.position.set(target.x+Math.sin(view.yaw)*Math.cos(view.pitch)*radius,target.y+Math.sin(view.pitch)*radius,target.z+Math.cos(view.yaw)*Math.cos(view.pitch)*radius);
  camera.lookAt(target);
}
updateCamera();
let drag=null;
renderer.domElement.addEventListener('pointerdown',event=>{drag={x:event.clientX,y:event.clientY};renderer.domElement.setPointerCapture(event.pointerId);});
renderer.domElement.addEventListener('pointermove',event=>{if(!drag)return;view.yaw=THREE.MathUtils.clamp(view.yaw-(event.clientX-drag.x)*0.005,-0.15,1.5);view.pitch=THREE.MathUtils.clamp(view.pitch+(event.clientY-drag.y)*0.005,0.2,1.2);drag={x:event.clientX,y:event.clientY};updateCamera();});
for(const event of ['pointerup','pointercancel','lostpointercapture'])renderer.domElement.addEventListener(event,()=>{drag=null;});
renderer.domElement.addEventListener('wheel',event=>{event.preventDefault();view.radius=THREE.MathUtils.clamp(view.radius+event.deltaY*0.01,13,28);updateCamera();},{passive:false});
document.querySelector('#reset').addEventListener('click',()=>{Object.assign(view,{yaw:0.66,pitch:0.59,radius:23});updateCamera();});
document.querySelector('#lighting').addEventListener('click',event=>{
  const evening=event.currentTarget.getAttribute('aria-pressed')!=='true';
  event.currentTarget.setAttribute('aria-pressed',String(evening));event.currentTarget.textContent=evening?'Daylight':'Evening light';
  lights.sun.intensity=evening?0.35:3.4;lights.fill.intensity=evening?0.65:2.1;lights.lamp.intensity=evening?35:15;
  scene.background.set(evening?'#293d44':'#e8e4da');
  document.body.style.color=evening?'#f0e8d5':'#273c39';
});
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);updateCamera();});
renderer.setAnimationLoop(time=>{sculpture.rotation.y=time*0.00025;renderer.render(scene,camera);});
