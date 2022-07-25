import { NewAPIQuestions } from "../newAPIQuestions.mjs";
import { serverState } from '../../../../app.js';



// For Spotify music API.
export class NewMusicQuestions extends NewAPIQuestions {
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
  _buildPath(correctPath, searchAppendText, pageNum) {
    const fieldsParam = "&fields=items(track(id,name,artists,preview_url,album(name,release_date,images)))";
    return correctPath + this._pageAppend + (pageNum - 1) * this._defaultPageSize + fieldsParam + searchAppendText;
  }
}