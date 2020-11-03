const router = require('express').Router();
const database = require("../config/knex-config")
const nodemailer = require("nodemailer");
require('dotenv').config();

  /**
   * phone endpoint
   * The phone endpoint is much simpler
   * it will just send my phone number to the recipient and the date and time via email
   * So req.body = {email:"",'${time}':"Event","currentDate":"01012020"}
   * and update my current schedule withreq.body = {state.currentTime.time:`Phone meeting at ${state.currentTime.time}`
   */
router.put("/phone", (req,res) => {
const date = req.body.currentDate
const email = req.body.email

    //Set up the update object
    let key;
    let updateObject = {};
    var hasNumber = /\d/;
    let keysArray = Object.keys(req.body);
    keysArray.map(x => {
        if(hasNumber.test(x)){
            key = x
        }
    })
    updateObject[key] = req.body[key]
    database("day")
    .where("day.currentDate",date)
    .update(updateObject)
    .returning("*")
    .then(data => {
    res.status(200).json({data:data,email:email})
    })

        // database("day")
        //  .update({req.body.time:})

        // let matrix  = Object.entries(req.body)
        // const message = `Thanks for scheduling a meeting! \n you scheduled a phone meeting on ${req.body.currentDate} at ${matrix[1][0]} \n`
        // const transporter = nodemailer.createTransport({
        //     service:"gmail",
        //     auth :{
        //         user:"mrsoghigiansvirtualassistant@gmail.com",
        //         pass: "Testpassword123"
        //     }
        // })
        // const mailOptions = {
        //     from:"mrsoghigiansvirtualassistant@gmail.com",
        //     to:`req.body.email`,
        //     subject:"Meeting with Bryce Soghigian",
        //     text: message
        // }
        // transporter.sendMail(mailOptions,(error, info) => {
        //     if(error){
        //         console.log(error)
        //     }else{
        //         console.log(`Email sent: ${info.response}`)
        //     }
        // })
        // return res.status(200).json(message)
    
})


module.exports = router