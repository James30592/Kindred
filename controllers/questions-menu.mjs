import express from "express";
import { serverState } from "../lib/serverState/serverState.mjs";



export const questionsMenuRouter = express.Router();

questionsMenuRouter.get("/", async function(req, res) {
  const allCategoryTypes = serverState.allCategories;

  res.locals.allCategoryTypes = allCategoryTypes;
  res.render("pages/questions-menu");
});