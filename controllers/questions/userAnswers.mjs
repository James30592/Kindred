import express from "express";
import { serverState } from "../../lib/serverState/serverState.mjs"



export const userAnswersRouter = express.Router();

// Used by the questions page when user gets their previous answers for a category.
userAnswersRouter.get("/:categoryType/:category", async function(req, res) {
  const categoryTypeName = req.params.categoryType;
  const categoryName = req.params.category;

  const currAnswerer = await serverState.currAnswerers.getCurrAnswerer(
    req.user._id, categoryTypeName, categoryName);

  const currAnswers = currAnswerer.answersList.item.answers;

  res.json(currAnswers);
});