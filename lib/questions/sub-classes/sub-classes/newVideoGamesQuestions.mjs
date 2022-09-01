import { NewAPIQuestions } from "../newAPIQuestions.mjs";
import { serverState } from "../../../serverState/serverState.mjs";
import Fuse from "fuse.js";



// For IGDB video games API.
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

    const searchOrSortField = (searchAppendText === "") ? sortAppendText 
      : searchAppendText;

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
      body: `fields id,name,cover.image_id,first_release_date,platforms.name,platforms.platform_family,platforms.category; limit ${this._defaultPageSize}; offset ${currOffset}; ${searchOrSortField}`
    });
  }

  // Used to sort the final results in to more appropriate order based on the 
  // search query.
  _postProcessResults() {
    if (this._qMode !== "search") return;

    const fuseOptions = {
       findAllMatches: true,
       threshold: 1,
      keys: ["title"]
    };

    const fuse = new Fuse(this.results, fuseOptions);
    const sortedResults = fuse.search(this._searchQuery);
    this.results = sortedResults.map(result => result.item);
  }

  _getSearchAppend() {
    this._searchQuery = decodeURI(this._searchQuery);

    let searchAppend = "";
    if (this._qMode === "search") {
      return `${this._searchAppend} "${this._searchQuery}";`;
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
      image: newQ?.cover?.image_id,
      platforms: this.#getPlatformsText(newQ.platforms)
    };
  }

  // Gets the array of question items from a json object returned from an API fetch request.
  _getResultsArray(fetchResultsPage) {
    return fetchResultsPage;
  }

  #getPlatformsText(qPlatforms) {
    const allPlatforms = {
      1: "Console",
      4: "PC",
      5: "Handheld",
      6: "PC",
      2: "Other",
      3: "Other",
    };

    const thisPlatCats = qPlatforms.map(plat => plat.category);
    const thisUniquePlatCats = new Set();

    for (let platCat of thisPlatCats) {
      const platText = allPlatforms[platCat];
      thisUniquePlatCats.add(platText);
    };

    const thisUniquePlatCatsArr = Array.from(thisUniquePlatCats);

    const thisPlatCatText = thisUniquePlatCatsArr.join(", ");
    return thisPlatCatText
  }
}