(()=>{'use strict';
const E=window.TenGame,P=window.TenProgress,$=id=>document.getElementById(id),KEY='diez-y-listo-v1',VERSION='2.5.0';
const I=window.TenLocale,T=text=>I?I.text(text):text;
function localize(root=document.body){if(!I)return;I.localize(root);document.documentElement.lang=I.language;document.title=I.language==='es'?'Diez y listo · Un pequeño momento para jugar':'Diez y listo · A little moment to play';}
if(I){I.setLocale(window.CrazyGames?'en':window.navigator.language);localize();}
const platform=window.TenPlatform;let adBusy=false;
const colors=[null,[0xffebcc,'#ab7231'],[0xdaeff8,'#548cad'],[0xfbe0e7,'#b76886'],[0xe4defa,'#8864b4'],[0xd6ede2,'#58957b'],[0xffe6d4,'#b57955'],[0xebddf8,'#9566b9'],[0xdbecf9,'#638cba'],[0xf6e9c9,'#ad9149']];
const marks=['','✦','●','♥','◆','✿','✦','◆','●','✿'];
const uid=()=>window.crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`;
const sessionId=uid();let storageOK=true,store,ownsSave=false,releaseLock,saveLoaded=true;
try{store=P.migrate(JSON.parse(localStorage.getItem(KEY)||'null'));}catch{store=P.migrate(null);}
let mode='journey',state,selected=null,hinted=[],busy=false,scene=null,toastTimer,audio=null,activeSince=Date.now(),activeMs=0;
const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
const levelNow=()=>{let n=1;while(store.completed[n]&&n<P.levels.length)n++;return n;};
const recordFor=()=>mode==='daily'?store.daily[state.date]:store.completed[state.level];
const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function save(){if(!ownsSave||!saveLoaded)return;try{const target=platform?.storage?.()||localStorage;target.setItem(KEY,JSON.stringify(platform?.usesPortalData?.()?{...store,events:[]}:store));storageOK=true;}catch{storageOK=false;$('save-notice').hidden=false;$('save-notice').textContent=T('No pudimos guardar. Descargá una copia desde Tu progreso antes de cerrar.');}}
function track(event,data={}){store.events.push({event,at:new Date().toISOString(),version:VERSION,sessionId,runId:state?.runId,board:state?.key,mode,level:state?.level,...data});store.events=store.events.slice(-1000);save();}
function toast(message){$('toast').textContent=T(message);$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),3200);}
function elapsed(){return activeMs+(suspended||document.hidden?0:Date.now()-activeSince);}
function persist(){if(state&&E.remaining(state.stacks)>0){state.elapsed=elapsed();store.saved[state.key]={...state,stacks:E.clone(state.stacks)};}save();}
function pause(reason){if(state&&!busy){track('game_pause',{reason,remaining:E.remaining(state.stacks)});persist();}}
function beep(kind='pair'){if(!store.sound||adBusy)return;try{audio ||=new(window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();const tones=kind==='win'?[523,659,784,1046]:kind==='select'?[420]:[523,659];tones.forEach((f,i)=>{const o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime+i*.09;o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(.035,t);g.gain.exponentialRampToValueAtTime(.0001,t+.22);o.connect(g);g.connect(audio.destination);o.start(t);o.stop(t+.25);});}catch{}}
const mobileBoard=matchMedia('(max-width:700px)');
let firstBoardRow=0,lastBoardRow=3;
function pos(i){
  // Fixed for the original board, never recalculated after removing a pair.
  const shift=mobileBoard.matches?56*(3-firstBoardRow-lastBoardRow):0;
  return {x:32+(i%4)*108,y:14+Math.floor(i/4)*112+shift,w:92,h:72};
}
mobileBoard.addEventListener?.('change',()=>{if(state)render();});
class Board extends Phaser.Scene{
  constructor(){super('board');}
  create(){scene=this;this.nodes=[];this.paint();$('board-loading').hidden=true;$('board-loading').style.display='none';}
  paint(){this.nodes.forEach(n=>n.destroy());this.nodes=[];if(!state)return;
    const add=n=>{this.nodes.push(n);return n;};
    for(let i=0;i<16;i++){if(mobileBoard.matches&&(Math.floor(i/4)<firstBoardRow||Math.floor(i/4)>lastBoardRow))continue;const p=pos(i),stack=state.stacks[i];if(!stack.length){const dot=add(this.add.graphics());dot.fillStyle(0xf0ebf6,1);dot.fillCircle(p.x+p.w/2,p.y+p.h/2,3);continue;}
      const value=stack.at(-1),[fill,ink]=colors[value],g=add(this.add.graphics());
      for(let d=stack.length-1;d>0;d--){g.fillStyle(0xdcd4e9,1);g.fillRoundedRect(p.x+3,p.y+d*5+3,p.w-6,p.h,12);g.fillStyle(0xf3eef8,1);g.fillRoundedRect(p.x+3,p.y+d*5,p.w-6,p.h,12);}
      g.fillStyle(0xe4ddea,1);g.fillRoundedRect(p.x,p.y+4,p.w,p.h,13);g.fillStyle(fill,1);g.fillRoundedRect(p.x,p.y,p.w,p.h,13);
      if(selected===i||hinted.includes(i)){g.lineStyle(selected===i?3:2,selected===i?0x7950b4:0xaa83d6,1);g.strokeRoundedRect(p.x-3,p.y-3,p.w+6,p.h+6,15);}
      add(this.add.text(p.x+11,p.y+9,String(value),{fontFamily:'Arial',fontSize:'14px',fontStyle:'bold',color:ink}));
      add(this.add.text(p.x+p.w/2,p.y+42,String(value),{fontFamily:'Arial',fontSize:'37px',fontStyle:'bold',color:ink}).setOrigin(.5));
      add(this.add.text(p.x+p.w-13,p.y+p.h-13,marks[value],{fontFamily:'Arial',fontSize:'12px',color:ink}).setOrigin(.5));
      if(stack.length>1){
        const beneath=stack.slice(0,-1).reverse().join(' → ');
        add(this.add.text(p.x+p.w/2,p.y+91,'↓ '+beneath,{fontFamily:'Arial',fontSize:'18px',fontStyle:'bold',color:'#655277'}).setOrigin(.5));
      }
    }
  }
  sparkle(indices){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;for(const i of indices){const p=pos(i);for(let j=0;j<8;j++){const q=this.add.circle(p.x+p.w/2,p.y+p.h/2,2+Math.random()*3,[0xb49adf,0xeab7c8,0xb2d8c6,0xe8cc8d][j%4]);this.tweens.add({targets:q,x:q.x+(Math.random()-.5)*110,y:q.y+(Math.random()-.5)*100,alpha:0,scale:.2,duration:450,onComplete:()=>q.destroy()});}}}
}

function validSave(s,key){return s&&s.key===key&&s.version===2&&typeof s.runId==='string'&&E.validStacks(s.stacks)&&E.remaining(s.stacks)>0&&Array.isArray(s.history)&&s.history.every(E.validStacks)&&['hints','undos','misses','total','elapsed'].every(k=>Number.isFinite(s[k])&&s[k]>=0)&&s.total>=E.remaining(s.stacks);}
function validDate(value){if(!/^\d{4}-\d{2}-\d{2}$/.test(value||''))return false;const d=new Date(value+'T12:00:00Z');return !Number.isNaN(d.getTime())&&d.toISOString().slice(0,10)===value&&value>='2026-01-01'&&value<=today();}
function start(nextMode='journey',options={}){
  const level=nextMode==='daily'?6:Math.max(1,Math.min(12,options.level||levelNow()));
  const date=nextMode==='daily'?(validDate(options.date)?options.date:today()):null;
  const key=nextMode==='daily'?`v2:daily:${date}`:`v2:level:${level}`;
  if(state&&state.key===key&&!options.reset&&!busy){close();return;}
  if(state&&!busy){if(options.reset){track('game_end',{reason:'restart',remaining:E.remaining(state.stacks)});delete store.saved[state.key];}else pause('switch_board');}
  mode=nextMode;selected=null;hinted=[];busy=false;
  const saved=options.reset?null:store.saved[key],resumed=validSave(saved,key);
  if(resumed)state={...saved,stacks:E.clone(saved.stacks)};
  else {const stacks=mode==='daily'?E.generate(key,6):P.getLevel(level).stacks;state={version:2,key,runId:uid(),level,date,stacks,total:E.remaining(stacks),history:[],hints:0,undos:0,misses:0,elapsed:0};}
  const original=mode==='daily'?E.generate(key,6):P.getLevel(level).stacks;
  const rows=original.flatMap((stack,i)=>stack.length?[Math.floor(i/4)]:[]);
  firstBoardRow=Math.min(...rows);lastBoardRow=Math.max(...rows);
  activeMs=state.elapsed;activeSince=Date.now();
  track(resumed?'game_resume':'game_start',{reason:options.reason||'open',replay:!!recordFor()});render();persist();
  if(!store.seenLayers&&state.stacks.some(s=>s.length>1))showLayers();
  if(!$('modal').open&&!document.hidden)platform?.play();
}
function render(){
  const left=E.remaining(state.stacks),done=(state.total-left)/2,total=state.total/2,blocked=left>0&&!E.available(state.stacks).length;
  for(const [id,m]of [['journey-mode','journey'],['daily-mode','daily']]){$(id).classList.toggle('active',mode===m);$(id).setAttribute('aria-pressed',mode===m);}
  $('mode-label').textContent=mode==='daily'?'DESAFÍO DIARIO':'TU RECORRIDO · 12 NIVELES';
  $('level-label').textContent=mode==='daily'?`Desafío · ${state.date.split('-').reverse().join('/')}`:`${state.level}. ${P.levels[state.level-1].title}`;
  $('level-badge').textContent=mode==='daily'?'☀':String(state.level).padStart(2,'0');
  $('pair-count').textContent=`${done} / ${total} parejas`;$('progress-fill').style.width=`${done/total*100}%`;$('progressbar').setAttribute('aria-valuenow',Math.round(done/total*100));
  $('move-count').textContent=`${state.hints} pistas · ${state.undos} deshacer`;
  $('lesson').textContent=mode==='daily'?'El mismo tablero para esta fecha. Planificá qué carta liberar.':P.levels[state.level-1].lesson;
  $('objective').textContent='★ Completar · ★★ Sin pistas · ★★★ Sin pistas ni deshacer. Opcional: jugá a tu ritmo.';
  const best=recordFor();$('best-result').textContent=best?`Tu mejor partida: ${'★'.repeat(P.starsFor(best))} · ${best.hints} pistas · ${best.undos} deshacer`:'Todavía no completaste este tablero.';
  $('undo-button').disabled=!state.history.length||busy;$('hint-button').disabled=!left||busy;
  if(blocked)$('instruction').textContent='Sin parejas disponibles. Deshacé para probar otro camino.';
  else if(selected!==null)$('instruction').textContent=`Carta ${state.stacks[selected].at(-1)} seleccionada.`;
  else if(hinted.length)$('instruction').textContent='Pista solicitada: pareja resaltada.';
  else $('instruction').textContent='Elegí dos cartas superiores que sumen 10.';
  $('card-controls').replaceChildren();state.stacks.forEach((s,i)=>{if(!s.length)return;const p=pos(i),b=document.createElement('button');b.className='card-hit';b.dataset.slot=i;b.style.cssText=`left:${p.x/480*100}%;top:${p.y/470*100}%;width:${p.w/480*100}%;height:${p.h/470*100}%`;b.setAttribute('aria-label',`Carta ${s.at(-1)}, fila ${Math.floor(i/4)+1}, columna ${i%4+1}${s.length>1?`, debajo en orden: ${s.slice(0,-1).reverse().join(', ')}`:''}`);b.setAttribute('aria-pressed',selected===i);b.disabled=busy;b.onclick=()=>choose(i);b.onkeydown=e=>{const steps={ArrowRight:1,ArrowLeft:-1,ArrowDown:4,ArrowUp:-4},step=steps[e.key];if(step){e.preventDefault();for(let j=i+step;j>=0&&j<16;j+=step){const target=document.querySelector(`[data-slot="${j}"]`);if(target){target.focus();break;}}}};$('card-controls').append(b);});
  const wins=P.levels.filter(l=>store.completed[l.id]).length,thresholds=[1,3,5,8,10,12],symbols=['✦','❀','◆','☀','✧','✿'];$('milestones').replaceChildren();thresholds.forEach((t,i)=>{const a=document.createElement('span');a.className='medal'+(wins>=t?' earned':'');a.textContent=symbols[i];a.title=`${t} niveles completados`;$('milestones').append(a);});
  $('collection-count').textContent=`${wins} / 12`;$('collection-caption').textContent=wins===12?'Recorrido completo. Elegí un nivel para volver a disfrutarlo.':`${wins} de 12 niveles completados.`;
  $('daily-caption').textContent=store.daily[today()]?'Completado por hoy ✓':'Una nueva combinación';scene?.paint();localize();
}
function choose(i){
  if(adBusy||busy||!Number.isInteger(i)||!state.stacks[i]?.length)return false;
  if(selected===i){selected=null;render();return true;}
  if(selected===null){selected=i;hinted=[];beep('select');render();document.querySelector(`[data-slot="${i}"]`)?.focus({preventScroll:true});return true;}
  const a=selected,b=i;
  if(!E.legal(state.stacks,a,b)){state.misses++;selected=i;hinted=[];track('pair_miss');render();persist();toast('Buscá dos cartas que sumen 10.');return false;}
  store.seenTutorial=true;state.history.push(E.clone(state.stacks));state.stacks=E.remove(state.stacks,a,b);selected=null;hinted=[];
  track('pair_match',{remaining:E.remaining(state.stacks)});beep();render();scene?.sparkle([a,b]);persist();
  if(!E.remaining(state.stacks)){busy=true;win();}
  else {document.querySelector('.card-hit')?.focus({preventScroll:true});if(!E.available(state.stacks).length)track('board_blocked');}
  return true;
}
function undo(){if(!state.history.length||busy)return;state.stacks=state.history.pop();state.undos++;selected=null;hinted=[];track('undo');render();persist();}
function hint(){if(busy)return;const result=E.solve(state.stacks);if(!result.path?.length){track('hint_unavailable',{exhausted:result.exhausted});toast(result.exhausted?'No encontramos una pista todavía. Podés deshacer.':'Este camino quedó cerrado. Deshacé una pareja.');return;}hinted=result.path[0];selected=null;state.hints++;track('hint');render();persist();}
function dialog(html){platform?.stop();$('modal-content').innerHTML=html;localize($('modal-content'));if(!$('modal').open)$('modal').showModal();}
function close(){if($('modal').open)$('modal').close();if(state&&!busy&&!document.hidden&&!adBusy)platform?.play();}
function afterRound(action){
  if(adBusy)return;
  if(!platform){action();return;}
  platform.betweenRounds(()=>{
    adBusy=true;if($('modal').open)$('modal').close();document.querySelector('main').inert=true;document.querySelector('header').inert=true;$('modal-content').inert=true;
    audio?.suspend().catch(()=>{});
  },()=>{
    adBusy=false;document.querySelector('main').inert=false;document.querySelector('header').inert=false;$('modal-content').inert=false;
  }).then(continueGame=>{if(continueGame)action();});
}
function nextLevel(){track('next_level');const level=mode==='journey'?state.level+1:levelNow();close();if(level>12){showLevels();return;}start('journey',{level,reason:'next_level'});}
function win(){platform?.complete();
  const record={hints:state.hints,undos:state.undos,misses:state.misses,seconds:Math.round(elapsed()/1000),date:today(),runId:state.runId};
  const previous=recordFor(),best=P.bestRecord(previous,record),improved=!previous||best.runId===record.runId;
  if(mode==='daily')store.daily[state.date]=best;else store.completed[state.level]=best;
  delete store.saved[state.key];track('game_complete',{...record,stars:P.starsFor(record),newBest:improved});render();beep('win');
  dialog(`<span class="modal-icon">✦</span><span class="eyebrow">${mode==='journey'&&state.level===12?'RECORRIDO COMPLETO':'TODO EN SU LUGAR'}</span><h2>${'★'.repeat(P.starsFor(record))}${'☆'.repeat(3-P.starsFor(record))}</h2><p>${improved?'Guardamos tu mejor resultado.':'Tu mejor resultado anterior se conserva.'}</p><div class="win-stats"><div><strong>${record.hints}</strong><small>pistas</small></div><div><strong>${record.undos}</strong><small>deshacer</small></div><div><strong>${state.total/2}</strong><small>parejas</small></div></div><button class="primary-button" id="next-level">${mode==='daily'?'Seguir mi recorrido':state.level===12?'Elegir otro nivel':'Jugar el siguiente nivel'}</button><button class="secondary-button" id="replay-level">Volver a jugar este tablero</button>${mode==='daily'?'<button class="secondary-button" id="share-result">Copiar resultado y enlace</button>':''}<button class="text-button" id="win-stats">Ver mi progreso</button>`);
  $('next-level').onclick=()=>afterRound(nextLevel);$('replay-level').onclick=()=>afterRound(()=>{track('replay_selected');close();start(mode,{level:state.level,date:state.date,reset:true,reason:'replay'});});$('win-stats').onclick=showStats;
  if($('share-result'))$('share-result').onclick=()=>shareDaily(state.date);
}
function showLevels(){
  track('level_picker_open');dialog(`<span class="eyebrow">TU RECORRIDO</span><h2>Doce pequeños desafíos.</h2><p>Podés elegir cualquier nivel. Las partidas en curso se conservan.</p><div class="level-grid">${P.levels.map(l=>{const r=store.completed[l.id],saved=store.saved['v2:level:'+l.id];return `<button class="level-choice" data-level="${l.id}"><strong>${l.id}. ${l.title}</strong><span>${r?'★'.repeat(P.starsFor(r)):saved?'En curso':'Por descubrir'}</span></button>`;}).join('')}</div><button class="primary-button" id="picker-close">${busy?'Volver a jugar este tablero':'Volver al tablero'}</button>`);
  document.querySelectorAll('[data-level]').forEach(b=>b.onclick=()=>{track('level_selected',{targetLevel:Number(b.dataset.level)});close();start('journey',{level:Number(b.dataset.level),reason:'level_picker'});});$('picker-close').onclick=()=>{close();if(busy)winReturn();};
}
function winReturn(){start(mode,{level:state.level,date:state.date,reset:true,reason:'replay'});}
function showHelp(){dialog('<span class="modal-icon">✧</span><h2>Elegí, liberá, conectá.</h2><ol><li>Seleccioná dos cartas grandes que <strong>sumen 10</strong>.</li><li>Debajo de cada carta, <strong>↓ 1 → 5</strong> indica que vas a liberar primero un 1 y después un 5.</li><li>Si hay dos cartas iguales, mirá cuál libera la que necesitás.</li></ol><p>Una estrella por completar, dos si no usás pistas y tres si además no deshacés. Es opcional: todas las ayudas son gratuitas.</p><label class="language-label" for="language-choice">Idioma</label><select id="language-choice"><option value="es">Español</option><option value="en">English</option></select><button class="secondary-button" id="layer-demo">Probar cómo funcionan las capas</button><button class="primary-button" id="help-close">A jugar</button>');if(I){$('language-choice').value=I.language;$('language-choice').onchange=event=>{store.language=I.setLocale(event.target.value);save();render();showHelp();};}$('layer-demo').onclick=showLayers;$('help-close').onclick=()=>{store.seenTutorial=true;track('tutorial_complete');close();};}
function showLayers(){
  dialog('<span class="eyebrow">PROBÁ SIN CAMBIAR TU PARTIDA</span><h2>¿Qué aparece debajo?</h2><p>El 7 tiene un 1 debajo. Tocá el 7 y el 3 para sumar 10 y descubrirlo.</p><div class="layer-demo"><button id="demo-seven" class="demo-card" aria-label="Seleccionar 7, debajo hay un 1">7<small>↓ 1</small></button><span>+</span><button id="demo-three" class="demo-card" aria-label="Seleccionar 3">3</button></div><p id="demo-status" role="status">Primero tocá el 7.</p><button class="primary-button" id="demo-close">Volver al tablero</button>');
  let first=false;$('demo-seven').onclick=()=>{first=true;$('demo-seven').setAttribute('aria-pressed','true');$('demo-status').textContent=T('Ahora tocá el 3.');};
  $('demo-three').onclick=()=>{if(!first){$('demo-status').textContent=T('Primero elegí el 7.');return;}$('demo-seven').textContent='1';$('demo-seven').setAttribute('aria-label',T('Se liberó el 1'));$('demo-seven').disabled=true;$('demo-three').disabled=true;$('demo-three').textContent='✓';$('demo-status').textContent=T('¡Se liberó el 1! Ahora puede formar pareja con un 9.');store.seenLayers=true;track('layers_demo_complete');};
  $('demo-close').onclick=()=>{store.seenLayers=true;save();close();};
}
function showStats(){
  const records=P.levels.map(l=>store.completed[l.id]).filter(Boolean),oldWins=Object.keys(store.legacy?.completed||{}).length;
  dialog(`<span class="eyebrow">CADA PARTIDA CUENTA</span><h2>Tu recorrido.</h2><div class="stats-grid"><div><strong>${records.length} / 12</strong><span>Niveles completados</span></div><div><strong>${records.reduce((n,r)=>n+P.starsFor(r),0)} / 36</strong><span>Mejores estrellas</span></div></div><p>${storageOK?(platform?.usesPortalData?.()?'CrazyGames gestiona el guardado y puede sincronizarlo con tu cuenta.':'Guardado en este navegador.'):'No se pudo guardar: el progreso durará esta sesión.'} En portales de juegos, la plataforma puede registrar actividad y gestionar anuncios.</p>${oldWins?`<p>Conservamos tus ${oldWins} niveles de la primera versión en el archivo exportable. Este recorrido tiene tableros nuevos.</p>`:''}<h3>Tus desafíos diarios</h3><div class="daily-history">${Object.keys(store.daily).filter(validDate).sort().reverse().map(date=>`<div><button class="text-button" data-date="${date}">${date.split('-').reverse().join('/')} · ${'★'.repeat(P.starsFor(store.daily[date]))}</button><button class="text-button" data-share="${date}" aria-label="Copiar resultado del ${date}">Copiar</button></div>`).join('')||'<p>Todavía no completaste un desafío diario.</p>'}</div><button class="primary-button" id="stats-close">${busy?'Elegir un nivel':'Volver a jugar'}</button><button class="text-button" id="export-stats">Descargar copia de mis partidas</button><label class="restore-label" for="restore-file">Recuperar una copia (.json)</label><input type="file" id="restore-file" accept=".json,application/json"><p class="backup-note">La recuperación combina tus mejores resultados. Conservá también la copia original.</p>`);
  $('stats-close').onclick=()=>{close();if(busy)showLevels();};document.querySelectorAll('[data-date]').forEach(b=>b.onclick=()=>{close();start('daily',{date:b.dataset.date,reason:'daily_history'});});document.querySelectorAll('[data-share]').forEach(b=>b.onclick=()=>shareDaily(b.dataset.share));
  $('restore-file').onchange=event=>importBackup(event.target.files[0]);
  $('export-stats').onclick=()=>{persist();track('export_requested');const blob=new Blob([JSON.stringify({...store,gameVersion:VERSION,exportedAt:new Date().toISOString()},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='diez-y-listo-mis-partidas.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
}
function importBackup(file){
  if(!file)return;
  if(file.size>window.TenBackup.limit){toast('La copia supera el límite de 2 MB.');return;}
  file.text().then(text=>{
    const incoming=window.TenBackup.parse(text),count=Object.keys(incoming.completed).length+Object.keys(incoming.daily).length;
    dialog(`<h2>Recuperar tu progreso</h2><p>La copia contiene ${count} resultados y ${Object.keys(incoming.saved).length} partidas en curso.</p><p>Conservaremos el mejor resultado de cada tablero. Si ya tenés una partida en curso, se mantiene la actual. Los ajustes y el historial de esta sesión no cambian.</p><button class="primary-button" id="restore-confirm">Combinar con mi progreso</button><button class="secondary-button" id="restore-cancel">Cancelar</button>`);
    $('restore-cancel').onclick=showStats;
    $('restore-confirm').onclick=()=>{persist();store=window.TenBackup.merge(store,incoming);save();render();showStats();toast(storageOK?'Copia recuperada. Tus mejores resultados se conservaron.':'Recuperada en esta sesión. Descargá una copia antes de cerrar.');};
  }).catch(()=>toast('No pudimos leer esa copia. Elegí un archivo exportado de Diez y listo, versión 2.'));
}
function shareDaily(date){
  const r=store.daily[date];if(!r)return;const url=new URL(location.href);url.search='';url.hash='';url.searchParams.set('daily',date);
  const text=T(`Diez y listo · ${date}\n${'★'.repeat(P.starsFor(r))} · ${r.hints} pistas · ${r.undos} deshacer\n¿Probás el mismo tablero? ${url.href}`);
  dialog(`<h2>Tu resultado para compartir</h2><p>Copiá el texto y elegí con quién compartirlo. El enlace conserva los permisos de acceso del sitio.</p><textarea class="share-text" readonly aria-label="Resultado para copiar">${escapeHtml(text)}</textarea><button class="primary-button" id="copy-text">Copiar texto</button><p id="copy-status" role="status"></p><button class="secondary-button" id="copy-close">Ver mi progreso</button>`);
  track('share_opened',{date});$('copy-close').onclick=showStats;
  $('copy-text').onclick=async()=>{try{await navigator.clipboard.writeText(text);track('result_copied',{date});$('copy-status').textContent=T('Copiado. Ya podés pegarlo donde quieras.');}catch{$('copy-status').textContent=T('Seleccioná el texto de arriba para copiarlo manualmente.');}};
}
function showMenu(){
  dialog('<h2>Tu partida</h2><button class="secondary-button" id="menu-journey">Tu recorrido</button><button class="secondary-button" id="menu-daily">Desafío del día</button><button class="secondary-button" id="menu-levels">Elegir nivel</button><button class="secondary-button" id="menu-stats">Ver mi progreso</button><button class="secondary-button" id="menu-help">Cómo jugar</button><button class="primary-button" id="menu-close">Volver al tablero</button>');
  $('menu-journey').onclick=()=>{close();start('journey',{reason:'menu'});};
  $('menu-daily').onclick=()=>{close();start('daily',{reason:'menu'});};
  $('menu-levels').onclick=showLevels;$('menu-stats').onclick=showStats;$('menu-help').onclick=showHelp;$('menu-close').onclick=close;
}
$('mobile-menu').onclick=showMenu;
$('journey-mode').onclick=()=>{close();start('journey',{reason:'mode_switch'});};$('daily-mode').onclick=()=>{close();start('daily',{reason:'mode_switch'});};
$('levels-button').onclick=showLevels;$('undo-button').onclick=undo;$('hint-button').onclick=hint;$('help-button').onclick=showHelp;$('stats-button').onclick=showStats;
$('restart-button').onclick=()=>{if(busy)return;dialog('<h2>¿Empezamos de nuevo?</h2><p>Reiniciarás este tablero. Tus mejores resultados se conservan.</p><button class="primary-button" id="confirm-restart">Reiniciar esta partida</button><button class="secondary-button" id="cancel-restart">Seguir jugando</button>');$('confirm-restart').onclick=()=>{close();start(mode,{level:state.level,date:state.date,reset:true,reason:'restart'});};$('cancel-restart').onclick=close;};
function soundLabel(){$('sound-button').setAttribute('aria-pressed',String(store.sound));$('sound-button').setAttribute('aria-label',T(store.sound?'Desactivar sonido':'Activar sonido'));$('sound-button').title=T(store.sound?'Desactivar sonido':'Activar sonido');}
$('sound-button').onclick=()=>{store.sound=!store.sound;soundLabel();save();beep();};soundLabel();
$('modal').addEventListener('close',()=>{if(state&&!busy&&!document.hidden&&!adBusy)platform?.play();});
$('modal').addEventListener('cancel',e=>{if(adBusy){e.preventDefault();return;}if(busy){e.preventDefault();showLevels();}});
let suspended=false;
function suspend(){platform?.stop();if(suspended)return;activeMs+=Date.now()-activeSince;suspended=true;pause('background');}
function resume(){if(state&&!busy&&!adBusy&&!$('modal').open)platform?.play();if(!suspended)return;suspended=false;activeSince=Date.now();if(!busy)track('game_resume',{reason:'foreground'});}
document.addEventListener('visibilitychange',()=>{if(ownsSave||state)(document.hidden?suspend:resume)();});
window.addEventListener('pagehide',()=>{if(state)suspend();ownsSave=false;releaseLock?.();});
window.addEventListener('pageshow',event=>{if(event.persisted)location.reload();});
function boot(){
  try{store=P.migrate(JSON.parse((platform?.storage?.()||localStorage).getItem(KEY)||'null'));saveLoaded=true;}catch{store=P.migrate(null);storageOK=false;saveLoaded=false;$('save-notice').hidden=false;$('save-notice').textContent='No pudimos recuperar el progreso. Jugá temporalmente o recargá para intentar recuperarlo; no sobrescribiremos tus partidas.';}
  if(I){I.setLocale(store.language||((platform?.usesPortalData?.())?(platform.locale?.()||'en'):window.navigator.language));localize();}
  document.querySelector('main').inert=false;document.querySelector('header').inert=false;
  $('tab-notice').hidden=true;soundLabel();track('session_start');const linkedDate=new URLSearchParams(location.search).get('daily');start(validDate(linkedDate)?'daily':'journey',{date:linkedDate,reason:validDate(linkedDate)?'shared_link':'open'});
}
document.querySelector('main').inert=true;document.querySelector('header').inert=true;
function acquireGame(){
if(window.navigator?.locks){
  window.navigator.locks.request(KEY+'-writer',()=>new Promise(resolve=>{releaseLock=resolve;ownsSave=true;boot();})).catch(()=>{storageOK=false;ownsSave=false;$('save-notice').hidden=false;$('save-notice').textContent='Este navegador no permite guardar con protección entre pestañas. Podés jugar y descargar una copia antes de cerrar.';boot();});
}else{storageOK=false;$('save-notice').hidden=false;$('save-notice').textContent='Este navegador no permite guardar con protección entre pestañas. Podés jugar y descargar una copia antes de cerrar.';boot();}
}
if(platform)platform.init().then(acquireGame);else acquireGame();
if(window.Phaser)new Phaser.Game({type:Phaser.CANVAS,width:480,height:470,resolution:Math.min(window.devicePixelRatio||1,2),parent:'board-canvas',transparent:true,antialias:true,scene:Board,banner:false,audio:{noAudio:true},render:{roundPixels:true},fps:{target:30,forceSetTimeOut:true}});
const context=document.modelContext;if(context?.registerTool){const lifecycle=new AbortController();for(const tool of [{name:'read_game_state',description:'Leer las cartas visibles y las inferiores, en orden de liberación.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>({mode,level:state.level,cards:state.stacks.map((s,i)=>({slot:i,value:s.at(-1)||null,below:s.slice(0,-1).reverse()})),selected,won:busy})},{name:'select_game_card',description:'Seleccionar una carta superior por posición de 0 a 15.',inputSchema:{type:'object',properties:{slot:{type:'integer',minimum:0,maximum:15}},required:['slot'],additionalProperties:false},execute:input=>{if(!input||!Number.isInteger(input.slot)||input.slot<0||input.slot>15||busy||!state.stacks[input.slot]?.length)throw new Error('Carta no disponible');choose(input.slot);return{selected,remaining:E.remaining(state.stacks)};}}])try{Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});}
})();
