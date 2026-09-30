const fs=require('fs');const path=require('path');
const root=path.join(__dirname,'..');let bad=[];let count=0;
function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){if(['node_modules','auth','backups'].includes(e.name))continue;const p=path.join(d,e.name);if(e.isDirectory())walk(p);else if(e.name.endsWith('.js')){count++;try{require('child_process').execFileSync(process.execPath,['--check',p],{stdio:'pipe'});}catch(err){bad.push({file:path.relative(root,p),error:String(err.stderr||err.stdout||err.message)});}}}}
walk(root);console.log(JSON.stringify({javascriptFilesChecked:count,syntaxErrors:bad.length,errors:bad},null,2));process.exitCode=bad.length?1:0;
