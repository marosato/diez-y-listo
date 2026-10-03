const assert=require('node:assert/strict'),B=require('./dist/backup.js'),P=require('./dist/progression.js');
const base=P.migrate(null),record={hints:0,undos:0,misses:0,seconds:30,date:'2026-09-30',runId:'original'};
base.completed[1]=record;
const incoming={...P.migrate(null),gameVersion:'2.1.0'};
incoming.completed[1]={...record,hints:2,runId:'worse'};incoming.completed[2]={...record,runId:'second'};
incoming.saved['v2:level:3']={version:2,key:'v2:level:3',runId:'saved',level:3,date:null,stacks:P.getLevel(3).stacks,history:[],total:8,elapsed:23,hints:0,undos:0,misses:0};
const parsed=B.parse(JSON.stringify(incoming)),merged=B.merge(base,parsed);
assert.equal(merged.completed[1].runId,'original');assert.equal(merged.completed[2].runId,'second');assert.equal(merged.saved['v2:level:3'].runId,'saved');
assert.equal(base.completed[2],undefined,'Merge does not mutate source');
base.saved['v2:level:3']={...incoming.saved['v2:level:3'],runId:'current'};assert.equal(B.merge(base,parsed).saved['v2:level:3'].runId,'current');
for(const mutate of [x=>x.version=7,x=>x.completed[1].hints=-1,x=>x.saved['v2:level:3'].level=8,x=>x.saved['v2:level:3'].stacks[0]=[99],x=>x.saved['v2:level:3'].history=Array(25).fill(P.getLevel(3).stacks),x=>x.completed['__proto__']={bad:true}]){
  const x=JSON.parse(JSON.stringify(incoming));mutate(x);if(Object.getPrototypeOf(x.completed)!==Object.prototype)continue;assert.throws(()=>B.parse(JSON.stringify(x)));
}
assert.throws(()=>B.parse('{invalid'));assert.throws(()=>B.parse(' '.repeat(B.limit+1)));
const proto=JSON.stringify(incoming).replace('"completed":{','"completed":{"__proto__":{},');assert.throws(()=>B.parse(proto));
assert.equal({}.bad,undefined);
console.log('PASS: restore validation, safe merge, current run preserved, malformed/oversized/incompatible backups rejected.');
