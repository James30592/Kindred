import { NewAPIQuestions } from "../newAPIQuestions.mjs";



// For TMDB movies / TV.
export class NewFilmsTVQuestions extends NewAPIQuestions {
  _apiPageLimit = 500;
  _apiKey = "84c6fe840210161c52e9a52c9cc129bb";
  _pageAppend = "&page=";
  _idField = "id";
  #apiCategory;
  _searchAppend = "&query=";

  constructor(catTypeName, catName, userAnswers, queueReqInfo) {
    super(catTypeName, catName, userAnswers, queueReqInfo);
    this. #apiCategory = catName === "Films" ? "movie" : "tv";
    this._apiMainPath = `https://api.themoviedb.org/3/discover/${this.#apiCategory}?sort_by=vote_count.desc&api_key=`;
    this._apiSearchPath = `https://api.themoviedb.org/3/search/${this.#apiCategory}?&api_key=`;
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

  // Get the total number of page results returned from the API.
  _getResultPagesNum(fetchResultsPage) {
    return fetchResultsPage.total_pages;
  }
}