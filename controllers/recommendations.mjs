import express from "express";
import * as models from "../models/models.mjs";
import * as similarity from "../lib/similarity.mjs";
import { CategoryInfo } from "../public/sharedJs/categoryInfo.mjs";
import * as recommendations from "../lib/recommendations.mjs";



export const recommendationsRouter = express.Router();

recommendationsRouter.get("/", async function(req, res){
  const allCategoryTypes = await models.CategoryType.find({}).exec();
  const userCategoryAnswers = await models.CategoryAnswersList.find(
    {userId: req.user._id}).exec();

  const selectableCategories = similarity.getSelectableUserCategories(
    userCategoryAnswers);

  res.render("recommendations", {
    allCategoryTypes: allCategoryTypes,
    selectableCategories: selectableCategories
  });
});

recommendationsRouter.post("/", async function(req, res){
  const allCategoryInfo = req.body;
  const resultCategoryInfo = new CategoryInfo(allCategoryInfo.recommendationsFor);
  const basedOnCategoryInfo = new CategoryInfo(allCategoryInfo.basedOn);

  const thisRecommendationList = new recommendations.RecommendationList(req.user);
  await thisRecommendationList.initRecommendationList(basedOnCategoryInfo,
    resultCategoryInfo);

  thisRecommendationList.getRecommendations();

  res.json(thisRecommendationList);
});