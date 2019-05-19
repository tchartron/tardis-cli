const fs = require('fs');
const axios = require('axios');
require('log-timestamp');

const buttonPressesLogFile = '/home/thomas/dev/javascript/node/';

console.log(`Watching for file changes on ${buttonPressesLogFile}`);

//Axios config
const remoteAddr = "http://192.168.0.24/api";
const token = "";
const loggedAxios = axios.create({
  baseURL: remoteAddr,
  timeout: 1000,
  headers: { "Authorization": "Bearer " + token }
});

const apiUsername = "thomas.chartron@gmail.com";
const apiPassword = "thomasthomas";


//Try to login to api
// var params = JSON.stringify({
//     email: apiUsername,
//     password: apiPassword
// });
// var headers = {
//     "Content-Type": "application/json"
// }
// axios.post(remoteAddr + "/login", {params, headers})
// .then((res) => {
//     console.log('logged')
//     console.log(res.data.representation);
// }, (error) => {
//     console.log(error)
// });

axios({
  method: 'post',
  url: remoteAddr + '/login',
  headers: {
    "Content-Type": "application/json"
  },
  data: {
    email: apiUsername,
    password: apiPassword,
  }
}).then(function (response) {
    console.log('logged')
    console.log(response.data.access_token);
});;

// fs.watchFile(buttonPressesLogFile, (curr, prev) => {
//   console.log(`${buttonPressesLogFile} file Changed`);
// });

//MD5 check for real file change not only saves
// 100MS delay to emmit change event or it fires to often
// credits https://thisdavej.com/how-to-watch-for-files-changes-in-node-js/
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
