const fs=require('node:fs'),path=require('node:path');
const platform=process.argv[2]||'web';
if(!['web','crazygames'].includes(platform))throw Error('Use web or crazygames');
const out=path.join(__dirname,'build',platform);
fs.mkdirSync(out,{recursive:true});fs.cpSync(path.join(__dirname,'dist'),out,{recursive:true});
const index=path.join(out,'index.html');let html=fs.readFileSync(index,'utf8');
if(platform==='crazygames'){
  html=html.replace('<script src="vendor/phaser.min.js">','<script src="https://sdk.crazygames.com/crazygames-sdk-v3.js"></script><script src="vendor/phaser.min.js">');
  html=html.replace('Beta · Sin anuncios · Progreso en este dispositivo','Guardado y publicidad gestionados por CrazyGames');
}
fs.writeFileSync(index,html);console.log(out);
