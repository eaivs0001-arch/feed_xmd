const fs=require('fs');const path=require('path');
const root=path.join(__dirname,'..');
const manifest=require('../scr/commands/manifest').requested;
const dirs=fs.readdirSync(path.join(root,'scr','commands'),{withFileTypes:true}).filter(x=>x.isDirectory()&&x.name!=='bugs');
const files=new Set();for(const d of dirs){for(const f of fs.readdirSync(path.join(root,'scr','commands',d.name))){if(f.endsWith('.js'))files.add(f.slice(0,-3));}}
const unique=[...new Set(manifest)];const missing=unique.filter(x=>!files.has(x));const dup=manifest.filter((x,i)=>manifest.indexOf(x)!==i);
console.log(JSON.stringify({requested:manifest.length,unique:unique.length,dedicatedFileNames:files.size,missing,duplicates:[...new Set(dup)]},null,2));
