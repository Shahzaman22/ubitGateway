const express = require('express')
const app = express()
app.use(express.json())
require('dotenv').config()
const port = process.env.PORT || 3000


//DB
require('./Apps/config/db')

//ROUTES
app.use('/api', require('./Apps/routes/app.routes'))

//PORT
app.listen(port, console.log(`Connecte to port ${port}`))