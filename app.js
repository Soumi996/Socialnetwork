const express = require('express')
const app = express()
const mongoose = require("mongoose")
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressValidator = require('express-validator')
const morgan = require('morgan')
const dotenv = require('dotenv')
const cors = require('cors')
const fs = require('fs')


// BodyParser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())

// Configured the dotenv
dotenv.config()

// Connecting to database
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true
  })
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

// Routes
const postRoutes = require('./routes/post')
const userRoutes = require('./routes/user')

// Docs of All Routes
app.get('/',(req, res) => {
  fs.readFile('docs/apiDocs.json', (err, data) => {
    if(err){
      return res.status(400).json({
        message: "Error Happend"
      });
    }
    const docs = JSON.parse(data)
    return res.status(200).json({
      All_Routes: docs
    });
  })
})

// middleware Stuff
app.use(expressValidator())
app.use(cors())
app.use(morgan('dev'))
app.use(cookieParser());
app.use('/', postRoutes)
app.use('/', userRoutes)


// Server Listening
app.listen(process.env.PORT || 8080,() => {
    console.log('Listening at Port 3000')
})