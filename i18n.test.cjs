const assert=require('node:assert/strict'),I=require('./dist/i18n.js'),P=require('./dist/progression.js');
assert.equal(I.setLocale('es_AR'),'es');
assert.equal(I.text('Carta 7 seleccionada.'),'Carta 7 seleccionada.');
for(const locale of [null,'fr-FR','EN-us',''])assert.equal(I.setLocale(locale),'en');
assert.equal(I.text('Carta 7 seleccionada.'),'Card 7 selected.');
assert.equal(I.text('Carta 4, fila 2, columna 3, debajo en orden: 1, 5'),'Card 4, row 2, column 3, below in order: 1, 5');
assert.equal(I.text('2 / 11 parejas'),'2 / 11 pairs');
assert.equal(I.text('Tu mejor partida: ★★★ · 0 pistas · 0 deshacer'),'Your best game: ★★★ · 0 hints · 0 undo');
for(const level of P.levels){assert.notEqual(I.text(`${level.id}. ${level.title}`),`${level.id}. ${level.title}`);assert.notEqual(I.text(level.lesson),level.lesson);}
const share='Diez y listo · 2026-10-04\n★★★ · 0 pistas · 0 deshacer\n¿Probás el mismo tablero? https://game.example/?daily=2026-10-04';
assert.equal(I.text(share),'Diez y listo · 2026-10-04\n★★★ · 0 hints · 0 undo\nTry the same board? https://game.example/?daily=2026-10-04');
// A language change must restore source text and labels, including after game updates.
const label={nodeType:3,nodeValue:'Carta 7 seleccionada.'};
const node={nodeType:1,tagName:'BUTTON',childNodes:[label],attrs:{'aria-label':'Carta 7, fila 1, columna 2'},hasAttribute(k){return k in this.attrs;},getAttribute(k){return this.attrs[k];},setAttribute(k,v){this.attrs[k]=v;}};
I.localize(node);assert.equal(label.nodeValue,'Card 7 selected.');assert.equal(node.attrs['aria-label'],'Card 7, row 1, column 2');
label.nodeValue='Carta 4 seleccionada.';I.localize(node);assert.equal(label.nodeValue,'Card 4 selected.');
I.setLocale('es-AR');I.localize(node);assert.equal(label.nodeValue,'Carta 4 seleccionada.');assert.equal(node.attrs['aria-label'],'Carta 7, fila 1, columna 2');
I.setLocale('en');I.localize(node);assert.equal(label.nodeValue,'Card 4 selected.');
console.log('PASS: locale fallback, translated levels, accessibility, sharing and reversible live language changes.');
