import express from "express";
import { CategoryAnswersList } from "../models/categoryAnswersList.mjs";
import { CategoryInfo } from "../public/sharedJs/categoryInfo.mjs";
import { RecommendationList } from "../lib/similarity/recommendationList/recommendationList.mjs";
import { getSelectableUserCategories } from "../lib/similarity/getSelectableUserCategories.mjs";
import { serverState } from "../lib/serverState/serverState.mjs";



export const recommendationsRouter = express.Router();

recommendationsRouter.get("/", async function(req, res){
  const allCategoryTypes = serverState.allCategories;
  const userCategoryAnswers = await CategoryAnswersList.find(
    {userId: req.user._id}).exec();

  const selectableCategories = getSelectableUserCategories(
    userCategoryAnswers);

  res.locals.allCategoryTypes = allCategoryTypes;
  res.locals.selectableCategories = selectableCategories;

  res.render("pages/recommendations");
});

recommendationsRouter.post("/", async function(req, res){
  const allCategoryInfo = req.body;
  const resultCategoryInfo = new CategoryInfo(allCategoryInfo.recommendationsFor);
  const basedOnCategoryInfo = new CategoryInfo(allCategoryInfo.basedOn);

  const thisRecommendationList = new RecommendationList(req.user);
  await thisRecommendationList.initRecommendationList(basedOnCategoryInfo,
    resultCategoryInfo);

  thisRecommendationList.getRecommendations();

  const recommendsInfo = {
    recommendList: thisRecommendationList.recommendList,
    numKindred: thisRecommendationList.simRatingList.length
  };
  
  res.json(recommendsInfo);
});