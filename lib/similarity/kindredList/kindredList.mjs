import { UserSimComp } from "./components/userSimComp.mjs";
import { DBCategoryAnswersLists } from "../../dbHelpers/categoryQuestionOrAnswersLists/sub-classes/categoryAnswersLists.mjs";
import { DBUsers } from "../../dbHelpers/users.mjs";
import { CategoryInfo } from "../../../public/sharedJs/categoryInfo.mjs";
import { REQD_NUM_ANSWERS } from "../../config.mjs";
import { getUserAnswers } from "../getUserAnswers.mjs";



// Stores list of top matches for a user for specific chosen categories, 
// simRatingList holds UserSimComp objects.
export class KindredList {
  static #reqdNumAnswers = REQD_NUM_ANSWERS;
  mainUser;
  mainUserAnswers;
  basedOnCategoryAnswers = new DBCategoryAnswersLists();
  relevantUsers = new DBUsers();
  basedOnCategoryInfo = new CategoryInfo();
  simRatingList = [];

  constructor(mainUser, maxListLen = null) {
    this.mainUser = mainUser;
    this.maxListLen = maxListLen;
  }

  // Given a user and comparison users to the already known categoryInfo, creates
  // an ordered list of the top x most similar users from compUsers.
  findKindred() {
    // Create UserSimComps.
    this.relevantUsers.allItems.forEach(compUser => {
      if (!compUser.equals(this.mainUser)) {
        const thisSimComp = this._createSimComp(compUser);
        thisSimComp.updateSimInfos(this.mainUserAnswers);

        // If overall number of common answers across all categories is at least
        // the required.
        if (thisSimComp.simInfo.numCommonAnswers >= KindredList.#reqdNumAnswers) {
          this._checkAndUpdateSimRatingList(thisSimComp);
        };
      };
    });
  }

  // Initialise the basedOnCategoryAnswers, relevant users and categoryInfo for this KindredList.
  async initKindredList(categoryInfo) {
    this.basedOnCategoryInfo.catTypes = structuredClone(categoryInfo.catTypes);

    // Get all relevant categoryAnswers by all users for these based on categories.
    await this.basedOnCategoryAnswers.initAnswersLists(categoryInfo);
    
    // Get the main user's answers and save them in this.mainUserAnswers.
    this.mainUserAnswers = this.#getUserAnswersCatInfo(categoryInfo, 
      this.basedOnCategoryAnswers, this.mainUser._id);

    // Find any users who have answers in basedOnCategoryAnswers.
    const relevantUserIds = this.basedOnCategoryAnswers.getAllUniqueUserIds();
    await this.relevantUsers.initUsers(relevantUserIds);
  }

  // Creates a category info object with the user's answers, given an array of 
  // categoryAnswersLists also.
  #getUserAnswersCatInfo(categoryInfo, basedOnCategoryAnswers, mainUserId) {
    const userAnswersInfo = {
      allCategoryAnswers: basedOnCategoryAnswers, 
      userId: mainUserId
    };

    return categoryInfo.cloneWithData(getUserAnswers, userAnswersInfo);
  }

  // Creates a new UserSimComp object for the current compUser.
  _createSimComp(compUser) {
    const thisSimComp = new UserSimComp(compUser, this.basedOnCategoryInfo, 
      this.basedOnCategoryAnswers.allItems);

    return thisSimComp;
  }

  // Updates this simRatingList if the simComp is eligible to be added to the list.
  _checkAndUpdateSimRatingList(simComp) {
    const [isNewKindred, needRemoveLastSimRating] = this._checkIfNewKindred(simComp);

    if (isNewKindred) {
      this._updateSimRatingList(simComp, needRemoveLastSimRating);
    };
  }

  // Returns if this simComp needs adding to the simRatingList and also if
  // the last element needs removing.
  _checkIfNewKindred(simComp) {
    if (this.simRatingList.length < this.maxListLen) {
      return [true, false];
    }

    else {
      const isTopKindred = KindredList.#compareSimRatings(simComp,
        this.simRatingList.at(-1)) === 0;

      if (isTopKindred) {
        return [true, true];
      };
    };

    return [false, false];
  }

  // Updates a simRatingList by inserting the new simRating.
  _updateSimRatingList(simComp, needRemoveLastElem) {
    if (needRemoveLastElem) this.simRatingList.pop();
    let insertIndex = this.#getSimInsertIndex(simComp);
    this.simRatingList.splice(insertIndex, 0, simComp);
  }

  // Returns index at which thisSimRating should be inserted in to simRatingList,
  // such that it is ordered from most similar to least similar.
  #getSimInsertIndex(thisSimRating){
    let i = 0;
    for (i; i < this.simRatingList.length; i++) {
      let compSimRating = this.simRatingList[i];
      if (KindredList.#compareSimRatings(thisSimRating, compSimRating) === 0) {
        break;
      };
    };

    return i;
  }

  // Compares two simRatings to see which is more similar to the user. Returns 0
  // if it's simRating1, 1 if it's simRating2.
  static #compareSimRatings(simRating1, simRating2){
    const simScore1 = simRating1.simInfo.simScore;
    const commonAnswers1 = simRating1.simInfo.numCommonAnswers;
    const simScore2 = simRating2.simInfo.simScore;
    const commonAnswers2 = simRating2.simInfo.numCommonAnswers;

    let result = 0;

    if (simScore1 < simScore2) {
      result = 1;
    }
    else if (simScore1 == simScore2){
      result = commonAnswers1 <= commonAnswers2 ? 0 : 1;
    };

    return result;
  }
}