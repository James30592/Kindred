import { NewAPIQuestions } from "../newAPIQuestions.mjs";
import { serverState } from "../../../serverState/serverState.mjs";



// For RAWG video games API.
export class NewVideoGamesQuestions extends NewAPIQuestions {
  _apiPageLimit = 3000;
  _apiMainPath = `https://api.igdb.com/v4/games`;
  _pageAppend = "";
  _idField = "id";
  _searchAppend = "search";

  // Gets page worth of results from API, for either auto queue or search.
  async _getAPIResultsPage(pageNum) {
    const searchAppendText = this._getSearchAppend();
    const sortAppendText = "sort total_rating_count desc; where total_rating_count != null;";
    const searchOrSortField = (searchAppendText === "") ? sortAppendText : searchAppendText;

    const fetchResponse = await this._fetchFromAPI(this._apiMainPath, 
      searchOrSortField, pageNum);

    const fetchResultsPage = await fetchResponse.json();

    return fetchResultsPage;
  }

  // Fetches from the path for the API, with headers to authorise request.
  async _fetchFromAPI(apiPath, searchOrSortField, pageNum) {
    const currOffset = (pageNum - 1) * this._defaultPageSize

    return await fetch(apiPath, {
      method: "POST",
      headers: {
        "Client-ID": "7dpdjopyntxlfzv5x5anrq2ytat5xc",
        "Authorization": "Bearer " + serverState.igdbToken.access_token
      },
      body: `fields id,name,cover.image_id,first_release_date; limit ${this._defaultPageSize}; offset ${currOffset}; ${searchOrSortField}`
    });
  }

  _getSearchAppend() {
    let searchAppend = "";
    if (this._qMode === "search") {
      return `${this._searchAppend} "${decodeURI(this._searchQuery)}";`;
    };

    return searchAppend;
  }

  // Sets the page at which to stop iterating through the pages of API results.
  _setPageLimit(isFirstIteration, fetchResultsPage, pageNum) {
    if (fetchResultsPage.length === 0) {
      // Last page was the previous page.
      this._apiPageLimit = pageNum - 1;
    };
  }

  _getNewQObj(newQ) {
    return {
      _id: newQ.id,
      title: newQ?.name,
      releaseDate: new Date(newQ?.first_release_date * 1000),
      image: newQ?.cover?.image_id
    };
  }

  // Gets the array of question items from a json object returned from an API fetch request.
  _getResultsArray(fetchResultsPage) {
    return fetchResultsPage;
  }














  // Old, for RAWG API but it didn't provide good cover art.
  // 
  // _apiPageLimit = 30000;
  // _apiMainPath = `https://api.rawg.io/api/games?key=`;
  // _apiKey = "ccb65d31462d49dba9b0daabc65952e9";
  // _pageAppend = "&page=";
  // _idField = "id";
  // _searchAppend = "&search=";

  // _getNewQObj(newQ) {
  //   return {
  //     _id: newQ.id,
  //     title: newQ?.name,
  //     releaseDate: newQ?.released,
  //     image: newQ?.background_image
  //   };
  // }

  // // Get the total number of page results returned from the API.
  // _getResultPagesNum(fetchResultsPage) {
  //   const numPages = Math.ceil(fetchResultsPage.count / this._defaultPageSize);
  //   return numPages;
  // }

  // // Returns the correct API path to use based on whether doing a search or 
  // // standard auto queue.
  // _getCorrectPath() {
  //   return this._apiMainPath;
  // }
}