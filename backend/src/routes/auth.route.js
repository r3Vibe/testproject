const express = require("express");
const upload = require("../helper/multersave");
const router = express.Router();
const { register, login, remove } = require("../validations/validation");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

router.post("/register", upload.single("image"), async (req, res, next) => {
  // console.log(req.file)
  try {
    const valid = await register.validateAsync(req.body);
    // console.log(valid)
    if (valid) {
      const doesExist = await User.findOne({ email: valid.email });
      //    console.log(doesExist)
      if (doesExist) {
        const err = new Error();
        err.status = 409;
        err.message = "Email Exists";
        next(err);
      }
      const user = new User({
        email: valid.email,
        name: valid.name,
        password: valid.password,
        role: valid.role,
        image: req.file.filename,
      });

      const saveUser = await user.save();

      //    console.log(saveUser)

      const id = saveUser.id;

      jwt.sign({ id }, config.jwt, { expiresIn: "1h" }, (err, tkn) => {
        if (err) {
          next(err);
        }

        res.send(tkn);
      });
    }
  } catch (error) {
    if (error._original) {
      const err = new Error();
      err.status = 422;
      err.message = error.details[0].message;
      next(err);
      // next(error)
    } else {
      next(error);
    }
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const valid = await login.validateAsync(req.body);
    if (valid) {
      const user = await User.findOne({ email: valid.email });
      if (user && (await user.isPwdMatch(valid.password))) {
        const id = user.id;
        jwt.sign({ id }, config.jwt, { expiresIn: "1h" }, (err, tkn) => {
          if (err) {
            next(err);
          }
          res.send(tkn);
        });
      } else {
        const err = new Error();
        err.status = 404;
        err.message = "User Or Password Mismatch";
        next(err);
      }
    }
  } catch (error) {
    next(error);
  }
});

router.get("/info", async (req, res, next) => {
  try {
    let token;

    if (!req.headers["authorization"]) {
      err = new Error();
      err.status = 402;
      err.message = "Unauthorized";
      next(err);
    } else {
      token = req.headers["authorization"].split(" ")[1];
    }

    if (token) {
      jwt.verify(token, config.jwt, async (err, tkn) => {
        if (err) {
          next(err);
        }
        const user = await User.findById(tkn.id);
        if (user) {
          res.send(user);
        } else {
          err = new Error();
          err.status = 500;
          err.message = "Something Went Wrong";
          next(err);
        }
      });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/update", (req, res, next) => {
  res.send("update endpoint");
});

router.delete("/remove", async (req, res, next) => {
  try {
    const validate = await remove.validateAsync(req.body);
    if (validate) {
      let token;

      if (!req.headers["authorization"]) {
        err = new Error();
        err.status = 402;
        err.message = "Unauthorized";
        next(err);
      } else {
        token = req.headers["authorization"].split(" ")[1];
      }

      if (token) {
        jwt.verify(token, config.jwt, async (err, tkn) => {
          if (err) {
            next(err);
          }
          const user = await User.findById(tkn.id);
          if (user) {
            if (user.role === "admin") {
              User.findByIdAndRemove(validate.id)
                .then((resp) => {
                    if(resp){
                        res.send({
                            status:"success"
                        })
                    }else{
                        const err = new Error()
                        err.status = 404
                        err.message = "id not found"
                        next(err)
                    }
                })
                .catch((err) => {
                    console.log(err)
                  next(err);
                });
            } else {
              const err = new Error();
              err.status = 402;
              err.message = "You Dont Have Permission For This";
              next(err);
            }
          } else {
            err = new Error();
            err.status = 500;
            err.message = "Something Went Wrong";
            next(err);
          }
        });
      }
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
