const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const E=require('./dist/engine.js'),P=require('./dist/progression.js');
const B=require('./dist/backup.js');
let lockOwner=null;const waiters=[];
function locks(){return {request:(name,callback)=>{const run=()=>{lockOwner=run;const held=callback();held.then(()=>{lockOwner=null;waiters.shift()?.();});};if(lockOwner)waiters.push(run);else run();return Promise.resolve();}};}
const script=fs.readFileSync('./dist/app.js','utf8');const memory={};let sequence=0;
function mount(){
  const nodes=new Map(),listeners={};
  function element(){return {children:[],dataset:{},style:{},attributes:{},classList:{add(){},remove(){},toggle(){}},setAttribute(k,v){this.attributes[k]=v;},replaceChildren(){this.children=[];},append(b){this.children.push(b);},focus(){},addEventListener(){},showModal(){this.open=true;},close(){this.open=false;}};}
  function byId(id){if(!nodes.has(id))nodes.set(id,element());return nodes.get(id);}
  const document={hidden:false,getElementById:byId,createElement:element,querySelector:s=>byId(s),querySelectorAll:()=>[],addEventListener:(n,f)=>listeners[n]=f};
  const window={TenGame:E,TenProgress:P,TenBackup:B,navigator:{locks:locks()},crypto:{randomUUID:()=>`id-${++sequence}`},addEventListener:(n,f)=>listeners[n]=f};
  const context={window,document,localStorage:{getItem:k=>memory[k],setItem:(k,v)=>memory[k]=v},Phaser:{Scene:class{}},URL,URLSearchParams,Date,Math,console,matchMedia:()=>({matches:true}),setTimeout:()=>0,clearTimeout(){},location:{search:'',href:'https://game.example/'}};
  vm.runInNewContext(script,context);return {byId,listeners,document,context,click:id=>byId(id).onclick(),card:slot=>byId('card-controls').children.find(b=>+b.dataset.slot===slot).onclick()};
}
const data=()=>JSON.parse(memory['diez-y-listo-v1']);const count=event=>data().events.filter(e=>e.event===event).length;
(async()=>{
let ui=mount();assert.equal(count('game_start'),1);const run=data().events.find(e=>e.event==='game_start').runId;
ui.click('mobile-menu');assert(ui.byId('modal-content').innerHTML.includes('Elegir nivel'));ui.click('menu-close');
ui.click('journey-mode');assert.equal(count('game_start'),1,'Repeated mode click is not a new game');
const stablePosition=ui.byId('card-controls').children.find(b=>+b.dataset.slot===5).style.cssText;
ui.card(1);assert.equal(ui.byId('instruction').textContent,'Carta 7 seleccionada.');ui.card(2);assert.equal(E.remaining(data().saved['v2:level:1'].stacks),4);assert.equal(ui.byId('card-controls').children.find(b=>+b.dataset.slot===5).style.cssText,stablePosition,'Cards stay in place after removal');
const blocked=mount();assert.equal(count('game_start'),1);assert.equal(blocked.byId('main').inert,true);
ui.listeners.pagehide();await Promise.resolve();ui=blocked;assert.equal(ui.byId('main').inert,false);assert.equal(count('game_start'),1);assert.equal(data().events.findLast(e=>e.event==='game_resume').runId,run);
ui.card(5);ui.card(6);ui.card(9);ui.card(10);assert.equal(count('game_complete'),1);assert.equal(P.starsFor(data().completed[1]),3);
const best=data().completed[1];assert(!data().saved['v2:level:1']);
ui.click('replay-level');ui.click('hint-button');for(const slot of [1,2,5,6,9,10])ui.card(slot);
assert.deepEqual(data().completed[1],best,'Worse replay preserves original best');
assert.equal(count('game_start'),2);assert.equal(count('game_complete'),2);
ui.click('next-level');assert.equal(count('next_level'),1);assert(data().saved['v2:level:2']);
ui.click('restart-button');ui.click('confirm-restart');assert.equal(data().events.findLast(e=>e.event==='game_end').reason,'restart');
assert.equal(count('game_start'),4);
ui.document.hidden=true;ui.listeners.visibilitychange();const before=count('game_pause');ui.listeners.visibilitychange();assert.equal(count('game_pause'),before,'Hidden + pagehide only pause once');
ui.document.hidden=false;ui.listeners.visibilitychange();assert.equal(data().events.at(-1).event,'game_resume');
ui.click('daily-mode');const dailyKey=Object.keys(data().saved).find(k=>k.includes('daily:'));let board=data().saved[dailyKey].stacks;
for(const pair of E.solve(board).path)for(const slot of pair)ui.card(slot);
const date=dailyKey.slice('v2:daily:'.length);assert(data().daily[date]);ui.click('share-result');
assert(ui.byId('modal-content').innerHTML.includes('?daily='+date));assert.equal(data().events.at(-1).event,'share_opened');
assert(data().events.every(e=>e.version==='2.5.0'&&e.sessionId));
ui.click('stats-button');
const restored={...P.migrate(null),gameVersion:'2.1.0'};
restored.completed[12]={hints:0,undos:0,misses:0,seconds:30,date:'2026-09-30',runId:'restored'};
ui.byId('restore-file').onchange({target:{files:[{size:400,text:()=>Promise.resolve(JSON.stringify(restored))}]}});
await Promise.resolve();assert(ui.byId('modal-content').innerHTML.includes('Combinar con mi progreso'));
ui.click('restore-confirm');assert.equal(data().completed[12].runId,'restored');assert.deepEqual(data().completed[1],best);
const beforeInvalid=JSON.stringify(data().completed);
ui.byId('restore-file').onchange({target:{files:[{size:5,text:()=>Promise.resolve('oops')}]}});
await Promise.resolve();await Promise.resolve();assert.equal(JSON.stringify(data().completed),beforeInvalid);

console.log('PASS: resume/run IDs, mode idempotence, victory, replay best, restart, pause deduplication, daily result link.');

ui.listeners.pagehide();await Promise.resolve();
})().catch(e=>{console.error(e);process.exitCode=1;});
