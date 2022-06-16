import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import * as models from "../models/models.mjs";
import * as questions from "../lib/questions.mjs";
import * as similarity from "../lib/similarity.mjs";
import * as recommendations from "../lib/recommendations.mjs";
import * as admin from "../lib/admin.mjs";

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

router.get("/find-kindred", async function(req, res){
  const allCategoryTypes = await models.CategoryType.find({}).exec();
  const selectableCategories = similarity.getSelectableUserCategories(req.user);

  res.render("find-kindred", {
    allCategoryTypes: allCategoryTypes,
    selectableCategories: selectableCategories
  });
});

router.get("/admin", async function(req, res){
  res.render("admin");
});

router.get("/recommendations", async function(req, res){
  const allCategoryTypes = await models.CategoryType.find({}).exec();
  const selectableCategories = similarity.getSelectableUserCategories(req.user);

  res.render("recommendations", {
    allCategoryTypes: allCategoryTypes,
    selectableCategories: selectableCategories
  });
});



router.post("/admin/:adminRequest", async function(req, res){
  if (req.params.adminRequest === "createAutoUsers") {
    const numNewUsers = req.body.numNewUsers;

    const currDBCategories = await models.CategoryType.find().exec();
    const batchUserMaker = new admin.BatchUserCreator(currDBCategories);
    const resultMsg = batchUserMaker.createUsers(numNewUsers);

    res.json(resultMsg);
  };
});

router.post("/find-kindred", async function(req, res){

  const categoryInfo = req.body;
  const allUsers = await models.User.find({}).exec();

  const thisKindredList = new similarity.KindredList(categoryInfo, 10);
  thisKindredList.findKindred(req.user, allUsers);

  res.json(thisKindredList);
});

router.post("/recommendations", async function(req, res){

  const allCategoryInfo = req.body;
  const resultCategoryInfo = allCategoryInfo.recommendationsFor;
  const basedOnCategoryInfo = allCategoryInfo.basedOn;

  const allUsers = await models.User.find({}).exec();
  const dbCatTypes = await models.CategoryType.find({}).exec();

  const thisRecommendationList = new recommendations.RecommendationList(req.user);

  thisRecommendationList.initRecommendationList(allUsers, basedOnCategoryInfo,
    resultCategoryInfo);
  thisRecommendationList.getRecommendations(dbCatTypes);

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



router.get("/questions-menu", async function(req, res){
  const allCategoryTypes = await models.CategoryType.find({}).exec();
  res.render("questions-menu", {allCategoryTypes: allCategoryTypes});
});

router.all("/questions/:categoryType.:category", async function(req, res){
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

  const userAnswers = userCategoryAnswersInfo.answers;

  if (req.method === "GET"){
    res.render("questions", {
      categoryTypeName: categoryTypeName,
      categoryName: categoryName,
      userAnswers: userAnswers
    });
  }

  else if (req.method === "POST"){



    
    questions.updateUserAnswers(req.body, userAnswers);
    user.save(function(){
      res.redirect("/questions-menu");
    });

  };
});


// TMDB api key - 84c6fe840210161c52e9a52c9cc129bb