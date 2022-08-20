import express from "express";
import * as models from "../models/models.mjs";
import * as similarity from "../lib/similarity.mjs";
import { CategoryInfo } from "../public/sharedJs/categoryInfo.mjs";



export const findKindredRouter = express.Router();

findKindredRouter.get("/", async function(req, res) {
  const allCategoryTypes = await models.CategoryType.find({}).exec();
  const userCategoryAnswers = await models.CategoryAnswersList.find(
    {userId: req.user._id}).exec();

  const selectableCategories = similarity.getSelectableUserCategories(
    userCategoryAnswers);

  res.render("find-kindred", {
    allCategoryTypes: allCategoryTypes,
    selectableCategories: selectableCategories
  });
});

findKindredRouter.post("/", async function(req, res){
  const categoryInfo = new CategoryInfo(req.body);

  const thisKindredList = new similarity.KindredList(req.user, 10);
  await thisKindredList.initKindredList(categoryInfo);
  thisKindredList.findKindred();

  res.json(thisKindredList);
});