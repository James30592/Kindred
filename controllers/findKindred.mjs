import express from "express";
import { CategoryAnswersList } from "../models/categoryAnswersList.mjs";
import { KindredList } from "../lib/similarity/kindredList/kindredList.mjs"
import { CategoryInfo } from "../public/sharedJs/categoryInfo.mjs";
import { getSelectableUserCategories } from "../lib/similarity/getSelectableUserCategories.mjs";
import { serverState } from "../lib/serverState/serverState.mjs";



export const findKindredRouter = express.Router();

findKindredRouter.get("/", async function(req, res, next) {
  throw new Error("broken");



  // const allCategoryTypes = serverState.allCategories;
  // const userCategoryAnswers = await CategoryAnswersList.find(
  //   {userId: req.user._id}).exec();

  // const selectableCategories = getSelectableUserCategories(
  //   userCategoryAnswers);
  
  // res.locals.allCategoryTypes = allCategoryTypes;
  // res.locals.selectableCategories = selectableCategories;

  // res.render("pages/find-kindred");
});

findKindredRouter.post("/", async function(req, res){
  const categoryInfo = new CategoryInfo(req.body);

  const thisKindredList = new KindredList(req.user, 10);
  await thisKindredList.initKindredList(categoryInfo);
  thisKindredList.findKindred();

  res.json(thisKindredList);
});