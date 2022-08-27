import { QuestionsQueue } from "../questionsQueue.mjs";



export class SearchQuestionsQueue extends QuestionsQueue {
  endQueueMsg = "No results for this search term (or you answered them all already), try another!";
  noSearchTermMsg = "Enter a search term!";
  queueType = "search";
  searchQuery = "";

  _getEndQueueMsg() {
    let endQueueMsg = (this.searchQuery === "") ? this.noSearchTermMsg : this.endQueueMsg;
    return endQueueMsg;
  }

  // Checks if the queue needs and can be extended.
  checkQueueToBeUpdated() {
    const canBeUpdated = super.checkQueueToBeUpdated();
    const isValidSearch = this.searchQuery !== "";
    return canBeUpdated && isValidSearch;
  }

  // Resets this search queue and then sets the search query. Returns whether 
  // search query has changed or not.
  newSearch() {
    this.reset();
    const prevSearchTerm = this.searchQuery;
    this.searchQuery = encodeURI(this.inputPanel.searchInput.value);
    return this.searchQuery !== prevSearchTerm;
  }

  // Search queue version of the making the post object for updating the queue, 
  // also includes the search query and whether previously answered questions 
  // should be included.
  _getPostObj(numQuestions, currQueueIds, startApiPage) {
    const postObj = super._getPostObj(numQuestions, currQueueIds, 
      startApiPage);

    postObj.data.searchQuery = this.searchQuery;
    postObj.data.includeAnsweredQs = this.inputPanel.includeAlreadyAnsweredCheckbox.checked;
    return postObj;
  }
}