const express = require('express')
const app = express()
app.use(express.json())
require('dotenv').config()
const port = process.env.PORT || 3000
const session = require('express-session');

app.use(session({
  secret: process.env.PRIVATE_KEY,
  resave: false,
  saveUninitialized: true
}));


//DB
require('./Apps/config/db')

//ROUTES
app.use('/api', require('./Apps/routes/app.routes'))

//PORT
app.listen(port, console.log(`Connecte to port ${port}`))