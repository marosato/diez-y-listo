const assert=require('node:assert/strict');
const E=require('./dist/engine.js'),P=require('./dist/progression.js');
assert.equal(P.levels.length,12);
for(const level of P.levels){
  const original=JSON.stringify(level.stacks);let board=P.getLevel(level.id).stacks;
  assert(E.validStacks(board));const solution=E.solve(board);assert(solution.path,`Level ${level.id}`);
  for(const [a,b] of solution.path){assert.equal(board[a].at(-1)+board[b].at(-1),10);board=E.remove(board,a,b);}
  assert.equal(E.remaining(board),0);assert.equal(JSON.stringify(level.stacks),original);
}
// The first planning lesson has both a winning and a losing opening:
// 7 on pile 5 releases the needed 1; the isolated 7 on pile 10 does not.
const fork=P.getLevel(4).stacks;
assert(E.solve(E.remove(fork,5,9)).path);
assert.equal(E.solve(E.remove(fork,10,9)).path,null);
const excellent={hints:0,undos:0,misses:0,runId:'best'};
assert.equal(P.starsFor(excellent),3);
assert.equal(P.starsFor({...excellent,undos:1}),2);
assert.equal(P.starsFor({...excellent,hints:1}),1);
assert.deepEqual(P.bestRecord(excellent,{hints:1,undos:0,misses:0,runId:'worse'}),excellent);
assert.deepEqual(P.bestRecord({...excellent,hints:1},excellent),excellent);
const legacy={version:1,completed:{1:{score:800}},saved:{'level:2':{stacks:[[7]]}},events:[{event:'game_start'}],sound:true};
const snapshot=JSON.stringify(legacy),migrated=P.migrate(legacy);
assert.equal(migrated.version,2);assert.deepEqual(migrated.completed,{});
assert.deepEqual(migrated.legacy.completed,legacy.completed);assert.deepEqual(migrated.legacy.saved,legacy.saved);
assert.equal(JSON.stringify(legacy),snapshot);assert.equal(migrated.sound,true);
assert.deepEqual(P.migrate(migrated),migrated);
assert.deepEqual(P.migrate({version:2,completed:{1:{hints:-1}},daily:[],saved:null,events:null}).completed,{});
console.log('PASS: 12 authored levels, strategic fork, best results, stars, legacy preservation.');
