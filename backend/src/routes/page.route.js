const express = require("express");

const router = express.Router()


router.post("/update",(req,res,next)=>{
    res.send("update page endpoint")
})


router.get("/info",(req,res,next)=>{
    res.send("info page endpoint")
})

module.exports = router