import { NewAPIQuestions } from "../newAPIQuestions.mjs";



// For RAWG video games API.
export class NewVideoGamesQuestions extends NewAPIQuestions {
  _apiPageLimit = 30000;
  _apiMainPath = `https://api.rawg.io/api/games?key=`;
  _apiKey = "ccb65d31462d49dba9b0daabc65952e9";
  _pageAppend = "&page=";
  _idField = "id";
  _searchAppend = "&search=";

  _getNewQObj(newQ) {
    return {
      _id: newQ.id,
      title: newQ?.name,
      releaseDate: newQ?.released,
      image: newQ?.background_image
    };
  }

  // Get the total number of page results returned from the API.
  _getResultPagesNum(fetchResultsPage) {
    const numPages = Math.ceil(fetchResultsPage.count / this._defaultPageSize);
    return numPages;
  }

  // Returns the correct API path to use based on whether doing a search or 
  // standard auto queue.
  _getCorrectPath() {
    return this._apiMainPath;
  }
}