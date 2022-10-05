import express from "express";
import { getLocObj } from "../register.mjs";
import { authGoogleRouter } from "./strategies/google.mjs";
import { User } from "../../models/user.mjs";



export const authRouter = express.Router();

authRouter.use("/google", authGoogleRouter);

authRouter.get("/completeAccount", function(req, res) {
  res.render("pages/completeOAuthAcct");
});

authRouter.post("/completeAccount", async function(req, res) {
  const user = await User.findOne({_id: req.user.id}).exec();

  user.profileName = req.body["profile-name"];
  user.location = getLocObj(req.body);
  user.setupComplete = true;
  await user.save();

  res.redirect("/profile");
});