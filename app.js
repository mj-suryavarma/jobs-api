require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

/// extra security packages
const helmet = require('helmet');
const cros = require('cros')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')


/// db
const connectDB = require('./db/connect')


// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

//routers
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')

//auth middleware
const authenticationMiddleware = require('./middleware/authentication');

app.use(express.json());
// extra packages


// routes
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/jobs',authenticationMiddleware,jobsRouter);

app.get('/',(req,res) =>{
  res.send(`<h2>Hello Welcome to all </h2>
             <h4>Jobs Api</h4> `)
})

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


app.use(rateLimiter({
  windowMs : 15 * 60 *1000 , /// 15 minutes
  max: 100,   /// limit each ip to 100 request per windowMs
}))
app.use(express.json())
app.use(helmet())
app.use(cros())
app.use(xss())

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
