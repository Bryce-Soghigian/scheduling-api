const axios = require('axios');

let results = []
let freeTimes = []

axios.get(`http://localhost:5555/api/v1/meeting/range/10202020/10232020`).then(data => {
    console.log(data)
     results.push(data)
     for(let i =0;i< results.length;i++){
        let currentObject = results[i]
        //Go through each object and push the date and the free times into a new object
        let filteredData = {}
        for(let key in currentObject){
            if(key === "currentDate"){
                filteredData[key] = currentObject[key]
            }else if(currentObject[key] === "free"){
                filteredData[key] = currentObject[key]
            }
        }
        freeTimes.push(filteredData)
     }
}).catch(err => {
    console.log(err)
})

console.log(freeTimes,"outside")