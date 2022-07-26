import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import * as models from "../models/models.mjs";
import { createNewQuestions } from '../lib/questions/createNewQuestions.mjs';
import * as similarity from "../lib/similarity.mjs";
import * as recommendations from "../lib/recommendations.mjs";
import * as admin from "../lib/admin.mjs";
import { serverState } from '../app.js';

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
  serverState.currAnswerers.removeUser(req.user._id);
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








router.get("/music-test", async function(req, res) {
  // Think I should do a playlist for each genre, maybe also one for current popular songs.
  // Global top 50 playlist.
  // "https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF"
  // My top 1000 playlist.
  // https://api.spotify.com/v1/playlists/0K1696gAQ0HqgTXd37EE3B.

  // fields=items(track(name,artists[0].name,album.name,album.release_date,album.images[0].url,preview_url))&

  // Search for a track.
  // "https://api.spotify.com/v1/search?type=track&q=" + encodeURI("dear mr fantasy"

  // const top1000 = "0K1696gAQ0HqgTXd37EE3B";
  // let offset = 0;
  // // fields=items(track(name,artists[0].name,album.name,album.release_date,album.images[0].url,preview_url))&
  
  
  // const apiFetch = await fetch(`https://api.spotify.com/v1/playlists/${top1000}/tracks?limit=20&offset=${offset}`, {
  //   headers: {"Authorization": "Bearer " + serverState.spotifyToken.access_token},
  // });

  // const apiObj = await apiFetch.json();

  // res.render("musicTest", {
  //   track: apiObj.items[6].track
  // });





  // // Add books manually.
  // const top100 = ["/works/OL76837W","/works/OL82586W","/works/OL82563W","/works/OL82548W","/works/OL16336633W","/works/OL82577W","/works/OL82537W","/works/OL82536W",
  //   "/works/OL76833W","/works/OL82565W","/works/OL21042168W","/works/OL5720023W","/works/OL24377231W","/works/OL14873315W","/works/OL5720027W","/works/OL76835W","/works/OL5720025W",
  //   "/works/OL5962664W","/works/OL2965102W","/works/OL76836W","/works/OL5720022W","/works/OL1938205W","/works/OL16524594W","/works/OL5781992W","/works/OL15424701W","/works/OL5782000W",
  //   "/works/OL4720160W","/works/OL1855944W","/works/OL547745W","/works/OL7986381W","/works/OL7920331W","/works/OL7923660W","/works/OL2827199W","/works/OL4910109W","/works/OL20983861W",
  //   "/works/OL7882540M","/works/OL80181W","/works/OL28988W","/works/OL12940733W","/works/OL82565W","/works/OL11999891W","/works/OL2423771W","/works/OL1856675W","/works/OL278572W",
  //   "/works/OL5727029W","/works/OL26417052W","/works/OL76968W","/works/OL2793678W","/works/OL451304W","/works/OL891923W","/works/OL3140834W","/works/OL20098817W","/works/OL5733806W",
  //   "/works/OL23478W","/works/OL8275982W","/works/OL74129W","/works/OL547743W","/works/OL496156W","/works/OL19787106W","/works/OL74127W","/works/OL77016W","/works/OL5860211W","/works/OL2455823W",
  //   "/works/OL6033074W","/works/OL1921530W","/works/OL1938318W","/works/OL1916939W","/works/OL26530346W","/works/OL1966505W","/works/OL481155W","/works/OL24716442W","/works/OL5819456W",
  //   "/works/OL56791W","/works/OL4297219W","/works/OL496159W","/works/OL5735363W","/works/OL17404631W","/works/OL24347038W","/works/OL74128W","/works/OL24200810W","/works/OL52987W",
  //   "/works/OL20778183W","/works/OL1938211W","/works/OL25291605W","/works/OL5844127W","/works/OL13716951W","/works/OL2733967W","/works/OL28993W","/works/OL809668W","/works/OL5840870W",
  //   "/works/OL28996W","/works/OL263458W","/works/OL27448W","/works/OL1806446W","/works/OL8443280W","/works/OL24793568W","/works/OL15181887W","/works/OL496158W","/works/OL66944W"];

  // let top100BookObjs = [];

  // for (let book of top100) {
  //   try {
  //     const fetchResponse = await fetch(`https://openlibrary.org${book}.json`);
  //     const bookObj = await fetchResponse.json();
  
  //     const authorFetchResponse = await fetch(`https://openlibrary.org${bookObj.authors[0].author.key}.json`);
  //     const authorObj = await authorFetchResponse.json();
  
  //     const thisBook = {
  //       _id: book,
  //       title: bookObj.title,
  //       author: authorObj.name,
  //       image: String(bookObj.covers[0])
  //     };
      
  //     console.log(`Adding ${bookObj.title}...`);
  //     top100BookObjs.push(thisBook);
  //   }
  //   catch (err) {
  //     console.log("new error:");
  //     console.log(err);
  //     console.log(book);
  //     console.log("end of error");
  //   }
  // };

  // const DBcatType = await models.CategoryType.findOne(
  //   {name: "Interests"}).exec();

  // const booksQsList = {
  //   categoryTypeId: DBcatType._id,
  //   categoryType: "Interests",
  //   category: "Books",
  //   apiInfo: {
  //     _id: 3,
  //     name: "OpenLibrary"
  //   },
  //   questions: top100BookObjs
  // };

  // await models.CategoryQuestionsList.create(booksQsList);
  // console.log("made new books qs list!");
});


