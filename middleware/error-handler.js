// const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  
const customError = {
  // set default
  statusCode : err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  msg: err.message || "Something went wrong please try again later",
}
 

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }
  if(err.code && err.code === 11000){
     customError.msg = `dublicate value for ${Object.keys(err.keyValue)} field, please choose another value.`;
   customError.statusCode = 400;  // this is our new setup we don't need to setup any more like custome api error
  }
//// cast error
  if(err.name === 'CastError'){
    customError.msg =`No item find with id : ${err.value}`;
    customError.statusCode =404;
  }


  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err})
  return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware
