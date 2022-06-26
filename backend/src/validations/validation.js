const joi = require("joi");


const register = joi.object({
    name:joi.string().required(),
    email:joi.string().required().email(),
    password:joi.string().required().min(8),
    role:joi.string().required()
})


module.exports = {
    register
}