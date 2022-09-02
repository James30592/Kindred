import { fadeFromTo } from "../sharedJs/utils.mjs";



// Used by the recommendations and find kindred pages to fade between loaders 
// and new content when refreshing recommendations / kindred.
export const fadeContentMixin = {

  _rebuildContentDiv(data) {
    this._clearContentDiv();
    this._buildContentDiv(data);
  },

  _showLoader() {
    return fadeFromTo(this._contentDiv, this._loader);
  },

  _hideLoader() {
    return fadeFromTo(this._loader, this._contentDiv);
  },

  async handleUpdateBtnClick() {
    const loaderShown = this._showLoader();
    const data = await this._getUpdatedSourceData();

    // Don't hide the loader / show the content until both the loader has 
    // finished faded in AND the doStuff has been completed.
    loaderShown.then(() => {
      this._rebuildContentDiv(data);
      this._hideLoader();
    });
  }

}