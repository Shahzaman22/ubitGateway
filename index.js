const express = require('express')
const app = express()
const cors = require('cors')
app.use(express.json())
require('dotenv').config()
const session = require('express-session');
const path = require('path')
const port = process.env.PORT || 4000
const passport = require('passport')

//Session
app.use(session({
  secret: process.env.PRIVATE_KEY,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

//CORS
app.use(
  cors({
    origin: true,
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "PATCH"],
  })
);

//Img Uploader
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


//DB
require('./Apps/config/db')

//ROUTES
app.use('/api', require('./Apps/routes/app.routes'))

//PORT
app.listen(port, console.log(`Connecte to port ${port}`))