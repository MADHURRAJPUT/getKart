const Joi = require('joi');

function validateUser(user){
    const userValidatorSchema = Joi.object.keys({
        firstName: Joi.string().min(3).max(100).required(),
        middleName: Joi.string().min(3).max(100),
        lastName: Joi.string().min(3).max(100).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(1024).required().alphanum(),
        contactNumber: Joi.string().length(10).required(),
        isAdmin: Joi.boolean().required()
    });
    return userValidatorSchema.validate(user);
}


module.exports = validateUser;