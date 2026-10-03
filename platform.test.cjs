const assert=require('node:assert/strict'),create=require('./dist/platform.js');
(async()=>{
  const originalNow=Date.now;let now=0;Date.now=()=>now;
  try{
    const calls=[];let callbacks;
    const sdk={environment:'crazygames',init:async()=>{},game:{gameplayStart:()=>calls.push('start'),gameplayStop:()=>calls.push('stop')},ad:{requestAd:(kind,cb)=>{calls.push(kind);callbacks=cb;}}};
    const p=create({CrazyGames:{SDK:sdk}});await p.init();p.play();p.play();assert.deepEqual(calls,['start']);p.complete();
    let paused=0,resumed=0;
    assert.equal(await p.betweenRounds(()=>paused++,()=>resumed++),true);assert.equal(paused,0);
    p.complete();now=120001;
    const pending=p.betweenRounds(()=>paused++,()=>resumed++);assert.equal(paused,1);
    assert.equal(await p.betweenRounds(()=>paused++,()=>resumed++),false,'No duplicate requests');
    callbacks.adStarted();callbacks.adError(Error('no fill'));assert.equal(await pending,true);assert.equal(resumed,1);
    callbacks.adFinished();assert.equal(resumed,1,'Duplicate callback does not resume twice');
    await p.betweenRounds(()=>paused++,()=>resumed++);assert.equal(paused,1,'Cooldown retained after failure');
    now+=120001;sdk.ad.requestAd=()=>{throw Error('SDK failed');};assert.equal(await p.betweenRounds(()=>paused++,()=>resumed++),true);assert.equal(resumed,2);
    const off=create({});await off.init();off.complete();off.complete();now+=120001;assert.equal(await off.betweenRounds(()=>{throw Error('must not pause');},()=>{}),true);
    const disabled=create({CrazyGames:{SDK:{...sdk,environment:'disabled'}}});await disabled.init();disabled.complete();disabled.complete();now+=120001;assert.equal(await disabled.betweenRounds(()=>{throw Error('must not request');},()=>{}),true);
    console.log('PASS: SDK unavailable/disabled, gameplay deduplication, ad cooldown, no-fill, thrown errors and duplicate callbacks.');
  }finally{Date.now=originalNow;}
})().catch(e=>{console.error(e);process.exitCode=1;});
