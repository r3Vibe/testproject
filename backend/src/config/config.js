const dotenv = require("dotenv")
const path = require("path")


dotenv.config(path.resolve(__dirname,"../../.env"))


module.exports = {
    port:process.env.PORT,
    db:{
        url:process.env.URL+process.env.DB_NAME
    },
    jwt:process.env.JWT
}