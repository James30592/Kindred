import * as dbHelpers from "../lib/dbHelpers.mjs";
import { serverState } from '../app.js';
import { apiRefs } from '../lib/apiRefs.mjs';


export function createNewQuestions(catTypeName, catName, userAnswers, queueReqInfo) {
  switch (catTypeName, catName) {
    case ("Interests", "Films"):
      return new NewFilmsTVQuestions(catTypeName, catName, userAnswers, queueReqInfo);

    case ("Interests", "TV"):
      return new NewFilmsTVQuestions(catTypeName, catName, userAnswers, queueReqInfo);

    // case (catTypeName === "Interests" && catName === "Books"):
    //   return new NewBooksQuestions(catTypeName, catName, userAnswers, queueReqInfo);

    case ("Interests", "Music"):
      return new NewMusicQuestions(catTypeName, catName, userAnswers, queueReqInfo);

    case ("Interests", "Video Games"):
      return new NewVideoGamesQuestions(catTypeName, catName, userAnswers, queueReqInfo);
    
    default:
      return new NewDBQuestions(catTypeName, catName, userAnswers, queueReqInfo);
  };
}



// For NewQuestions object, used to check and create list of next available (not 
// already answered by the user) questions for a given category, generic - from either API or DB.
class NewQuestions {
  _categoryTypeName;
  _categoryName;
  results = [];
  endOfQSource = false;
  _numQs;
  _filters;
  #userAnsweredQIds;
  #currQueueIds;
  _idField;

  constructor(catTypeName, catName, userAnswers, queueReqInfo) {
    this._categoryTypeName = catTypeName;
    this._categoryName = catName;
    this._numQs = queueReqInfo.numQs;
    this._filters = queueReqInfo.filters;
    this.#userAnsweredQIds = userAnswers.map(ans => ans.questionId);
    this.#currQueueIds = queueReqInfo.currQueueIds;
  }

  // Tests an array of potential new questions to see if not already answered by 
  // the user or in the queue.
  _getEligibleNewQs(potentialNewQs) {
    const eligibleNewQs = [];
    
    for (let i = 0; i < potentialNewQs.length; i++) {
      const potentialNewQ = potentialNewQs[i];

      // Have got enough new questions for the queue already.
      const totalNumToAdd = this.results.length + eligibleNewQs.length;
      if (totalNumToAdd >= this._numQs) {
        break;
      };

      const potentialNewQId = potentialNewQ[this._idField];
      const userAlreadyAnswered = this.#userAnsweredQIds.includes(potentialNewQId);
      const alreadyInQueue = this.#currQueueIds.includes(potentialNewQId);
      const isEligibleForQueue = !alreadyInQueue && !userAlreadyAnswered;

      if (isEligibleForQueue) {
        eligibleNewQs.push(potentialNewQ);
        // Mark as exhausted question list, will be overriden later for API case.
        if (i === potentialNewQs.length - 1) {
          this.endOfQSource = true;
        };
      };
    };

    return eligibleNewQs;
  }
}




// For NewQuestions object, used to check and create list of next available (not 
// already answered by the user) questions for a given category, from either API or DB.
class NewDBQuestions extends NewQuestions {
  #categoryQsList;
  _idField = "_id";

  constructor(catTypeName, catName, userAnswers, queueReqInfo) {
    super(catTypeName, catName, userAnswers, queueReqInfo);
    this.#categoryQsList = new dbHelpers.CategoryQuestionsList();
  }

  // Query DB and get first numQs number of questions that are unanswered and 
  // not already in the queue.
  async getQuestions() {
    await this.#categoryQsList.init(this._categoryTypeName, this._categoryName);

    // Test new questions from source to see if new and add to results.
    const eligibleNewQs = this._getEligibleNewQs(this.#categoryQsList.item.questions);

    this.#buildResults(eligibleNewQs);

    return this.results;
  }

  // Creates question object, individualised for each category as necessary.
  _getNewQObj(newQ) {
    return {
      _id: newQ._id,
      text: newQ.text
    };
  }

  // Makes questions objects for each eligible question and builds this.results.
  #buildResults(eligibleNewQs) {
    for (let eligibleNewQ of eligibleNewQs) {
      const newQObj = this._getNewQObj(eligibleNewQ);
      this.results.push(newQObj);
    };
  }
}



// Generic for any API.
class NewAPIQuestions extends NewQuestions {
  #isNewQueue;
  #maxQueueApiPage;
  _apiPageLimit;
  _apiMainPath;
  _apiKey;
  _pageAppend;
  _defaultPageSize = 20;

  constructor(catTypeName, catName, userAnswers, queueReqInfo) {
    super(catTypeName, catName, userAnswers, queueReqInfo);
    this.#isNewQueue = queueReqInfo.isNewQueue;
    this.#maxQueueApiPage = queueReqInfo.maxQueueApiPage;
  }

  // Query API and get first numQs number of questions that are unanswered and 
  // not already in the queue.
  async getQuestions() {
    // If extending a queue then only start fetching from the API from the 
    // current max page of the search based on the current questions queue.
    let pageNum = this.#isNewQueue ? 1 : this.#maxQueueApiPage;
    
    // As long as more questions needed for queue and not reached end of API 
    // results, fetch more Qs from API and add them.
    while (this.results.length < this._numQs &&
      pageNum <= this._apiPageLimit) {
      
      const apiPath = this._buildPath(pageNum);
      const fetchResponse = await this._fetchFromAPI(apiPath);
      const fetchResultsPage = await fetchResponse.json();
      const pageResults = this._getResultsArray(fetchResultsPage);

      // Test new questions from source to see if new and add to results.
      const eligibleNewQs = this._getEligibleNewQs(pageResults);
      this.#buildResults(eligibleNewQs, pageNum);

      pageNum++;
    };
    
    this.#setIfEndQSource(pageNum);
   
    return this.results;
  }

