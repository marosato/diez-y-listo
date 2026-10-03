(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TenGame=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  function hash(text){let h=2166136261;for(const c of String(text)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
  function random(seed){let a=hash(seed);return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
  function clone(stacks){return stacks.map(s=>s.slice());}
  function remaining(stacks){return stacks.reduce((n,s)=>n+s.length,0);}
  function available(stacks){const result=[];for(let i=0;i<stacks.length;i++)for(let j=i+1;j<stacks.length;j++)if(stacks[i].length&&stacks[j].length&&stacks[i].at(-1)+stacks[j].at(-1)===10)result.push([i,j]);return result;}
  function legal(stacks,a,b){return Number.isInteger(a)&&Number.isInteger(b)&&a!==b&&!!stacks[a]?.length&&!!stacks[b]?.length&&stacks[a].at(-1)+stacks[b].at(-1)===10;}
  function remove(stacks,a,b){if(!legal(stacks,a,b))return null;const next=clone(stacks);next[a].pop();next[b].pop();return next;}
  function generate(seed,level=1){
    const rng=random(seed),stacks=Array.from({length:16},()=>[]),count=level===1?8:level===2?12:Math.min(24,14+Math.floor(level/2));
    for(let p=0;p<count;p++){
      const choices=stacks.map((s,i)=>({i,weight:s.length+rng()*.9})).filter(x=>stacks[x.i].length<3).sort((a,b)=>a.weight-b.weight);
      const a=choices[0].i,b=choices[1].i,v=level===1?[1,2,3,4,5,2,4,7][p]:p===count-1?7:1+Math.floor(rng()*9);
      stacks[a].push(v);stacks[b].push(10-v);
    }
    return stacks;
  }
  function solve(input,budget=40000){
    const stacks=clone(input),seen=new Set();let visits=0,exhausted=false;
    function dfs(){if(!remaining(stacks))return [];if(++visits>budget){exhausted=true;return null;}const key=stacks.map(s=>s.join('')).sort().join('|');if(seen.has(key))return null;seen.add(key);
      const pairs=available(stacks).sort((a,b)=>(stacks[b[0]].length+stacks[b[1]].length)-(stacks[a[0]].length+stacks[a[1]].length));
      for(const [a,b]of pairs){const va=stacks[a].pop(),vb=stacks[b].pop(),rest=dfs();stacks[a].push(va);stacks[b].push(vb);if(rest!==null)return [[a,b],...rest];if(exhausted)return null;}return null;
    }
    const path=dfs();return {path,exhausted,visits};
  }
  function validStacks(x){return Array.isArray(x)&&x.length===16&&x.every(s=>Array.isArray(s)&&s.length<=3&&s.every(v=>Number.isInteger(v)&&v>=1&&v<=9))&&remaining(x)%2===0;}
  return {hash,random,clone,remaining,available,legal,remove,generate,solve,validStacks};
});
