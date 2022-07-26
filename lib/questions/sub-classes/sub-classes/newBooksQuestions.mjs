import { NewAPIwDBQuestions } from "../newAPIwDBQuestions.mjs";



// For openlibrary.org API.
export class NewBooksQuestions extends NewAPIwDBQuestions {
  _apiSearchPath = `http://openlibrary.org/search.json?fields=key,title,author_name,first_publish_year,cover_i`;
  _pageAppend = "&offset=";
  _idField = "key";
  _searchAppend = "&q=";
  _defaultPageSize = 100;

  // Creates question object, individualised for each category as necessary.
  _getNewQObj(newQ) {
    const newQObj = {
      title: newQ?.title
    };

    if (this._qMode ==="auto") {
      newQObj._id = newQ._id;
      newQObj.author = newQ?.author;
      newQObj.image = newQ?.image;
    }
    else {
      newQObj._id = newQ.key;
      newQObj.author = newQ?.author_name?.[0];
      newQObj.image = newQ?.cover_i;
    };

    return newQObj;
  }

  // Get the total number of page results returned from the API.
  _getResultPagesNum(fetchResultsPage) {
    const numPages = Math.ceil(fetchResultsPage.numFound / this._defaultPageSize);
    return numPages;
  }

  // Builds api full path in corect format.
  _buildPath(correctPath, searchAppendText, pageNum) {
    return correctPath + this._pageAppend + (pageNum - 1) * this._defaultPageSize + searchAppendText;
  }

  // Gets the array of question items from a json object returned from an API fetch request.
  _getResultsArray(fetchResultsPage) {
    return fetchResultsPage.docs;
  }  

  // Gets the id for the potential new question.
  _getNewQId(potentialNewQ) {
    if (this._qMode === "search") {
      return potentialNewQ[this._idField];
    }
    else {
      return potentialNewQ._id;
    };
  }
}