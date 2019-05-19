const fs = require('fs');
require('log-timestamp');

const buttonPressesLogFile = '/home/thomas/dev/javascript/node/';

console.log(`Watching for file changes on ${buttonPressesLogFile}`);

// fs.watchFile(buttonPressesLogFile, (curr, prev) => {
//   console.log(`${buttonPressesLogFile} file Changed`);
// });

//MD5 check for real file change not only saves
// 100MS delay to emmit change event or it fires to often
let md5Previous = null;
let fsWait = false;
fs.watch(buttonPressesLogFile, (event, filename) => {
  if (filename) {
    if (fsWait) return;
    fsWait = setTimeout(() => {
      fsWait = false;
    }, 100);
    const md5Current = md5(fs.readFileSync(buttonPressesLogFile));
    if (md5Current === md5Previous) {
      return;
    }
    md5Previous = md5Current;
    console.log(`${filename} file Changed`);
  }
});
