var fs = require('fs');

var FILE_PATH = '../src/javascript/';
var fileList = {};

function combo(fileName){
    var fc = fs.readFileSync(FILE_PATH + fileName, 'utf-8');
    var lines = fc.split('\n');
    var p = /\$import\(['"][^)]+['"]\)/i;
    var i;
    var l = lines.length;
    var mpath;
    var mn;
    var mc = [];
    var ret;

    for(i=0; i<l; i++){
        mpath = null;
        lines[i] && (mpath = lines[i].match(p));
        
        if(mpath){
            mn = mpath[0].replace(/\$import\(['"']/,'').replace(/['"]\)/,'').replace(/\./g,'/') + '.js';
            lines[i] = '';
            if(!fileList[mn]){
                fileList[mn] = 1;
                mc.push(combo(mn));
            }
            
        }
    }

    ret = mc.join('') + '\n' + lines.join('\n');

    return ret;
}

var mainjs = combo('main.js');
var loadjs = fs.readFileSync('../src/load.js', 'utf-8');


fs.writeFileSync('../dist/game.js', mainjs + '\n' + loadjs , 'utf-8');


