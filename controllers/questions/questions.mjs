import express from "express";
import { serverState } from "../../lib/serverState/serverState.mjs"
import { createNewQuestions } from '../../lib/questions/createNewQuestions.mjs';
import * as dbHelpers from "../../lib/dbHelpers.mjs"
import { userAnswersRouter } from "./userAnswers.mjs";



export const questionsRouter = express.Router();
questionsRouter.use("/user-answers", userAnswersRouter);

questionsRouter.all("/:categoryType/:category", async function(req, res) {
  const categoryTypeName = req.params.categoryType;
  const categoryName = req.params.category;

  const currAnswerer = await serverState.currAnswerers.getCurrAnswerer(
    req.user._id, categoryTypeName, categoryName);

  if (req.method === "GET") {
    res.render("questions", {
      categoryTypeName: categoryTypeName,
      categoryName: categoryName
    });
  }

  else if (req.method === "POST") {
    const postObj = req.body;

    // Update the database for this user with their new answers.
    if (postObj.type === "answers") {

      // Add the new answers to the User's answersList DB entry and update any 
      // updated answers.
      currAnswerer.answersList.updateOrAddAnswers(postObj.data);
      await currAnswerer.answersList.item.save();
      currAnswerer.updateLastActionTime();
      res.end();
    }

    // Get new questions for the questions queue.
    else if (postObj.type = "updateQueue") {
      const userAnswers = currAnswerer.answersList.item.answers;

      const newQs = createNewQuestions(categoryTypeName, categoryName, 
        userAnswers, postObj.data);

      await newQs.getQuestions();

      res.json({results: newQs.results, endOfQSource: newQs.endOfQSource});
    };
  };
});


// Used when submitting answers for multiple categories, such as on the 
// recommendations page.
questionsRouter.post("/mixed-categories", async function(req, res) {
  const categoriesAnswers = req.body.data;

  const allAnswersListsPromises = [];

  // Save answers for each different category.
  for (let categoryAnswers of categoriesAnswers) {
    allAnswersListsPromises.push(updateDBAnswersList(categoryAnswers, 
      req.user._id));
  };
  
  // Once all answers lists are saved for each category, respond.
  Promise.all(allAnswersListsPromises).then(() => res.end());

  // Finds / creates a user's answers list for a specific category and updates 
  // with their new answers for this category. Returns a promise for when the 
  // answers list is finished saving.
  async function updateDBAnswersList(categoryAnswers, userId) {
    // Find the relevant answers list in the DB
    const dbAnsList = new dbHelpers.CategoryAnswersList();
    await dbAnsList.initAndCreateIfNeeded(categoryAnswers.catType, 
      categoryAnswers.cat, userId);
  
    // Update the answers for this category and save.
    dbAnsList.updateOrAddAnswers(categoryAnswers.answers);
    return dbAnsList.item.save();
  }
});