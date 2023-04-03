const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const GOOGLE_CLIENT_ID = "384461296523-588h3ie4buit1tvi0tjsdab90puftiop.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET = "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"

passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/api/auth/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    return done(null , profile)
  }
));

passport.serializeUser(function(user,done){
  done(null,user)
})

passport.deserializeUser(function(user,done){
  done(null,user)
})