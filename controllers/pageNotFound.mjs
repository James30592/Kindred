import express from "express";



export const pageNotFoundRouter = express.Router();

pageNotFoundRouter.use(function(req, res) {
  res.status(404);
  res.render("pages/pageNotFound");
});