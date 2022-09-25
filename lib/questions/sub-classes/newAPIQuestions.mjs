import { NewQuestions } from "../newQuestions.mjs";



// Generic for any API.
export class NewAPIQuestions extends NewQuestions {
  #maxQueueApiPage;
  _apiPageLimit = 1000;
  _apiMainPath;
  _apiSearchPath;
  _apiKey;
  _pageAppend;
  _defaultPageSize = 40;
  _searchAppend;

  constructor(catTypeName, catName, userAnswers, queueReqInfo) {
    super(catTypeName, catName, userAnswers, queueReqInfo);
    this.#maxQueueApiPage = queueReqInfo.startApiPage;
  }

  // Get questions for the auto queue mode.
  async _getAutoQuestions() {
    await this._getAPIQuestions();
  }

  // Get questions for the search queue mode.
  async _getSearchQuestions() {
    await this._getAPIQuestions();
  }

  // Get first x questions that aren't already in the queue and haven't already 
  // been answered (if includePrevAnswers is false).
  async _getAPIQuestions() {
    // If extending a queue then only start fetching from the API from the 
    // current max page of the search based on the current questions queue.
    let pageNum = this.#maxQueueApiPage;

    let isFirstIteration = true;
    
    // As long as more questions needed for queue and not reached end of API 
    // results, fetch more Qs from API and add them.
    while (this.results.length < this._numQs &&
      pageNum <= this._apiPageLimit) {
      
      // Gets page worth of results from API, for either auto queue or search.
      const fetchResultsPage = await this._getAPIResultsPage(pageNum);
      const pageResults = this._getResultsArray(fetchResultsPage);

      // Test new questions from source to see if new and add to results.
      const eligibleNewQs = this._getEligibleNewQs(pageResults);
      const newQObjects = this._makeQObjects(eligibleNewQs); 
      this._addApiPage(newQObjects, pageNum);

      this.results.push(...newQObjects);

      // On first pass, get the total number of pages of results and don't 
      // iterate beyond this, mainly used for search.
      this._setPageLimit(isFirstIteration, fetchResultsPage, pageNum);

      pageNum++;
    };
    
    this.#setIfEndQSource(pageNum);
    
    this._postProcessResults();
    return this.results;
  }

  // Used only by the video games API currently when searching, to sort the 
  // final results in to more appropriate order based on the search query.
  _postProcessResults() {
    return;
  }

  // Sets the page at which to stop iterating through the pages of API results.
  _setPageLimit(isFirstIteration, fetchResultsPage, pageNum) {
    if (isFirstIteration) {
      this._apiPageLimit = this.#getMaxPageNum(fetchResultsPage);
    };
  }

  // Adds the API page number to the question object.
  _addApiPage(newQObjects, pageNum) {
    for (let newQObject of newQObjects) {
      newQObject.apiPageNum = pageNum;
    };
  }

  // Gets page worth of results from API, for either auto queue or search.
  async _getAPIResultsPage(pageNum) {
    // Get correct path and search append text to use dependent on whether doing 
    // a search or auto queue.
    const correctPath = this._getCorrectPath();
    const searchAppendText = this._getSearchAppend();

    const apiPath = this._buildPath(correctPath, searchAppendText, pageNum);
    const fetchResponse = await this._fetchFromAPI(apiPath);
    const fetchResultsPage = await fetchResponse.json();

    return fetchResultsPage;
  }

  // Get the total number of pages of results to iterate over.
  #getMaxPageNum(fetchResultsPage) {
    const numReturnedPages = this._getResultPagesNum(fetchResultsPage);
    return Math.min(this._apiPageLimit, numReturnedPages);
  }

  // If reached the end of potential new qs but there are more pages of API 
  // results left, mark as questions not exhausted.
  #setIfEndQSource(pageNum) {
    if (this.endOfQSource && (pageNum < this._apiPageLimit)) {
      this.endOfQSource = false;
    };
  }

  // Builds api full path in corect format.
  _buildPath(correctPath, searchAppendText, pageNum) {
    return correctPath + this._apiKey + this._pageAppend + pageNum + searchAppendText;
  }

  // Returns the correct search append text to use based on whether doing a 
  // search or standard auto queue.
  _getSearchAppend() {
    let searchAppend = "";
    if (this._qMode === "search") {
      return this._searchAppend + this._searchQuery;
    };

    return searchAppend;
  }

  // Fetches from the path for the API.
  async _fetchFromAPI(apiPath) {
    return await fetch(apiPath);
  }

  // Gets the array of question items from a json object returned from an API fetch request.
  _getResultsArray(fetchResultsPage) {
    return fetchResultsPage.results;
  }

  // Returns the correct API path to use based on whether doing a search or 
  // standard auto queue.
  _getCorrectPath() {
    return this._qMode === "search" ? this._apiSearchPath : this._apiMainPath;
  }

  _getDate(releaseDate) {
    const year = Number(releaseDate.slice(0, 4));
    const month = Number(releaseDate.slice(5, 7));
    const day = Number(releaseDate.slice(8, 10));

    return new Date(year, month, day);
  }
}