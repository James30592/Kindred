import * as dbHelpers from "../lib/dbHelpers.mjs";
import { apiRefs } from '../lib/apiRefs.mjs';


// For NewQuestions object, used to check and create list of next available (not 
// already answered by the user) questions for a given category, from either API or DB.
export class NewQuestions {
    categoryTypeName;
    categoryName;
    results = [];
    endOfQSource = true;
    numQs;
    filters;
    isNewQueue;
    currQueueIds;
    maxQueueApiPage;
  
    constructor(catTypeName, catName, queueReqInfo) {
      this.categoryTypeName = catTypeName;
      this.categoryName = catName;
      for (let key in queueReqInfo) {
        this[key] = queueReqInfo[key];
      };
    }
  
    // Query either DB or API and get first numQs number of questions that are 
    // unanswered and not already in the queue.
    async getQuestions(userAnswers) {
      const categoryQsList = new dbHelpers.CategoryQuestionsList();
      await categoryQsList.init(this.categoryTypeName, this.categoryName);
      
      // Check if questions for this category come from API or DB.
      if (categoryQsList.item.isSourceAPI) {
        // Source of questions is an API, get the API info from DB.
        const apiRefItem = apiRefs[categoryQsList.item.apiInfo._id];
  
        // If extending a queue then only start fetching from the API from the 
        // current max page of the search based on the current questions queue.
        let pageNum = this.isNewQueue ? 1 : this.maxQueueApiPage;
        const maxApiPage = apiRefItem.maxPage;
        
        // As long as more questions needed for queue and not reached end of API 
        // results, fetch more Qs from API and add them.
        while (this.results.length < this.numQs &&
          pageNum <= maxApiPage) {
  
          const apiPath = apiRefItem.path + apiRefItem.key + 
            apiRefItem.pageAppend + pageNum;
  
          const pageResults = await this.#fetchPage(apiPath);
  
          // Test new questions from source to see if new and add to results.
          this.#buildResults(pageResults, apiRefItem.idField, userAnswers, 
            pageNum);
  
          pageNum++;
        };
      }
    
      else {
        // Source of questions is DB, retrieve them.
        this.#buildResults(categoryQsList.item.questions, "_id", userAnswers);
      }
  
      return this.results;
    }
  
    // Fetches a page worth of results from an API.
    async #fetchPage(path) {
      const fetchResponse = await fetch(path);
      const fetchResultsPage = await fetchResponse.json();
      let results;
  
      switch(true) {
        case (this.categoryTypeName === "Interests" && this.categoryName === "Films") :
          results = fetchResultsPage.results;
          break;
  
        default:
          results = fetchResultsPage
      };
  
      return results;
    }
  
    // Tests an array of potential new questions and if not already answered by 
    // the user or in the queue, adds them to this results.
    #buildResults(potentialNewQs, idFieldName, userAnswers, apiPageNum = null) {
  
      const userAnsweredQIds = userAnswers.map(ans => ans.questionId);
  
      for (let potentialNewQ of potentialNewQs) {
        // Have got enough new questions for the queue already.
        if (this.results.length >= this.numQs) {
          this.endOfQSource = false;
          break;
        };
  
        const potentialNewQId = potentialNewQ[idFieldName];
  
        // Check that this question is not already in the queue and that the user 
        // has not already answered it.
        if ((!this.currQueueIds.includes(potentialNewQId)) && 
            (!userAnsweredQIds.includes(potentialNewQId))) {
  
          const newQObj = NewQuestions.#getNewQObj(potentialNewQ, 
            this.categoryTypeName, this.categoryName, apiPageNum);
  
          this.results.push(newQObj);
        };
      };
    }
  
    // Creates question object, individualised for each category as necessary.
    static #getNewQObj(newQ, catTypeName, catName, apiPageNum) {
      const newQObj = {};
  
      // Think change all this to using classes for different types of question 
      // eg. for films etc. all taking newQ as input to constructor.......................
      switch(true) {
  
        case (catTypeName === "Interests" && catName === "Films") :
          newQObj._id = newQ.id;
          newQObj.title = newQ.title;
          newQObj.releaseDate = newQ.release_date;
          newQObj.posterPath = newQ.poster_path;
          newQObj.apiPageNum = apiPageNum;
          break;
  
        default:
          newQObj._id = newQ._id;
          newQObj.text = newQ.text;
      };
      
      return newQObj;
    }
  }