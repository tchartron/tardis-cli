const fs = require('fs');
const md5 = require('md5');
const axios = require('axios');
require('log-timestamp');

const watchDir = '/home/thomas/dev/javascript/node/';

console.log(`Watching for file changes on ${watchDir}`);

//Axios config
const remoteAddr = "http://192.168.0.24/api";
var token = "";

const apiUsername = "thomas.chartron@gmail.com";
const apiPassword = "thomasthomas";
this.loggedAxios = {};
this.apiInfos = {};
this.user = {};
this.currentTimer = {};

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
    console.log('Welcome this is your token : ');
    console.log(response.data.access_token);
    //Api infos
    this.apiInfos = response.data;
    //Logged axios instance base configuration
    this.loggedAxios = axios.create({
        baseURL: remoteAddr,
        timeout: 1000,
        headers: { "Authorization": "Bearer " + this.apiInfos.access_token }
    });
    //get user just logged in
    this.user = getUser(this.loggedAxios);

}, (error) => {
    console.log(error);
});
//MD5 check for real file change not only saves
// 100MS delay to emmit change event or it fires to often
// credits https://thisdavej.com/how-to-watch-for-files-changes-in-node-js/
let md5Previous = null;
let fsWait = false;
fs.watch(watchDir, (event, filename) => {
    if (filename) {
        if (fsWait) return;
        fsWait = setTimeout(() => {
            fsWait = false;
        }, 1000);
        // const md5Current = md5(fs.readFileSync(watchDir));
        // if (md5Current === md5Previous) {
        //     return;
        // }
        // md5Previous = md5Current;
        console.log(`${filename} file Changed`);
        console.log(`Starting timer !`);
        startTimer(this.loggedAxios);
    }
});


function startTimer(axiosInstance) {
    companyId = 1; //CHANGE THIS
    taskId = 1; //CHANGE THIS
    axiosInstance.post("/companies/" + companyId + "/tasks/" + taskId + "/timers")
    .then(response => {
        console.log(response.data);
        this.currentTimer = response.data;
    }, (error) => {
        console.log(error)
    });
}

function getUser(axiosInstance) {
    axiosInstance.post("/me")
    .then(response => {
        console.log(response.data);
        // this.user = response.data;
        return response.data;
    }, (error) => {
        console.log(error)
        return {};
    });
}

