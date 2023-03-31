const express = require('express')
const app = express()
const cors = require('cors')
app.use(express.json())
require('dotenv').config()
const session = require('express-session');
const path = require('path')
const port = process.env.PORT || 4000

//-----------------------
// const passport =  require('passport')
// const googleStrategy = require('passport-google-oauth20')
// passport.use(new googleStrategy({
//     clientID : "384461296523-oojqs6gkg0ig0s2p44t99mgbeqjjdtvg.apps.googleusercontent.com",
//     clientSecret : "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",
//     callbackURL : "/auth/google/callback"
// },(accessToken, refreshToken, profile, done) => {
//     console.log("Access Token", accessToken);
//     console.log("Refresh Token", refreshToken);
//     console.log("PROFILE", profile);
//     if (!refreshToken) {
//       console.log('No refresh token granted');
//     }
// }))

// app.get('/auth/google',passport.authenticate("google",{
//     scope : ["profile","email"]
// }))

// app.get('/auth/google/callback',passport.authenticate("google"))
//---------------------------

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

//Img Uploader
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


//DB
require('./Apps/config/db')

//ROUTES
app.use('/api', require('./Apps/routes/app.routes'))

//PORT
app.listen(port, console.log(`Connecte to port ${port}`))