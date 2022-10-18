import express from "express";
import { getLocObj } from "../register.mjs";
import { User } from "../../models/user.mjs";



export const completeOAuthAcctRouter = express.Router();

completeOAuthAcctRouter.get("/", function(req, res) {
  res.render("pages/completeOAuthAcct");
});

completeOAuthAcctRouter.post("/", async function(req, res) {
  const user = await User.findOne({_id: req.user.id}).exec();

  user.profileName = req.body["profile-name"];
  user.location = getLocObj(req.body);
  user.setupComplete = true;
  await user.save();

  res.redirect("/profile");
});