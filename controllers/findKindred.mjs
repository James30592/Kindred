import express from "express";
import { CategoryType } from "../models/categoryType.mjs";
import { CategoryAnswersList } from "../models/categoryAnswersList.mjs";
import { KindredList } from "../lib/similarity/kindredList/kindredList.mjs"
import { CategoryInfo } from "../public/sharedJs/categoryInfo.mjs";
import { getSelectableUserCategories } from "../lib/similarity/getSelectableUserCategories.mjs";



export const findKindredRouter = express.Router();

findKindredRouter.get("/", async function(req, res) {
  const allCategoryTypes = await CategoryType.find({}).exec();
  const userCategoryAnswers = await CategoryAnswersList.find(
    {userId: req.user._id}).exec();

  const selectableCategories = getSelectableUserCategories(
    userCategoryAnswers);

  res.render("find-kindred", {
    allCategoryTypes: allCategoryTypes,
    selectableCategories: selectableCategories
  });
});

findKindredRouter.post("/", async function(req, res){
  const categoryInfo = new CategoryInfo(req.body);

  const thisKindredList = new KindredList(req.user, 10);
  await thisKindredList.initKindredList(categoryInfo);
  thisKindredList.findKindred();

  res.json(thisKindredList);
});