const express = require('express')
const app = express()
const cors = require('cors')
app.use(express.json())
require('dotenv').config()
const port = process.env.PORT || 4000
const session = require('express-session');

app.use(session({
  secret: process.env.PRIVATE_KEY,
  resave: false,
  saveUninitialized: true
}));

//CORS
app.use(
  cors({
    origin: true,
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "PATCH"],
  })
);

//DB
require('./Apps/config/db')

//ROUTES
app.use('/api', require('./Apps/routes/app.routes'))

//PORT
app.listen(port, console.log(`Connecte to port ${port}`))