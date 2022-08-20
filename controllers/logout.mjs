import express from "express";
import { serverState } from "../lib/serverState/serverState.mjs"



export const logoutRouter = express.Router();

logoutRouter.get("/", function(req, res) {
  serverState.currAnswerers.removeUser(req.user._id);
  req.logout();
  res.redirect("/");
});