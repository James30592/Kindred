import express from "express";
import { CategoryAnswersList } from "../models/categoryAnswersList.mjs";
import { KindredList } from "../lib/similarity/kindredList/kindredList.mjs"
import { CategoryInfo } from "../public/sharedJs/categoryInfo.mjs";
import { getBasedOnUserCategories } from "../lib/similarity/getBasedOnUserCategories.mjs";
import { serverState } from "../lib/serverState/serverState.mjs";



export const findKindredRouter = express.Router();

findKindredRouter.get("/", async function(req, res) {
  const allCategoryTypes = serverState.allCategories;
  const userCategoryAnswers = await CategoryAnswersList.find(
    {userId: req.user._id}).exec();

  const selectableBasedOnCategories = getBasedOnUserCategories(userCategoryAnswers);
  
  res.locals.allCategoryTypes = allCategoryTypes;
  res.locals.selectableBasedOn = selectableBasedOnCategories;

  res.render("pages/find-kindred");
});

findKindredRouter.post("/", async function(req, res){
  const categoryInfo = new CategoryInfo(req.body);

  const thisKindredList = new KindredList(req.user, 10);
  await thisKindredList.initKindredList(categoryInfo);
  thisKindredList.findKindred();
  thisKindredList.cleanForSend();

  res.json(thisKindredList.simRatingList);
});