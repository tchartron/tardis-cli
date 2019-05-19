const fs = require('fs');
const md5 = require('md5');
const axios = require('axios');
require('log-timestamp');

const buttonPressesLogFile = '/home/thomas/dev/javascript/node/';

console.log(`Watching for file changes on ${buttonPressesLogFile}`);

//Axios config
const remoteAddr = "http://192.168.0.24/api";
var token = "";

const apiUsername = "thomas.chartron@gmail.com";
const apiPassword = "thomasthomas";
var loggedAxios = {};
// var loggedAxiosParams = {
//   baseURL: remoteAddr,
//   timeout: 1000,
//   headers: { "Authorization": "Bearer " + token }
// };
//Logged axios base configuration
// var loggedAxios = axios.create(loggedAxiosParams);
//Try to login to api
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
}).then((response) => {
    console.log('Welcome maggle this is your token : ');
    console.log(response.data.access_token);
    token = response.data.access_token;
    loggedAxios = axios.create({
      baseURL: remoteAddr,
      timeout: 1000,
      headers: { "Authorization": "Bearer " + token }
    });
}, (error) => {
    console.log(error);
});
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
        // const md5Current = md5(fs.readFileSync(buttonPressesLogFile));
        // if (md5Current === md5Previous) {
        //     return;
        // }
        // md5Previous = md5Current;
        console.log(`${filename} file Changed`);
        console.log(`Starting timer !`);
        startTimer();
    }
});

    //Logged axios base configuration
// var loggedAxios = axios.create({
//   baseURL: remoteAddr,
//   timeout: 1000,
//   headers: { "Authorization": "Bearer " + token }
// });
function startTimer() {
    companyId = 1; //CHANGE THIS
    taskId = 1; //CHANGE THIS
    loggedAxios.post("/companies/" + companyId + "/tasks/" + taskId + "/timers")
    .then(response => {
        console.log(response.data);
    }, (error) => {
        console.log(error)
    });
}
