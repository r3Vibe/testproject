const joi = require("joi");

const register = joi.object({
  name: joi.string().required(),
  email: joi.string().required().email(),
  password: joi.string().required().min(8),
  role: joi.string().required(),
});

const login = joi.object({
  email: joi.string().required().email(),
  password: joi.string().required().min(8),
});

const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const remove = joi.object({
  id: joi.string().required().custom(objectId),
});

module.exports = {
  register,
  login,
  remove
};
