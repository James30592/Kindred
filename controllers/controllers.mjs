import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import * as models from "../models/models.mjs";
import * as questions from "../lib/questions.mjs";
import * as similarity from "../lib/similarity.mjs";
import * as recommendations from "../lib/recommendations.mjs";
import * as admin from "../lib/admin.mjs";
import * as dbHelpers from "../lib/dbHelpers.mjs";
import { currAnswerers } from '../lib/currentAnswerers.mjs';
import { apiRefs } from '../lib/apiRefs.mjs';

const express = require("express");
const ejs = require("ejs");
const passport = require("passport");

export const router = express.Router();

const NO_LOGIN_ROUTES = [
  "/",
  "/login",
  "/register"
];

router.get("*", function(req, res, next){
  if (NO_LOGIN_ROUTES.includes(req.url) || req.isAuthenticated()) {
    return next();
  }
  else {
    res.redirect("/login");
  };
});

router.get("/", function(req, res){
  res.render("home");
});

router.get("/login", function(req, res){
  res.render("login");
});

router.get("/register", function(req, res){
  res.render("register");
});

router.get("/profile", function(req, res){
  res.render("profile", {thisUser: req.user});
});

router.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});



// ---------------------REMOVE---------------------------------------------------
router.get("/questions-menu-old", async function(req, res){
  const allCategoryTypes = await models.CategoryType.find({}).exec();
  res.render("questions-menu-old", {allCategoryTypes: allCategoryTypes});
});

router.all("/questions-old/:categoryType.:category", async function(req, res){
  const categoryTypeName = req.params.categoryType;
  const categoryName = req.params.category;

  // Get this user in the database, to update their answer(s).
  const user = await models.User.findOne({_id: req.user._id}).exec();

  // Get user answers info for this category.
  let userCategoryAnswersInfo = questions.getCategoryAnswersInfo(
    user, categoryTypeName, categoryName);
  // Initialise for current category, if not done previously for this user.
  userCategoryAnswersInfo = questions.initUserCategory(user,
    userCategoryAnswersInfo, categoryTypeName, categoryName);

  let userAnswers = userCategoryAnswersInfo.answers;

  if (req.method === "GET"){
    const questionsRenderInfo = await questions.getQuestionsRenderInfo(
      categoryTypeName, categoryName, userAnswers);

    res.render("questions-old", questionsRenderInfo);
  }

  else if (req.method === "POST"){
    questions.updateUserAnswers(req.body, userAnswers);
    user.save(function(){
      res.redirect("/questions-menu-old");
    });
  };
});
// ------------------------------------------------------------------------------




