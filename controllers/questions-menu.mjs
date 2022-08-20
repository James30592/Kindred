import express from "express";
import * as models from "../models/models.mjs";


export const questionsMenuRouter = express.Router();

questionsMenuRouter.get("/", async function(req, res){
  const allCategoryTypes = await models.CategoryType.find().exec();
  res.render("questions-menu", {allCategoryTypes: allCategoryTypes});
});