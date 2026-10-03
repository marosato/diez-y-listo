(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./engine.js'),require('./progression.js'));else root.TenBackup=factory(root.TenGame,root.TenProgress);})(typeof window==='object'?window:this,function(E,P){
  'use strict';
  const limit=2*1024*1024;
  const integer=x=>Number.isSafeInteger(x)&&x>=0&&x<=1000000000;
  const date=x=>typeof x==='string'&&/^20\d\d-\d\d-\d\d$/.test(x)&&!Number.isNaN(Date.parse(x))&&new Date(x).toISOString().slice(0,10)===x;
  const record=r=>r&&['hints','undos','misses','seconds'].every(k=>integer(r[k]))&&date(r.date)&&typeof r.runId==='string'&&r.runId.length<150;
  function parse(text){
    if(text.length>limit)throw Error('La copia supera el límite de 2 MB.');
    const raw=JSON.parse(text);
    if(!raw||raw.version!==2||typeof raw.gameVersion!=='string'||!/^2\./.test(raw.gameVersion))throw Error('Elegí una copia exportada desde la versión 2 de Diez y listo.');
    const out=P.migrate(null);
    for(const name of ['completed','daily','saved']){
      if(!raw[name]||typeof raw[name]!=='object'||Array.isArray(raw[name]))throw Error('La copia está incompleta.');
      for(const [key,value] of Object.entries(raw[name])){
        if(name==='completed'||name==='daily'){
          if(!(name==='completed'?/^(?:[1-9]|1[0-2])$/.test(key):date(key))||!record(value))throw Error('La copia contiene resultados inválidos.');
          out[name][key]={hints:value.hints,undos:value.undos,misses:value.misses,seconds:value.seconds,date:value.date,runId:value.runId};
        }else{
          const s=value, daily=key.startsWith('v2:daily:'),validKey=daily?date(key.slice(9)):/^v2:level:(?:[1-9]|1[0-2])$/.test(key);
          if(!validKey||!s||s.key!==key||s.version!==2||typeof s.runId!=='string'||s.runId.length>150||!E.validStacks(s.stacks)||!E.remaining(s.stacks)||!Array.isArray(s.history)||s.history.length>24||!s.history.every(E.validStacks)||!['hints','undos','misses','total','elapsed'].every(k=>integer(s[k]))||s.total>48||s.total<E.remaining(s.stacks)||s.total%2||s.level!==(daily?6:Number(key.slice(9)))||(daily?s.date!==key.slice(9):s.date!==null))throw Error('La copia contiene una partida inválida.');
          out.saved[key]={version:2,key,runId:s.runId,level:s.level,date:s.date,stacks:E.clone(s.stacks),history:s.history.map(E.clone),hints:s.hints,undos:s.undos,misses:s.misses,total:s.total,elapsed:s.elapsed};
        }
      }
    }
    return out;
  }
  function merge(current,incoming){
    const out=JSON.parse(JSON.stringify(current));
    for(const name of ['completed','daily'])for(const [key,r] of Object.entries(incoming[name]))out[name][key]=P.bestRecord(out[name][key],r);
    for(const [key,s] of Object.entries(incoming.saved))if(!out.saved[key])out.saved[key]=s;
    return out;
  }
  return {parse,merge,limit};
});
