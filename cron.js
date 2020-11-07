const Axios = require("axios")
var startDate = new Date("2020-10-01"); //YYYY-MM-DD
var endDate = new Date("2020-12-30"); //YYYY-MM-DD

var getDateArray = function(start, end) {
    var arr = new Array();
    var dt = new Date(start);
    while (dt <= end) {
        dt.setDate(dt.getDate() + 1);
        var dd = String(dt.getDate()).padStart(2, "0");
        var mm = String(dt.getMonth() + 1).padStart(2, "0");
        var yyyy = dt.getFullYear();
        let newStartDate = `${mm}${dd}${yyyy}`;
        arr.push(newStartDate);
    }
    return arr;
}
console.log(getDateArray(startDate,endDate))
let datesArray = getDateArray(startDate,endDate)
//Seed database with dates
for(let i = 0;i<datesArray.length;i++){
    let requestObject = {date:datesArray[i]}
    Axios.post("http://localhost:5555/api/v1/date/",requestObject)
    .then(res => {
        console.log(res)
    }).catch(err => {
        console.log(err)
    })
}
for(let i = 0;i<datesArray.length;i++){
    let requestObject = {
        "currentDate":datesArray[i],
        "00:00":"sleep",
        "01:00":"sleep",
        "02:00":"sleep",
        "03:00":"Sleep",
        "04:00":"Sleep",
        "05:00":"Sleep",
        "06:00":"Sleep",
        "07:00":"sleep",
        "08:00":"Sleep",
        "09:00":"Sleep",
        "10:00":"Sleep",
        "11:00":"free",
        "12:00":"free",
        "13:00":"free",
        "14:00":"free",
        "15:00":"free",
        "16:00":"free",
        "17:00":"free",
        "18:00":"free",
        "19:00":"free",
        "20:00":"free",
        "21:00":"free",
        "22:00":"free",
        "23:00":"leetcode"
    }
    Axios.post("http://localhost:5555/api/v1/meeting/fullday",requestObject)
    .then(res => {
        console.log(res)
    }).catch(err => {
        console.log(err)
    })
}
//Create the new calendar slots in the database every 6 months