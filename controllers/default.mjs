import express from "express";



export const defaultRouter = express.Router();

const NO_LOGIN_ROUTES = [
  "/",
  "/login",
  "/register"
];

defaultRouter.get("*", function(req, res, next) {
  if (NO_LOGIN_ROUTES.includes(req.originalUrl) || req.isAuthenticated()) {
    return next();
  }
  else {
    res.redirect("/login");
  };
});