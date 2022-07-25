import { NewAPIQuestions } from "../newAPIQuestions.mjs";



// For RAWG video games API.
export class NewVideoGamesQuestions extends NewAPIQuestions {
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
}