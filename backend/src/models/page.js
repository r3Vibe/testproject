const mongoose = require("mongoose");
const bcrypt = require("bcrypt")


const pageSchema = new mongoose.Schema(
  {
    tagline: {
      type: String,
      required: true,
    },
    landimage: {
      type: String,
      required: true,
    },
    description:{
        type:String,
        required:true,
    },
    options:{
        type:String,
        required:true,
    }
  },
  { timestamps: true }
);



module.exports = mongoose.model("page",pageSchema);