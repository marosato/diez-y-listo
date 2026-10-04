/* Optional CrazyGames SDK v3 adapter. Web builds keep local storage. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory;else root.TenPlatform=factory(root);})(typeof window==='object'?window:this,function(root){
  'use strict';
  let sdk=null,playing=false,inFlight=false,completed=0,lastAd=Date.now();
  function event(name){try{sdk?.game[name]?.();}catch{}}
  const api={
    async init(){
      if(!root.CrazyGames?.SDK)return;
      const candidate=root.CrazyGames.SDK;
      let timer;
      try{
        await Promise.race([candidate.init(),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('SDK timeout')),8000);})]);
        if(['local','crazygames'].includes(candidate.environment))sdk=candidate;
      }catch{}finally{clearTimeout(timer);}
    },
    locale(){try{return sdk?.user?.systemInfo?.locale||null;}catch{return null;}},
    usesPortalData(){return !!root.CrazyGames;},
    storage(){
      if(!root.CrazyGames)return root.localStorage;
      if(!sdk?.data)throw Error('Portal storage unavailable');
      return sdk.data;
    },
    play(){if(!playing){playing=true;event('gameplayStart');}},
    stop(){if(playing){playing=false;event('gameplayStop');}},
    complete(){completed++;api.stop();},
    async betweenRounds(pause,resume){
      if(inFlight)return false;
      if(!sdk||completed<2||Date.now()-lastAd<120000)return true;
      inFlight=true;lastAd=Date.now();api.stop();pause();
      return new Promise(resolve=>{
        let done=false;
        const finish=()=>{if(done)return;done=true;inFlight=false;resume();resolve(true);};
        try{sdk.ad.requestAd('midgame',{adStarted:()=>{},adFinished:finish,adError:finish});}catch{finish();}
      });
    }
  };
  return api;
});
