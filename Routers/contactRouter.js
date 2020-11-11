const router = require("express").Router();
const database = require("../config/knex-config");
const nodemailer = require("nodemailer");
require("dotenv").config();
const jwt = require('jsonwebtoken');
const rp = require('request-promise');

/**
 * Step 1
 * Update the meeting time in the calendar to relfect the changes
 * Step 2
 * Make a request to the zoom api to schedule a meeting for that time
 * Step 3 
 * Send an email to the client with the meeting time and the zoom url
 */
router.put("/zoom", (req,res) =>{
  const date = req.body.currentDate;
  const email = req.body.email;
  const monthsArray = ["January","Febuary","March","April","May","June","July","August","September","October","November","December"]
  const currentDate = req.body.currentDate;
  let month = monthsArray[currentDate.slice(4,6)-1]
  //============= Update meeting time logic=================
  let key;
  let updateObject = {};
  let responseObject = {};
  var hasNumber = /\d/;
  let keysArray = Object.keys(req.body);
  keysArray.map((x) => {
    if (hasNumber.test(x)) {
      key = x;
    }
  });
  updateObject[key] = req.body[key];
    database("day")
      .where("day.currentDate", date)
      .update(updateObject)
      .returning("*")
      .then((data) => {
        responseObject["successUpdate"] = data;
      }).catch(err => {
          console.log(err)
          responseObject["errorUpdate"] = err;

      })

        //================================================================================================================================================================

  //================Zoom api create meeting logic============
  //Use the ApiKey and APISecret from .env


//=========AUTH =======

const payload = {
iss: process.env.zoomApiKey,
exp: ((new Date()).getTime() + 5000)
};
const token = jwt.sign(payload, process.env.zoomApiSecret);

let desiredStartTime = req.body.currentDate;
let formatedStartDate = `${desiredStartTime.slice(0,4)}-${desiredStartTime.slice(4,6)}-${desiredStartTime.slice(6,8)}`
console.log(formatedStartDate)
formatedStartDate = new Date(formatedStartDate);
var dd = String(formatedStartDate.getDate()+1).padStart(2, "0");
var mm = String(formatedStartDate.getMonth() + 1).padStart(2, "0");
var yyyy = formatedStartDate.getFullYear();
let newStartDate = `${yyyy}-${mm}-${dd}`;
console.log(newStartDate,"new start")
let newHour = Number(key[0] + key[1])

newHour = newHour.toString() +":" + "00"
console.log(newHour,"faff")
let startTime = new Date(`${dd} ${month} ${yyyy} ${newHour} UTC`)

startTime = startTime.toISOString()
console.log(startTime,"start time date")
//ZOOM API REQUEST BODY 
let zoomRequestBody = {
"created_at": startTime,
"duration": 60,
"host_id": "Sy5IuXCgT1iDmDcMFa6Rzg",
"id": 1100000,
"join_url": "https://zoom.us/j/1100000",
"settings": {
  "alternative_hosts": "",
  "approval_type": 2,
  "audio": "both",
  "auto_recording": "local",
  "close_registration": false,
  "cn_meeting": false,
  "enforce_login": false,
  "enforce_login_domains": "",
  "host_video": false,
  "in_meeting": false,
  "join_before_host": true,
  "mute_upon_entry": false,
  "participant_video": false,
  "registrants_confirmation_email": true,
  "use_pmi": false,
  "waiting_room": false,
  "watermark": false,
  "registrants_email_notification": true
},
"start_time": startTime,
"start_url": "https://zoom.us/s/1100000?iIifQ.wfY2ldlb82SWo3TsR77lBiJjR53TNeFUiKbLyCvZZjw",
"status": "waiting",
"timezone": "America/Chicago",
"topic": "Zoom Interview",
"type": 2,
"uuid": "ng1MzyWNQaObxcf3+Gfm6A=="
}

var options = {
method: 'POST',
uri: `https://api.zoom.us/v2/users/Sy5IuXCgT1iDmDcMFa6Rzg/meetings`, 
qs: {
    status: 'active' 
},
auth: {
    'bearer': token
},
headers: {
    'content-type': 'application/json'
},
body:zoomRequestBody,
json: true //Parse the JSON string in the response
};

//Use request-promise module's .then() method to make request calls.
rp(options)
.then(function (response) {
//printing the response on the console
  responseObject["zoomMeetingSuccess"] = response
  res.status(200).json(responseObject)
})
.then(data => {
        //================Email Config================

        let day = currentDate.slice(6,8)
        const mailOptions = {
            from: "mrsoghigiansvirtualassistant@gmail.com", // sender
            to: `${email},"bsoghigian@gmail.com`, // receiver
            subject: "Zoom Meeting", // Subject
            html: `You have successfully scheduled a zoom interview with Mr. Bryce Soghigian for ${key} on  ${month} ${day} \n Please join the meeting at ${responseObject.zoomMeetingSuccess.join_url}`, // html body
          };
          const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "mrsoghigiansvirtualassistant@gmail.com", //your gmail account you used to set the project up in google cloud console"
              pass:process.env.emailPassword
            },
          });
          transport.sendMail(mailOptions, function (err, result) {
            if (err) {
              responseObject["mailError"] = err
              res.status(500).json(responseObject)
            } else {
              transport.close();
              responseObject["mailSuccess"] = result
              responseObject["EMAIL"] = `You have successfully scheduled a zoom interview with Mr. Bryce Soghigian for ${key} on  ${month} ${day} \n Please join the meeting at ${responseObject.zoomMeetingSuccess.join_url}`
              res.status(200).json(responseObject)
            }
          })
})
.catch(function (err) {
    // API call failed...
    responseObject["zoomMeetingError"] = err
    console.log('API call failed, reason ', err);
});



})

