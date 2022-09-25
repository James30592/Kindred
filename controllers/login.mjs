import express from "express";
import passport from "passport";



export const loginRouter = express.Router();

loginRouter.get("/", function(req, res) {
  res.render("pages/login");
});

loginRouter.post('/',
  passport.authenticate('local', {failureRedirect: '/login', failureMessage: true}),
  function(req, res) {
    res.redirect("/profile");
  }
);