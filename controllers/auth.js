const User = require('../models/User');
const {StatusCodes} = require('http-status-codes')
const {BadRequestError,UnauthenticatedError} = require('../errors')

const jwt = require('jsonwebtoken')

const register = async (req,res) =>{

//     const {name, email, password} = req.body;
//   if(!name || !email || !password){
//      throw new BadRequestError("please provide name, email and password....")
//   }                  // we don't need because anything we are declared in models

//   const salt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash(password,salt);

//   const tempUser = { name, email, password:hashedPassword}  
//    //// name:name email:email,password:hashedPassword are same in es6


    const user = await User.create({ ...req.body }) ;

    // const token = jwt.sign({ userId: user._id, name: user.name},"jwtsecret",{
    //     expiresIn:'30d',
    // })
                    const token = user.createJwt();
    res.status(StatusCodes.CREATED).json({  user:{ name : user.name},token })
}

const login = async (req,res) =>{     

    const {email, password} = req.body     
    if(!email || !password){
        throw new BadRequestError("please provide the email and password")
    }
  //// find and compare email from database with user email
    const user = await User.findOne({email})
    if(!user){
        throw new UnauthenticatedError("Invalid Credentials")
    }
    
    /// compare password
const isPasswordCorrect = await user.comparePassword(password);
if(!isPasswordCorrect){
    throw new UnauthenticatedError("Invalid Credentials")
}

  const token = user.createJwt()
  res.status(StatusCodes.OK).json({user:{name: user.name},token})

}

module.exports ={
    register,
    login,
}