router.get("/find-kindred", async function(req, res){
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

router.get("/recommendations", async function(req, res){
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

router.get("/admin", async function(req, res){
  res.render("admin");
});



router.post("/admin/:adminRequest", async function(req, res){
  if (req.params.adminRequest === "createAutoUsers") {
    const numNewUsers = req.body.numNewUsers;

    const currDBCategories = await models.CategoryType.find({}).exec();
    const currDBQuestions = await models.CategoryQuestionsList.find({}).exec();
    const batchUserMaker = new admin.BatchUserCreator(currDBCategories, 
      currDBQuestions);

    const resultMsg = batchUserMaker.createUsers(numNewUsers);

    res.json(resultMsg);
  };
});

router.post("/find-kindred", async function(req, res){
  const categoryInfo = req.body;

  const thisKindredList = new similarity.KindredList(req.user, 10);
  await thisKindredList.initKindredList(categoryInfo);
  thisKindredList.findKindred();

  res.json(thisKindredList);
});

router.post("/recommendations", async function(req, res){

  const allCategoryInfo = req.body;
  const resultCategoryInfo = allCategoryInfo.recommendationsFor;
  const basedOnCategoryInfo = allCategoryInfo.basedOn;

  const thisRecommendationList = new recommendations.RecommendationList(req.user);
  await thisRecommendationList.initRecommendationList(basedOnCategoryInfo,
    resultCategoryInfo);

  thisRecommendationList.getRecommendations();

  res.json(thisRecommendationList);
});

router.post("/register", function(req, res){
  models.User.register(
    {
      email: req.body.email,
      profileName: req.body.profileName,
      location: req.body.location
    },

    req.body.password,

    function(err, user){
      if (err) {
        console.log(err);
        res.redirect("/register");
      }
      else {
        passport.authenticate("local")(req, res, function(){
          res.redirect("/profile");
        });
      };
    }
  );
});

router.post('/login',
  passport.authenticate('local', {failureRedirect: '/login', failureMessage: true}),
  function(req, res) {
    res.redirect("/profile");
  }
);





router.get("/questions-menu", async function(req, res) {
  const allCategoryTypes = await models.CategoryType.find({}).exec();
  res.render("questions-menu", {allCategoryTypes: allCategoryTypes});
});





router.all("/questions/:categoryType/:category", async function(req, res) {
  const categoryTypeName = req.params.categoryType;
  const categoryName = req.params.category;

  const currAnswerer = await currAnswerers.getCurrAnswerer(req.user._id, 
    categoryTypeName, categoryName);

  const userAnswers = currAnswerer.users[req.user._id].answers;


  if (req.method === "GET") {
      res.render("questions", {
      categoryTypeName: categoryTypeName,
      categoryName: categoryName,
      userAnswers: userAnswers
    });
  }


  else if (req.method === "POST") {
    const postObj = req.body;

    // Update the database for this user with their new answer.
    if (postObj.type === "answer") {
      const newAnswer = postObj.data;

      // add this new answer to the questions answer in db...

      console.log("saving user answer");
      res.end();

      // questions.updateUserAnswers(req.body, userAnswers);
      // user.save(function() {
      //   res.redirect("/questions-menu");
      // });
    }

    // Get new questions for the questions queue.
    else if (postObj.type = "filters") {
      const numQs = postObj.data.numQs;
      const filters = postObj.data.filters;

      const newQs = new NewQuestions(categoryTypeName, categoryName);
      newQs.getQuestions(numQs, filters, userAnswers);

      res.json(newQs);
    };
  };
});





// For NewQuestions object, used to check and create list of next available (not 
// already answered by the user) questions for a given category, from either API or DB.
class NewQuestions {
  categoryTypeName;
  categoryName;
  results = [];

  constructor(catTypeName, catName) {
    this.categoryTypeName = catTypeName;
    this.categoryName = catName;
  }

  // query either DB or api and get first numQs number of questions that are unanswered...
  async getQuestions(numQs, filters, userAnswers) {
    const categoryQsList = new dbHelpers.CategoryQuestionsList();
    await categoryQsList.init(this.categoryTypeName, this.categoryName);
    
    // Check if questions for this category come from API or DB.
    if (categoryQsList.item.isSourceAPI) {
      // Source of questions is an API, get the API info from DB.
      const sourceAPIDetails = categoryQsList.item.apiInfo;
      const apiRefItem = apiRefs[sourceAPIDetails._id];
  
      let pageNum = 1;
  
      while (this.results.length < numQs) {
        const pageResults = await NewQuestions.#fetchPage(apiRefItem.key + 
          apiRefItem.path + apiRefItem.pageAppend + pageNum)

        this.#testIfAnswered(pageResults, apiRefItem.idField, userAnswers, numQs);
        pageNum++;
      };
    }
  
    else {
      // Source of questions is DB, retrieve them.
      this.#testIfAnswered(categoryQsList.item.questions, "_id", userAnswers, numQs);
    }
    
    return this.results;
  }

  // Fetches a page worth of results from an API.
  static async #fetchPage(path) {
    const fetchResponse = await fetch(path);
    const fetchResultsPage = await fetchResponse.json();
    let results;

    switch(true) {
      case (categoryTypeName === "Interests" && categoryName === "Films") :
        results = fetchResultsPage.results;
        break;

      default:
        results = fetchResultsPage
    };

    return results;
  }

  // Tests an array of potential new questions and if not already answered by 
  // the user.
  #testIfAnswered(potentialNewQs, idFieldName, userAnswers, numQs) {
    for (let potentialNewQ of potentialNewQs) {
      if (this.results.length >= numQs) break;

      if (!(potentialNewQ[idFieldName] in userAnswers)) {
        const newQObj = NewQuestions.#getNewQObj(potentialNewQ, 
          this.categoryTypeName, this.categoryName);

        this.results.push(newQObj);
      };
    };
  }

  // Creates question object, individualised for each category as necessary.
  static #getNewQObj(newQ, catTypeName, catName) {
    const newQObj = null;

    switch(true) {

      case (catTypeName === "Interests" && catName === "Films") :
        newQObj = {
          _id: newQ.id,
          title: newQ.title,
          releaseDate: newQ.release_ate,
          posterPath: newQ.poster_path,
        };
        break;

      default:
        newQObj = newQ;
    };
    
    return newQObj;
  }
}