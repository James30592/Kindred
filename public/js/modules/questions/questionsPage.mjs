export class QuestionsPage {
  questionsModes;
  currQuestionMode;
  categoryTypeName;
  categoryName;
  newAnswers = [];
  updatedAnswers = [];
  recentPostedAnswers = [];
  static #submitAnswersInterval = 600000; // 10 mins

  constructor(qModes, categoryType, category) {
    this.questionsModes = qModes;
    this.categoryType = categoryType;
    this.category = category;
  }

  // Set up the event listeners for all buttons and protocol for uploading 
  // answers data.
  init() {
    // Set up event listeners for buttons within each questions mode.
    for (let qMode in this.questionsModes) {
      qMode.init();
    };

    // When questions page is left / tab closed, post any answers to the server.
    window.addEventListener("beforeunload", async () => {
      this.getCurrQModeAnswers();
      await this.#postAnswers(true);
    });

    // Submit answers every 10 mins, if there are any.
    setInterval(() => {
      this.getCurrQModeAnswers();
      this.#postAnswers();
    }, QuestionsPage.#submitAnswersInterval);
  }

  // Gets the latest new and updated answers from the current questions mode.
  getCurrQModeAnswers() {
    this.newAnswers.push(...this.currQuestionMode.newAnswers);
    this.updatedAnswers.push(...this.currQuestionMode.updatedAnswers);
    this.currQuestionMode.resetAnswers();
  }

  // Remove current question mode: hide it, get the latest answers and post 
  // them to the server.
  removeQmode() {
    this.currQuestionMode.classList.add("fully-hidden");
    this.getCurrQModeAnswers();
  }

  // Set the new questions mode and show it.
  async setQMode(newQMode) {
    this.currQuestionMode = newQMode;
    this.currQuestionMode.classList.remove("fully-hidden");

    // Get all recently done answers, including those sent in the most recent POST.
    const allRecentAnswers = this.getAllRecentAnswers();

    // Update the queue for the questions mode and show the first item in the 
    // queue. Pass in recently changed answers so that the queue can update 
    // considering these if necessary.
    await this.currQuestionMode.updateQueueAndShowFirst(allRecentAnswers);
  }

 
  // Make an array - allRecentAnswers - that consists of the recentPostedAnswers 
  // plus and new / updated answers since then. If new / updated answers cover 
  // anything in the recentPostedAnswers then the recentPostedAnswers version is 
  // overwritten.
  getAllRecentAnswers() {
    // Duplicate of the recentPostedAnswers.
    const allRecentAnswers = this.recentPostedAnswers.slice();

    // All new and updated answers since the last POST.
    const newAndUpdatedAnswers = this.newAnswers.concat(this.updatedAnswers);

    for (let newAnswer of newAndUpdatedAnswers) {
      let indexRecentPostedAnswers = allRecentAnswers.findIndex(ans => {
        ans.questionId === newAnswer.questionId
      });

      if (indexRecentPostedAnswers > 0) {
        allRecentAnswers.splice(indexRecentPostedAnswers, 1, newAnswer);
      }
      else {
        allRecentAnswers.push(newAnswer);
      };
    };

    return allRecentAnswers;
  }

  // Switch between question modes.
  async switchQMode(newQMode) {
    this.removeQmode();
    await this.setQMode(newQMode);
  }
  
  // Resets the new and updated answers for this questions page.
  resetAnswers() {
    this.newAnswers = [];
    this.updatedAnswers = [];
  }

  // POST these answers info to the server.
  async #postAnswers(isChangeOfPage = false) {
    // Set the recently posted answers with the answers that are about to be 
    // posted (even if they are empty as it will necessarily have been a while 
    // since this was called).
    this.recentPostedAnswers = (this.newAnswers.concat(this.updatedAnswers));

    // Check if there are any answers to upload.
    const noNewAnswers = this.newAnswers.length === 0;
    const noUpdatedAnswers = this.updatedAnswers.length === 0;
    if (noNewAnswers && noUpdatedAnswers) return;

    const postRoute = `/questions/${this.categoryTypeName}/${this.categoryName}`;

    const postObj = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        type: "answers", 
        data: this.newAnswers
        // change this to also POST the updated answers and handle this on the backend.................................................
      })
    };
    
    // If moving off the page, send answers data async.
    if (isChangeOfPage) {
      postObj.keepalive = true;
    };
    
    await fetch(postRoute, postObj);

    this.resetAnswers();
  }
}