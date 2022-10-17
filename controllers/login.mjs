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

  function (req, res, next) {
    passport.authenticate("local", function(err, user, info) {
      if (!user) {
        res.json({status: "fail", errDetails: "err"});
      }
      else {
        req.logIn(user, function() {
          res.json({status: "success", redirectTo: "/profile"})
        });
      };
    })(req, res, next)
  }
);