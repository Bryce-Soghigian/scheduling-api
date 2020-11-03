const router = require("express").Router();
const database = require("../config/knex-config");
const nodemailer = require("nodemailer");
require("dotenv").config();


/**
 * phone endpoint
 * The phone endpoint is much simpler
 * it will just send my phone number to the recipient and the date and time via email
 * So req.body = {email:"",'${time}':"Event","currentDate":"01012020"}
 * and update my current schedule withreq.body = {state.currentTime.time:`Phone meeting at ${state.currentTime.time}`
 */
router.put("/phone", (req, res) => {
  const monthsArray = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  const date = req.body.currentDate;
  const email = req.body.email;
  const currentDate = req.body.currentDate;
  let month = monthsArray[currentDate.slice(0,2)-1]
  let day = currentDate.slice(2,4)
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
    to: email, // receiver
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