/**
 * phone endpoint
 * The phone endpoint is much simpler
 * it will just send my phone number to the recipient and the date and time via email
 * So req.body = {email:"",'${time}':"Event","desiredStartTime":"01012020"}
 * and update my current schedule withreq.body = {state.currentTime.time:`Phone meeting at ${state.currentTime.time}`
 */
router.put("/phone", (req, res) => {
  const monthsArray = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  const date = req.body.currentDate;
  const email = req.body.email;
  const currentDate = req.body.currentDate;
  let month = monthsArray[currentDate.slice(4,6)-1]
  let day = currentDate.slice(6,8)
  //Set up the update object
  let key;
  let updateObject = {};
  let responseObject = {};
  var hasNumber = /\d/;
  let keysArray = Object.keys(req.body);
  keysArray.map((x) => {
    if (hasNumber.test(x)) {
      key = x;
    }
  });
  updateObject[key] = req.body[key];
  const mailOptions = {
    from: "mrsoghigiansvirtualassistant@gmail.com", // sender
    to: `${email},bsoghigian@gmail.com`, // receiver
    subject: "Phone Interview", // Subject
    html: `You have successfully scheduled a phone interview with Mr. Bryce Soghigian for ${key} on  ${month} ${day} \n Please call him at 515-361-2386`, // html body
  };
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mrsoghigiansvirtualassistant@gmail.com", //your gmail account you used to set the project up in google cloud console"
      pass:process.env.emailPassword
    },
  });
  database("day")
    .where("day.currentDate", date)
    .update(updateObject)
    .returning("*")
    .then((data) => {
      responseObject["currentDay"] = data;
    }).catch(err => {
        console.log(err)
    })
  transport.sendMail(mailOptions, function (err, result) {
    if (err) {
      res.send({
        message: err,
      });
    } else {
      transport.close();
      res.send({
        message: `You have successfully scheduled a phone interview with Mr. Bryce Soghigian for ${key} on  ${month} ${day} `,
        data:responseObject
      });
    }
  })
});

module.exports = router;
