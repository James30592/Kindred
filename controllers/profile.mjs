import express from "express";



export const profileRouter = express.Router();

profileRouter.get("/", function(req, res) {
  res.render("profile");
});