// Object to represent current mode of answering questions, eg. auto queue or 
// search queue. Contains a questionsQueue object and an input panel (contains 
// DOM elements to change criteria used to populate queue, eg. include already 
// answered questions toggle checkbox).
export class QuestionsMode {
  questionsQueue;
  inputPanel;
  currQUiPanel;

  constructor(queue, panel) {
    this.questionsQueue = queue;
    this.inputPanel = panel;
    this._initSearchPanel(panel);
  }
}






// 
export class AutoQMode extends QuestionsMode {
  inclPrevAnswersCheckbox;

  _initSearchPanel(panel) {
    this.inclPrevAnswersCheckbox = panel.querySelector(".incl-prev-ans");
  }
}





// 
export class SearchQMode extends QuestionsMode {
  inclPrevAnswersCheckbox;
  searchInput;
  searchBtn;

  _initSearchPanel(panel) {
    this.inclPrevAnswersCheckbox = panel.querySelector(".incl-prev-ans");
    this.searchInput = panel.querySelector(".search-term");
    this.searchBtn = panel.querySelector(".search-btn");

    this.searchBtn.addEventListener("click", async () => {
      await questionsPanel.newSearch(this.searchInput.value);
    })
  }
}