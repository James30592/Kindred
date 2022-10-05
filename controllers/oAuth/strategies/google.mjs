import express from "express";
import passport from "passport";



export const authGoogleRouter = express.Router();

authGoogleRouter.get("/", passport.authenticate("google", {scope: ["profile"]}));
 
authGoogleRouter.get('/profile', 
  passport.authenticate('google', {failureRedirect: '/login'}),
  function(req, res) {
    // Successful authentication, redirect to profile page.
    res.redirect('/profile');
  }
);