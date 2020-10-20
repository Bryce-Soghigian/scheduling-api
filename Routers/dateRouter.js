const router = require('express').Router();
const database = require("../config/knex-config.js")


router.post("/",(req,res) => {
    database.insert({...req.body})
    .from('calendar')
    .returning("*")
    .then(data => {
        res.status(200).json(data)
    }).catch(err => {
        console.log(err)
        res.status(500).json({errMessage:err})
    })
})
router.get("/",(req,res) => {
    database.select("*")
    .from("calendar")
    .returning("*")
    .then(data => {
        console.log(data)
        res.status(200).json(data)
    }).catch(err =>{
        console.log(err)
        res.status(500).json({errMessage:err})
    })
})

module.exports = router