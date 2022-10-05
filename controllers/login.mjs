import express from "express";
import passport from "passport";
import { logoutIfAlreadyLoggedIn } from "./logout.mjs";



export const loginRouter = express.Router();

loginRouter.get("/", function(req, res) {
  res.render("pages/login");
});

loginRouter.post('/', 
  function(req, res, next) {
    logoutIfAlreadyLoggedIn(req, res, next);
  },

  passport.authenticate('local', {failureRedirect: '/login', failureMessage: true}),

  function(req, res) {
    res.redirect("/profile");
  }
);