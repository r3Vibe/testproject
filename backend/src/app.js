const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongosanitize = require("express-mongo-sanitize");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");
const projectRoute = require("./routes/index");
const path = require("path")

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(compression())
app.use(xss())
app.use(mongosanitize())
app.use(morgan('dev'))


app.use("/images",express.static("src/uploads"))

app.use("/api",projectRoute)



app.use((req,res,next)=>{
    const err = new Error()
    err.status = 404
    err.message = "Are You Lost?"
    next(err)
})

app.use((err,req,res,next)=>{
    res.status(err.status || 500).send({
        message:err.message
    })
    // res.send(err)
})


module.exports = app