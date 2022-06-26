const express = require("express");
const upload = require("../helper/multersave");
const router = express.Router();
const validator = require("../validations/validation");
const User = require("../models/user")
const jwt = require("jsonwebtoken")
const config = require("../config/config")


router.post("/register",upload.single("image"),async(req,res,next)=>{
    // console.log(req.file)
    try {
        const valid = await validator.register.validateAsync(req.body)
        // console.log(valid)
        if(valid){
           const doesExist = await User.findOne({email:valid.email})
        //    console.log(doesExist)
           if(doesExist) {
            const err = new Error()
            err.status = 409
            err.message = "Email Exists"
            next(err)
           }
           const user = new User({
            email:valid.email,
            name:valid.name,
            password:valid.password,
            role:valid.role,
            image:req.file.filename
           })

           const saveUser = await user.save()

        //    console.log(saveUser)

           const id = saveUser.id

           jwt.sign({id},config.jwt,{expiresIn:"1h"},(err,tkn)=>{
            if(err){
                next(err)
            }

            res.send(tkn)

           })

        }
    } catch (error) {
        if(error._original){
            const err = new Error()
            err.status = 422
            err.message = error.details[0].message
            next(err);
            // next(error)
        }else{
            next(error)
        }
    }
})


router.post("/login",(req,res,next)=>{
    try {
        res.send("login endpoint")
    } catch (error) {
        if(error._defaut)
    }
})

router.get("/info",(req,res,next)=>{
    res.send("info endpoint")
})


router.post("/update",(req,res,next)=>{
    res.send("update endpoint")
})

router.delete("/remove",(req,res,next)=>{
    res.send("remove endpoint")
})


module.exports = router