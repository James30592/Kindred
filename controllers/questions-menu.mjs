import express from "express";
import { CategoryType } from "../models/categoryType.mjs";


export const questionsMenuRouter = express.Router();

questionsMenuRouter.get("/", async function(req, res){
  const allCategoryTypes = await CategoryType.find().exec();

  res.locals.allCategoryTypes = allCategoryTypes;
  res.render("questions-menu");
});