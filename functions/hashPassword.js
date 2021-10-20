const bcrypt = require('bcrypt');
// const { func } = require('joi');
// const { reject } = require('lodash');

hashedPassword =  async function(password){
    
        const salt = await bcrypt.genSalt(6);
        const hashed = await bcrypt.hash(password, salt);
        
        return hashed;
}   

module.exports = hashedPassword;