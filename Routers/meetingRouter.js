const router = require('express').Router();
const database = require("../config/knex-config.js");
require('dotenv').config();


/**
Meeting Router 
Fetch all existing calendar meetings
Fetch current week and the following week
be able to add an event to the calendar

 */


 /**
 ADD FULL DAY SCHEDULE
  */
router.post("/fullDay", (req,res) => {
database.insert({...req.body})
.from("day")
.returning("*")
.then(data => {
    res.status(201).json(data)
}).catch(err => {
    res.status(500).json({errMessage:err})
})
})
//Gets events for a day
router.get("/:date",(req,res) => {
let {date} = req.params
database.select("*")
.where("day.currentDate",date)
.from("day")
.then(data => {
    res.status(200).json(data)
}).catch(err => {
    res.status(500).json(err)
})
})

/**
Get all events in a range of dates
 */
 router.get("/range/:startDate/:endDate",(req,res) => {
const {startDate,endDate} = req.params;
database.select("*")
.whereBetween("day.currentDate",[startDate,endDate])
.from("day")
.then(data => {
    res.status(200).json(data)
}).catch(err => {
    res.status(500).json(err)
})

 })

 /**
  * Update the schedule for a day
  */
 router.put("/:date", (req,res) => {
     const {date} = req.params;
    //  const {event,time} = req.body;
    database.update({...req.body})
    .where("day.currentDate",date)
    .from("day")
    .then(changes => {
    res.status(200).json(changes)
    }).catch(err => {
        res.status(500).json(err)
    })
     
 })
 /**
  * Update a single event at a given time
  * req.body
  * {
	"event":"free",
	"time":"00:00"
}
  */
 router.put("/patch/:date", (req,res) => {
    const {date} = req.params;
    const {event,time} = req.body;
    let updateObject = {}
    updateObject[time] = event
    console.log(updateObject)
   database.update(updateObject)
   .where("day.currentDate",date)
   .from("day")
   .then(changes => {
   res.status(200).json(changes)
   }).catch(err => {
       res.status(500).json(err)
   })
    
})

module.exports = router
