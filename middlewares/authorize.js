const jwt = require('jsonwebtoken');

function auth(req,res,next){
    const token = req.header('x-auth-token');
    if(!token){
        return res.status(401).send({message: 'Access Denied'});
    }
    try{
        const decoded = jwt.verify(token,'make-a-key');
        req.user = decoded;
        next();
    }
    catch(err){
        res.status(403).send({message: 'forbidden'});
    }
}

module.exports = auth;