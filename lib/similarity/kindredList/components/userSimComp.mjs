import { SimInfo } from "./simInfo.mjs";
import { CategoryInfo } from "../../../../src/sharedJs/categoryInfo.mjs";



// Similarity comparison info object for one user. Extends CategoryInfo and adds
// a simInfo fields for each category type, each category, and for the overall object.
export class UserSimComp extends CategoryInfo {
  id;
  profileName;
  location;
  simInfo;
  allCategoryAnswers;

  constructor(user, categoryInfo = null, allUserAnswers = []) {
    super();
    if (categoryInfo) {
      this.#initCatTypes(categoryInfo);
    };

    this.id = user._id;
    this.profileName = user.profileName;
    
    this.location = {
      placeName: user.location.placeName,
      country: user.location.country,
      coords: user.location.coords
    };

    this.simInfo = new SimInfo();
    this.allCategoryAnswers = this.#getThisUserAnswers(allUserAnswers);
  }

  // Returns an array of just this user's category answers, given an array of 
  // all users' relevant answers.
  #getThisUserAnswers(allUserAnswers) {
    const thisUserCategoryAnswers = [];

    for (let categoryAnswers of allUserAnswers) {
      if (categoryAnswers.userId.equals(this.id)) {
        thisUserCategoryAnswers.push(categoryAnswers);
      };
    };

    return thisUserCategoryAnswers;
  }

  // Returns a single answers list for a particular category for this comp user 
  // from this.allCategoryAnswers, given the category type and category.
  #getCategoryAnswers(categoryTypeName, categoryName) {
    for (let categoryAnswers of this.allCategoryAnswers) {
      if (categoryAnswers.categoryType === categoryTypeName &&
        categoryAnswers.category === categoryName) {

        return categoryAnswers;
      };
    };
    return [];
  }

  // Compares answer similarity between two users and stores the results at
  // category, category type, and overall level.
  updateSimInfos(mainUserAllAnswers) {
    for (let categoryTypeName in this.catTypes) {
      for (let categoryName in this.catTypes[categoryTypeName].categories) {
        const mainUserAnswers = mainUserAllAnswers.catTypes[categoryTypeName].categories[categoryName].categoryAnswersList.answers;
        const compUserAnswers = this.#getCategoryAnswers(categoryTypeName, categoryName).answers;

        if (!compUserAnswers) continue;

        const categorySimInfo = UserSimComp.#compareAnswers(mainUserAnswers, compUserAnswers);
        this.#updateCategorySimilarity(categorySimInfo, categoryTypeName, categoryName);
      };
    };
    this.#updateCatTypeAndOverallSimInfos();
  }

  #initCatTypes(categoryInfo) {
    this.catTypes = structuredClone(categoryInfo.catTypes);
    for (let catType in this.catTypes) {
      // Create new SimInfo object for each category type.
      const thisCatType = this.catTypes[catType];
      thisCatType.simInfo = new SimInfo();

      for (let category in thisCatType.categories) {

        // Create new SimInfo object for each category.
        this.catTypes[catType].categories[category] = {
          simInfo: new SimInfo()
        };
      };
    };
  }

  _addTypeAndCategory(categoryTypeName, categoryName) {
    super._addTypeAndCategory(categoryTypeName, categoryName);
    this.#initSimInfo(categoryTypeName, categoryName);
  }

  _addCategory(categoryTypeName, categoryName) {
    super._addCategory(categoryTypeName, categoryName);
    this.#initSimInfo(categoryTypeName, categoryName);
  }

  #initSimInfo(categoryTypeName, categoryName) {
    this.catTypes[categoryTypeName].categories[categoryName] = {
      simInfo: new SimInfo()
    };
  }

  // Calculates similarity between 2 arrays of answers for a single category from
  // 2 different users (user1 is main user, user2 is comp) and returns a SimInfo object.
  static #compareAnswers(user1Answers, user2Answers) {

    // Filter out the skipped answers for each user.
    const filterAnswered = ans => !ans.skip;
    const user1AnswersFiltered = user1Answers.filter(filterAnswered);
    const user2AnswersFiltered = user2Answers.filter(filterAnswered);

    // Work off whichever user has fewer questions answered, for efficiency.
    const user2MoreAnswers = user1Answers.length < user2Answers.length;

    const [list1Answers, list2Answers, isList1MainUser] = user2MoreAnswers ?
      [user1AnswersFiltered, user2AnswersFiltered, true] : 
      [user2AnswersFiltered, user1AnswersFiltered, false];

    let [numSimScores, cumulSimScore, overallDiff] = [0, 0, 0];

    list1Answers.forEach(function(list1Answer) {
      const list2Answer = list2Answers.find(
        answer => answer.questionId === list1Answer.questionId);

      if (list2Answer) {
        let ansSimScore = list1Answer.answerVal - list2Answer.answerVal;
        ansSimScore = isList1MainUser ? ansSimScore : -ansSimScore;
        
        numSimScores++;
        cumulSimScore += Math.abs(ansSimScore);
        overallDiff += ansSimScore;
      };
    });

    let [avgSimScore, avgDiff] = [10, 10];

    if (numSimScores > 0) {
      avgSimScore = cumulSimScore / numSimScores;
      avgDiff = overallDiff / numSimScores;
    };

    const thisSimInfo = new SimInfo(10 - avgSimScore, numSimScores, avgDiff);

    return thisSimInfo;
  }

  #updateCategorySimilarity(categorySimInfo, categoryTypeName, categoryName) {
    this.catTypes[categoryTypeName].categories[categoryName].simInfo = categorySimInfo;
  }

  // Updates simInfo fields for all the catTypes and the overall this object.
  #updateCatTypeAndOverallSimInfos() {
    let [overallTotalSimScore, overallTotalScoreDiff, overallCommonAnswers] = [0,0,0];

    for (let catType in this.catTypes) {
      const thisCatType = this.catTypes[catType];

      let [typeTotalSimScore, typeTotalScoreDiff, typeCommonAnswers] = [0,0,0];

      for (let category in thisCatType.categories) {
        let thisSimInfo = thisCatType.categories[category].simInfo;

        typeCommonAnswers += thisSimInfo.numCommonAnswers;
        typeTotalSimScore += thisSimInfo.simScore * thisSimInfo.numCommonAnswers;
        typeTotalScoreDiff += thisSimInfo.scoreDiff * thisSimInfo.numCommonAnswers;
      };

      overallCommonAnswers += typeCommonAnswers;
      overallTotalSimScore += typeTotalSimScore;
      overallTotalScoreDiff += typeTotalScoreDiff;

      this.catTypes[catType].simInfo.simScore = typeTotalSimScore / typeCommonAnswers;
      this.catTypes[catType].simInfo.scoreDiff = typeTotalScoreDiff / typeCommonAnswers;
      this.catTypes[catType].simInfo.numCommonAnswers = typeCommonAnswers;
    };

    this.simInfo.simScore = overallTotalSimScore / overallCommonAnswers;
    this.simInfo.scoreDiff = overallTotalScoreDiff / overallCommonAnswers;
    this.simInfo.numCommonAnswers = overallCommonAnswers;
  }
}