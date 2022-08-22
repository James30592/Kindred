import { UserSimComp } from "../../kindredList/components/userSimComp.mjs";
import { getUserAnswers } from "../../getUserAnswers.mjs";



export class UserSimCompForRecommendations extends UserSimComp {
  // Also store the recommendationsFor category info, to store the compUser's 
  // answers to these questions in order to calculate recommendations later.
  recForCategoryInfo;
  
  constructor(user, basedOnCategoryInfo = null, basedOnCategoryAnswers = [], 
    recForCategoryInfo = null, recForCategoryAnswers = []) {

    super(user, basedOnCategoryInfo, basedOnCategoryAnswers);
    this.recForCategoryInfo = this.#initRecForCatInfo(user, recForCategoryInfo, 
      recForCategoryAnswers);
  }
  
  // Gets this comp users answers to each result category and stores in 
  // a category info object.
  #initRecForCatInfo(user, recForCategoryInfo, recForCategoryAnswers) {
    const userAnswersInfo = {
      allCategoryAnswers: recForCategoryAnswers, 
      userId: user._id
    };

    return recForCategoryInfo.cloneWithData(getUserAnswers, userAnswersInfo);
  }
}