const {Schema, model} = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
    firstName:{
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100
    },
    middleName: {
        type: String,
        required: false,
        minlength: 2,
        maxlength: 100
    },
    lastName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    contactNumber: {
        type: String,                    //type string on purpose
        required: true,
        length: 10
    },
    isAdmin: {
        type: Boolean,
        required: true
    }
});

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({
        _id: this._id, 
        firstName: this.firstName,
        middleName: this.middleName,
        lastName: this.lastName,
        email: this.email,
        contactNumber: this.contactNumber,
        isAdmin: this.isAdmin
    }, 
    process.env.SECRET_KEY);

    return token;
}

const User = model('User', userSchema);

module.exports = User;