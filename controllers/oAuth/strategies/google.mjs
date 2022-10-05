import express from "express";
import passport from "passport";

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
// import findOrCreate from "mongoose-findorcreate";
const findOrCreate = require("mongoose-findorcreate");
const GoogleStrategy = require("passport-google-oauth20").Strategy;



passport.use(new GoogleStrategy({
  // clientID: process.env.GOOGLE_CLIENT_ID,
  clientID: "498005023679-7g2s38q27a68t9ginavnrudcva5pmpgq.apps.googleusercontent.com",
  clientSecret: "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",
  callbackURL: "http://localhost:3000/auth/google/profile"
},
function(accessToken, refreshToken, profile, cb) {
  console.log("here");
  User.findOrCreate({ googleId: profile.id }, function (err, user) {
    console.log("in here now");
    return cb(err, user);
  });
}
));




export const authGoogleRouter = express.Router();

authGoogleRouter.get("/", function(req, res) {
  console.log("got here1");
  passport.authenticate('google', { scope: ['profile'] })
});
 
authGoogleRouter.get('/profile', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    console.log("got here2");
    // Successful authentication, redirect to profile page.
    res.redirect('/profile');
  }
);