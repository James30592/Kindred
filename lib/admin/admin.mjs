import { User } from "../../models/user.mjs";
import { CategoryAnswersList } from "../../models/categoryAnswersList.mjs";
import { getPlaceDetails } from "../../public/sharedJs/getPlaceDetails.mjs";
import { MY_CITIES } from "./myCities.mjs";
import { MY_NAMES } from "./myNames.mjs";
import * as fs from 'fs';
import { createNewQuestions } from "../questions/createNewQuestions.mjs";



export class BatchUserCreator {
  #allCategoryInfo;
  #allCategoryQs = [];

  static #ALL_LOCS = MY_CITIES;
  static #LOCS_FILE = "lib/admin/locs.txt";
  static #AUTO_QS = "lib/admin/autoQs/";
  static #NUM_ANSWERS = 200;

  constructor(dbCategoryInfo) {
    this.#allCategoryInfo = dbCategoryInfo;
  }

  // Create numUsers number of users in the database with fully completed questions
  // for all categories, completely randomised.
  async createUsers(numUsers) {
    numUsers = numUsers === "" ? 3 : numUsers;

    // Run this when need to update questions in JSON files, last done 02/10/22.
    // await this.#createAllCategoryQs();

    await this.#getAllCategoryQs();

    for (let i = 1; i <= numUsers; i++) {
      const newUserId = await BatchUserCreator.#createUser(i);
      await this.#createRandAnswers(newUserId);
    };

    const resultMsg = `Created ${numUsers} new users!`;
    return resultMsg;
  }

  // Gets the category qs for first X number of questions of each category that 
  // are saved in JSON files.
  async #getAllCategoryQs() {
    const catFiles = fs.readdirSync(BatchUserCreator.#AUTO_QS);
    
    for (let catFile of catFiles) {
      const categoryQs = await JSON.parse(fs.readFileSync(
        BatchUserCreator.#AUTO_QS + catFile));

      this.#allCategoryQs.push(categoryQs);
    };
  }

  // Create answers lists objects in the database for each category.
  async #createRandAnswers(userId) {
    const userAnswersAllCats = this.#allCategoryQs.map(createAnswersList);
    await CategoryAnswersList.create(userAnswersAllCats);

    function createAnswersList(categoryQs) {
      const thisCatAnswersList = {
        userId: userId,
        categoryTypeId: categoryQs.catTypeId,
        categoryType: categoryQs._categoryTypeName,
        category: categoryQs._categoryName,
        answers: categoryQs.results.map(createAnswer)
      };

      return thisCatAnswersList;

      function createAnswer(q) {
        const answer = {
          questionId: q._id,
          skip: false,
          answerVal: BatchUserCreator.#getRandAnsVal(),
          questionDetails: BatchUserCreator.#getQuestionDetails(q)
        };

        return answer;
      };
    };
  }

  static #getQuestionDetails(q) {
    const questionDetails = {};
    const propsToIgnore = ["_id", "apiPageNum", "alreadyInDb", "currAns"];

    for (let prop in q) {
      const ignoreProp = propsToIgnore.includes(prop);
      if (ignoreProp) continue;
      questionDetails[prop] = q[prop];
    };

    return questionDetails;
  }

  // Gets first X number of qs for each category and saves them to JSON files.
  async #createAllCategoryQs() {
    const allCats = [];

    this.#allCategoryInfo.forEach(catType => {
      catType.categories.forEach(cat => {
        allCats.push({
          cat: cat.name, 
          catType: {
            name: catType.name, 
            id: catType._id
          }
        });
      });
    });

    for (let catAndType of allCats) {
      const queueRecInfo = {
        queueType: "auto",
        numQs: BatchUserCreator.#NUM_ANSWERS,
        currQueueIds: [],
        startApiPage: 1,
        filters: {},
        includeAnsweredQs: true
      };

      try {
        const autoQs = createNewQuestions(catAndType.catType.name, catAndType.cat, 
          [], queueRecInfo);
  
        await autoQs.getQuestions();
        autoQs.catTypeId = catAndType.catType.id;
          
        // This was for version where not saving questions in files.
        // this.#allCategoryQs.push(autoQs);

        const saveDir = BatchUserCreator.#AUTO_QS + `${catAndType.cat}.json`;
        const stringObj = JSON.stringify(autoQs);
        fs.writeFileSync(saveDir, stringObj);
      }
      catch {
        console.log(`Error for catType: ${catAndType.catType}, cat: ${catAndType.cat}`);
      };
    };
  }

  async #createLocsFile() {
    const allLocs = [];
    
    for (let city of BatchUserCreator.#ALL_LOCS) {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${process.env.GOOGLE_MAPS_KEY}`;
      const fetchQuery = await fetch(url);
      const fetchResults = await fetchQuery.json();
      const googlePlace = fetchResults.results[0];

      let myPlace = getPlaceDetails(googlePlace, false);
      const formattedPlace = this.#formatAddress(myPlace);

      allLocs.push(formattedPlace);
    };

    fs.writeFileSync(BatchUserCreator.#LOCS_FILE, JSON.stringify(allLocs));
  }

  // Get place in format that can be submitted to database as part of new user.
  #formatAddress(place) {
    const formattedPlace = {
      formattedAddress: place.formattedAddress,
      googlePlaceId: place.googlePlaceId,
      placeName: place.placeName
    };

    formattedPlace.fullAddress = place.fullAddress.map(currLine => {
      return currLine.long_name;
    });

    formattedPlace.country = {
      short: place.countryShort,
      long: place.countryLong
    };

    formattedPlace.coords = {
      lat: place.lat,
      lng: place.lng
    };

    return formattedPlace;
  }

  // Create numUsers number of users in the database with fully completed questions
  // for all categories, completely randomised.
  static async #createUser(num) {
    const name = BatchUserCreator.#getRandName();
    const lCaseName = name.toLowerCase();

    const userObj = {
      email: `${lCaseName}@auto${num}.com`,
      profileName: name,
      location: BatchUserCreator.#getRandLoc(),
      isAdmin: false,
      setupComplete: true
    };

    const newUser = await User.register(userObj, lCaseName);
    return newUser._id;
  }

  static #getRandLoc() {
    const allLocs = JSON.parse(fs.readFileSync(BatchUserCreator.#LOCS_FILE));
    const index = Math.floor(Math.random() * allLocs.length);
    return allLocs[index];
  }

  // Returns a randomly generated answerVal for a question.
  static #getRandAnsVal() {
    const ansVal = Math.round(Math.random() * 20) / 2;
    return ansVal;
  }

  static #getRandName() {
    const randIdx = Math.floor(Math.random() * MY_NAMES.length);
    return MY_NAMES[randIdx];
  }
}
