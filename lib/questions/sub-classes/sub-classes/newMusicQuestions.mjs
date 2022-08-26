import { NewAPIQuestions } from "../newAPIQuestions.mjs";
import { serverState } from "../../../serverState/serverState.mjs";



// For Spotify music API.
export class NewMusicQuestions extends NewAPIQuestions {
  _apiPageLimit = 50;
  _apiMainPath = `https://api.spotify.com/v1/playlists/0K1696gAQ0HqgTXd37EE3B/tracks?limit=${this._defaultPageSize}`;
  _apiSearchPath = `https://api.spotify.com/v1/search?limit=${this._defaultPageSize}&type=track`;
  _pageAppend = "&offset=";
  _idField = "id";
  _searchAppend = "&q=";

  _getNewQObj(newQ) {
    return {
      _id: newQ.id,
      trackName: newQ?.name,
      artist: newQ?.artists?.[0]?.name,
      album: newQ?.album?.name,
      releaseDate: newQ?.album?.release_date,
      image: newQ?.album?.images?.[1]?.url,
      previewUrl: newQ?.preview_url
    };
  }

  // Fetches from the path for the API, with headers to authorise request.
  async _fetchFromAPI(apiPath) {
    return await fetch(apiPath, {
      headers: {"Authorization": "Bearer " + serverState.spotifyToken.access_token},
    });
  }

  // Gets the array of question items from a json object returned from an API fetch request.
  _getResultsArray(fetchResultsPage) {
    if (this._qMode === "search") {
      return fetchResultsPage.tracks.items;
    }
    else {
      return fetchResultsPage.items.map(item => item.track);
    };
  }

  // Builds api full path in corect format.
  _buildPath(correctPath, searchAppendText, pageNum) {
    const fieldsParam = this.#getFieldsParam();
    return correctPath + this._pageAppend + (pageNum - 1) * this._defaultPageSize + fieldsParam + searchAppendText;
  }

  // Only need certain fields from the API result.
  #getFieldsParam() {
    let fieldsParam = "";
    if (this._qMode === "auto") {
      fieldsParam = `&fields=items(track(id,name,artists,preview_url,album(name,release_date,images))),total`;
    };

    return fieldsParam;
  }

  // Get the total number of page results returned from the API.
  _getResultPagesNum(fetchResultsPage) {
    const numPages = Math.ceil(fetchResultsPage.total / this._defaultPageSize);
    return numPages;
  }
}