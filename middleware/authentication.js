const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError} = require('../errors');

const auth = (req, res, next) => {

    const authHeader = req.headers.authorization;
    
    if(!authHeader || !authHeader.startsWith("Bearer ")){
      
   throw new UnauthenticatedError("Authentication invalid");
    }
     
    const token = authHeader.split(" ")[1];

    try{
       const payload = jwt.verify(token, process.env.JWT_SECRET);

       /// attach user job routes
       req.user = {userId: payload.userId, name: payload.name}
      next()
    }catch(err){
    throw new UnauthentiactedError("No Access or Authentication invalid")
    }
}

module.exports = auth