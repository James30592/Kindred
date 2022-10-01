import express from "express";



export const profileRouter = express.Router();

profileRouter.get("/", function(req, res) {
  const renderPage = req.user.isAdmin ? "pages/adminProfile" : "pages/profile";
  res.render(renderPage);
});