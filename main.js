const fs = require('fs');
require('log-timestamp');

const buttonPressesLogFile = '/home/thomas/dev/javascript/node/test.log';

console.log(`Watching for file changes on ${buttonPressesLogFile}`);

fs.watchFile(buttonPressesLogFile, (curr, prev) => {
  console.log(`${buttonPressesLogFile} file Changed`);
});
