import express from "express";



export const homeRouter = express.Router();

homeRouter.get("/", function(req, res) {
  res.render("pages/home");
});