import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import * as models from "../models/models.mjs";
import * as questions from "../lib/questions.mjs";
import * as similarity from "../lib/similarity.mjs";
import * as recommendations from "../lib/recommendations.mjs";
import * as admin from "../lib/admin.mjs";
import { currAnswerers } from '../lib/currentAnswerers.mjs';

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
  currAnswerers.removeUser(req.user._id);
  req.logout();
  res.redirect("/");
});

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
  const allCategoryTypes = await models.CategoryType.find().exec();
  res.render("questions-menu", {allCategoryTypes: allCategoryTypes});
});

router.all("/questions/:categoryType/:category", async function(req, res) {
  const categoryTypeName = req.params.categoryType;
  const categoryName = req.params.category;

  const currAnswerer = await currAnswerers.getCurrAnswerer(req.user._id, 
    categoryTypeName, categoryName);

  const userAnswers = currAnswerer.answersList.answers;

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
      userAnswers.push(postObj.data);
      await currAnswerer.answersList.save();
      currAnswerer.updateLastActionTime();
      res.end();
    }

    // Get new questions for the questions queue.
    else if (postObj.type = "updateQueue") {
      const newQs = new questions.NewQuestions(categoryTypeName, categoryName, 
        postObj.data);

      await newQs.getQuestions(userAnswers);
      res.json({results: newQs.results, endOfQSource: newQs.endOfQSource});
    };
  };
});




router.get("/music-test", async function(req, res) {


  const client_id = '18ddf7eb35004d86b4f9e3ed38604685';
  const client_secret = '239118a54fab4b6c9d45cf1449d3c0cb';

  let body = new URLSearchParams({
    "grant_type": "client_credentials"
  });

  const fetchResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + 
        client_secret).toString('base64')),
      
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: body
  });

  const token = await fetchResponse.json();


  // Think I should do a playlist for each genre, maybe also one for current popular songs.
  // Global top 50 playlist.
  // "https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF"
  // My top 1000 playlist.
  // https://api.spotify.com/v1/playlists/0K1696gAQ0HqgTXd37EE3B.

  // Search for a track.
  // "https://api.spotify.com/v1/search?type=track&q=" + encodeURI("dear mr fantasy"

  const top1000 = "0K1696gAQ0HqgTXd37EE3B";
  let offset = 0;
  // fields=items(track(name,artists[0].name,album.name,album.release_date,album.images[0].url,preview_url))&
  const apiFetch = await fetch(`https://api.spotify.com/v1/playlists/${top1000}/tracks?limit=20&offset=${offset}`, {
    headers: {"Authorization": "Bearer " + token.access_token},
  });

  const apiObj = await apiFetch.json();

  res.render("musicTest", {
    track: apiObj.items[6].track
  });

});






let rawgAPIKey = "ccb65d31462d49dba9b0daabc65952e9";
// Seems to roughly order by popularity / vote count but not quite, good enough though I think.

// Searches for all games.
let fetchString = `https://api.rawg.io/api/games?key=${rawgAPIKey}`

// Searches for a game using a search term.
fetchString = `https://api.rawg.io/api/games?key=${rawgAPIKey}&search=ultimate%20chicken%20horse`