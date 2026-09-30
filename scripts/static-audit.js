const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');
const requested=require('../scr/commands/manifest').requested;
const files=new Set();
function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){if(e.name==='bugs')continue;const p=path.join(d,e.name);if(e.isDirectory())walk(p);else if(e.name.endsWith('.js'))files.add(e.name.slice(0,-3));}}
walk(path.join(root,'scr','commands'));
const duplicate=requested.filter((x,i,a)=>a.indexOf(x)!==i);
const direct=requested.filter(x=>files.has(x));
console.log(JSON.stringify({requested:[...new Set(requested)].length,dedicatedFileNames:direct.length,duplicates:[...new Set(duplicate)]},null,2));
