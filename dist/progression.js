(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TenProgress=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  // Each stack is written bottom to top. Empty slots keep the board airy.
  const definitions=[
    ['Tu primer diez','Observá el tablero y encontrá tus propias parejas.',[[7],[3],[4],[6],[5],[5]]],
    ['Todas las parejas','Analizá las combinaciones antes de elegir.',[[1],[8],[5],[3],[6],[9],[2],[5],[7],[4]]],
    ['Un paso debajo','Los números pequeños muestran qué vas a liberar, en orden.',[[9,7],[1,3],[2,4],[8,6]]],
    ['Elegir el camino','Cada elección cambia las cartas que quedan disponibles.',[[1,7],[3,9],[3],[7]]],
    ['Dos caminos','Mirá qué queda disponible después de retirar cada pareja.',[[1,7],[3,9],[3],[7],[8,4],[6,2],[6],[4]]],
    ['Un respiro','Un tablero abierto para disfrutar lo aprendido.',[[2],[8],[1],[9],[4],[6],[7],[3],[5],[5]]],
    ['Abrí las puertas','Las parejas de arriba pueden liberar las de otra pila.',[[2,6],[4,8],[4],[6],[1,7],[3,9],[3],[7]]],
    ['Tres capas','Leé cada pila de arriba hacia abajo antes de elegir.',[[5,1,7],[5,9,3],[8,2,4],[2,8,6],[1],[9]]],
    ['Cruce de caminos','Si hay dos cartas iguales, mirá qué esconde cada una.',[[1,7],[3,9],[3],[7],[2,6],[4,8],[4],[6],[5,2],[5,8]]],
    ['Tomá aire','Menos capas, nuevas conexiones. Sin apuro.',[[1,4],[9,6],[7],[3],[2],[8],[5],[5],[4],[6]]],
    ['Mirar dos pasos','Anticipá la próxima pareja y la que viene después.',[[5,1,7],[5,3,9],[3],[7],[2,6],[4,8],[4],[6],[8,4],[2,6]]],
    ['Todo encaja','Tu último desafío: conectá lo que aprendiste.',[[5,1,7],[5,3,9],[3],[7],[9,2,6],[1,4,8],[4],[6],[8,4],[2,6],[7],[3]]]
  ];
  const slots={4:[5,6,9,10],6:[1,2,5,6,9,10],8:[0,1,2,3,8,9,10,11],10:[0,1,2,3,4,5,6,7,9,10],12:[0,1,2,3,4,5,6,7,8,9,10,11]};
  const levels=definitions.map(([title,lesson,piles],index)=>{
    const stacks=Array.from({length:16},()=>[]);piles.forEach((s,i)=>stacks[slots[piles.length][i]]=s);
    return {id:index+1,title,lesson,stacks};
  });
  const getLevel=id=>{const x=levels[id-1];if(!x)throw new Error('Nivel inexistente');return {...x,stacks:x.stacks.map(s=>s.slice())};};
  const starsFor=r=>r.hints===0?(r.undos===0?3:2):1;
  // Prefer independent solutions, then fewer hints, undos and invalid pairs.
  function bestRecord(previous,candidate){
    if(!previous)return {...candidate};
    for(const key of ['hints','undos','misses']){if(candidate[key]<previous[key])return {...candidate};if(candidate[key]>previous[key])return {...previous};}
    return {...previous};
  }
  const fresh=()=>({version:2,completed:{},daily:{},saved:{},events:[],sound:false,seenTutorial:false,legacy:null});
  function migrate(raw){
    const base=fresh();if(!raw||typeof raw!=='object')return base;
    const map=x=>x&&typeof x==='object'&&!Array.isArray(x)?x:{};
    if(raw.version===1)return {...base,sound:raw.sound===true,legacy:{completed:map(raw.completed),daily:map(raw.daily),saved:map(raw.saved),events:Array.isArray(raw.events)?raw.events:[]}};
    if(raw.version!==2)return base;
    const records=x=>Object.fromEntries(Object.entries(map(x)).filter(([,r])=>r&&['hints','undos','misses'].every(k=>Number.isInteger(r[k])&&r[k]>=0)));
    return {...base,...raw,completed:records(raw.completed),daily:records(raw.daily),saved:map(raw.saved),events:Array.isArray(raw.events)?raw.events:[]};
  }
  return {levels,getLevel,starsFor,bestRecord,migrate};
});
