const assert = require('node:assert/strict');
const E = require('./dist/engine.js');
let maxVisits = 0;
for (let n = 1; n <= 120; n++) {
  const board = E.generate('level:' + n, n);
  const original = E.clone(board);
  assert(E.validStacks(board));
  assert.deepEqual(board, E.generate('level:' + n, n), 'Deterministic generation');
  const result = E.solve(board);
  assert(result.path, 'Solvable level ' + n);
  assert.deepEqual(board, original, 'Solver does not mutate game');
  let current = board;
  for (const [a, b] of result.path) {
    assert.notEqual(a, b);
    assert.equal(current[a].at(-1) + current[b].at(-1), 10);
    const previous = current;
    current = E.remove(current, a, b);
    assert.equal(E.remaining(previous) - E.remaining(current), 2);
  }
  assert.equal(E.remaining(current), 0);
  maxVisits = Math.max(maxVisits, result.visits);
}
for (let n = 1; n <= 30; n++) assert(E.solve(E.generate('daily:2026-09-' + n, 6)).path);
const example = E.generate('test');
assert.equal(E.remove(example, 0, 0), null);
assert.equal(E.remove(example, -1, 20), null);
assert.equal(E.legal([], 1, 2), false);
assert(!E.validStacks([[10]]));
const blocked = Array.from({length:16},()=>[]);blocked[0]=[1];blocked[1]=[2];
assert.equal(E.solve(blocked).path,null);
const hidden = Array.from({length:16},()=>[]);hidden[0]=[1,7];hidden[1]=[9,3];
assert.deepEqual(E.solve(hidden).path,[[0,1],[0,1]]);
assert(E.solve(example,0).exhausted);
console.log(JSON.stringify({levels:120,dailyBoards:30,solvable:true,maxSolverVisits:maxVisits,illegalMovesRejected:true,hiddenCards:true,deadEndDetection:true}));