  // If reached the end of potential new qs but there are more pages of API 
  // results left, mark as questions not exhausted.
  #setIfEndQSource(pageNum) {
    if (this.endOfQSource && (pageNum < this._apiPageLimit)) {
      this.endOfQSource = false;
    };
  }

  // Builds api full path in corect format.
  _buildPath(pageNum) {
    return this._apiMainPath + this._apiKey + this._pageAppend + pageNum;
  }

  // Fetches from the path for the API.
  async _fetchFromAPI(apiPath) {
    return await fetch(apiPath);
  }

  // Gets the array of question items from a json object returned from an API fetch request.
  _getResultsArray(fetchResultsPage) {
    return fetchResultsPage.results;
  }

  // Makes questions objects for each eligible question and builds this.results.
  #buildResults(eligibleNewQs, apiPageNum) {
    for (let eligibleNewQ of eligibleNewQs) {
      const newQObj = this._getNewQObj(eligibleNewQ, apiPageNum);
      this.results.push(newQObj);
    };
  }
}




// For TMDB movies / TV.
class NewFilmsTVQuestions extends NewAPIQuestions {
  _apiPageLimit = 500;
  _apiKey = "84c6fe840210161c52e9a52c9cc129bb";
  _pageAppend = "&page=";
  _idField = "id";
  #apiCategory;

  constructor(catTypeName, catName, userAnswers, queueReqInfo) {
    super(catTypeName, catName, userAnswers, queueReqInfo);
    this. #apiCategory = catName === "Films" ? "movie" : "tv";
    this._apiMainPath = `https://api.themoviedb.org/3/discover/${this.#apiCategory}?sort_by=vote_count.desc&api_key=`;
  }

  _getNewQObj(newQ, apiPageNum) {
    const [titleField, releaseDateField]  = (this.#apiCategory === "movie") 
      ? ["title", "release_date"] 
      : ["name", "first_air_date"];

    return {
      _id: newQ.id,
      title: newQ[titleField],
      releaseDate: newQ[releaseDateField],
      posterPath: newQ.poster_path,
      apiPageNum: apiPageNum,
    };
  }
}




// For RAWG video games API.
class NewVideoGamesQuestions extends NewAPIQuestions {
  _apiPageLimit = 30000;
  _apiMainPath = `https://api.rawg.io/api/games?key=`;
  _apiKey = "ccb65d31462d49dba9b0daabc65952e9";
  _pageAppend = "&page=";
  _idField = "id";

  _getNewQObj(newQ, apiPageNum) {
    return {
      _id: newQ.id,
      title: newQ.name,
      releaseDate: newQ.released,
      image: newQ.background_image,
      apiPageNum: apiPageNum
    };
  }

// let rawgAPIKey = "ccb65d31462d49dba9b0daabc65952e9";
// // Seems to roughly order by popularity / vote count but not quite, good enough though I think.

// // Searches for all games.
// let fetchString = `https://api.rawg.io/api/games?key=${rawgAPIKey}`

// // Searches for a game using a search term.
// fetchString = `https://api.rawg.io/api/games?key=${rawgAPIKey}&search=ultimate%20chicken%20horse`

}




// For Spotify music API.
class NewMusicQuestions extends NewAPIQuestions {
  _apiPageLimit = 50;
  _apiMainPath = `https://api.spotify.com/v1/playlists/0K1696gAQ0HqgTXd37EE3B/tracks?limit=${this._defaultPageSize}`;
  _pageAppend = "&offset=";
  _idField = "id";

  _getNewQObj(newQ, apiPageNum) {
    return {
      _id: newQ.id,
      trackName: newQ.name,
      album: newQ.album.name,
      releaseDate: newQ.album.release_date,
      image: newQ.album.images[0].url,
      previewUrl: newQ.preview_url,
      apiPageNum: apiPageNum
    };
  }

  // another param to limit the fields that are returned.
  // fields=items(track(name,artists[0].name,album.name,album.release_date,album.images[0].url,preview_url))&
  // "https://api.spotify.com/v1/playlists/0K1696gAQ0HqgTXd37EE3B/tracks?limit=20&offset="

  // Fetches from the path for the API, with headers to authorise request.
  async _fetchFromAPI(apiPath) {
    return await fetch(apiPath, {
      headers: {"Authorization": "Bearer " + serverState.spotifyToken.access_token},
    });
  }

  // Gets the array of question items from a json object returned from an API fetch request.
  _getResultsArray(fetchResultsPage) {
    return fetchResultsPage.items.map(item => item.track);
  }

  // Builds api full path in corect format.
  _buildPath(pageNum) {
    const fieldsParam = "&fields=items(track(id,name,artists,preview_url,album(name,release_date,images)))";
    return this._apiMainPath + this._pageAppend + (pageNum - 1) * this._defaultPageSize + fieldsParam;
  }
}






// For openlibrary.org API.
class NewBooksQuestions extends NewAPIQuestions {
}