import express from "express";
import { serverState } from "../lib/serverState/serverState.mjs"



export const logoutRouter = express.Router();

logoutRouter.get("/", function(req, res) {
  logoutUser(req);
  res.redirect("/");
});

function logoutUser(req) {
  serverState.currAnswerers.removeUser(req.user._id);
  req.logout();
}

// Used when logging out and as middleware prior to logging in / registering a 
// new user (when a user is already logged in).
export function logoutIfAlreadyLoggedIn(req, res, next) {
  const userAlreadyLoggedIn = req.user;
  if (userAlreadyLoggedIn) logoutUser(req);
  next();
}