const express = require('express');
const cors = require("cors")
const helmet = require("helmet")
const dateRouter = require("./Routers/dateRouter.js")
const meetingRouter = require("./Routers/meetingRouter.js")
//=========Setting up the server========
const server = express();
const PORT = process.env.PORT || 5555;
server.listen(PORT, () => {
    console.log(`=======...Server is running on ${PORT}...========`)
})


//=========== Middleware and routers ======
server.use(cors(),helmet(),express.json())
server.use("/api/v1/date",dateRouter)
server.use("/api/v1/meeting",meetingRouter)

//===========Server UP endpoint========================//
server.get("/",(req,res) => {
    res.json({is_server_up:"true"})
})