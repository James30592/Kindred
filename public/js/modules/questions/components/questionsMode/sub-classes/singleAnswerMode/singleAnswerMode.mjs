import { QuestionsMode } from "../../questionsMode.mjs";

import { SingleQuestionQueue } from "../../components/baseQuestionsQueue/\
sub-classes/singleQuestionQueue.mjs";



export class SingleAnswerMode extends QuestionsMode {
  name = "single";
  _qSource;

  constructor(mainDiv, qSource) {
    super(mainDiv);
    this.questionsQueue = new SingleQuestionQueue();
    this._qSource = qSource;
  }

  init() {
    super.init();

    this._qSource.addEventListener("answerSingleQ", evt => {
      this._handleClickSingleQ(evt);
    });
  }

  // Save answer information.
  async answerQuestion(event) {
    // Get the answer object as it should be stored in the DB.
    const answerObj = this.getAnswerObj(event); 

    // Emit event to be picked up by the questions page.
    this.dispatchEvent(
      new CustomEvent("answeredQ", {detail: {answerObj: answerObj}})
    );

    // Hide the answer ui panel.
    this.answerUiPanel.mainDiv.classList.add("fully-hidden");
  }

  _handleClickSingleQ(evt) {
    // Get the question from this item and make it the queue contents.
    const thisQItem = evt.detail.question;
    const thisQuestion = this._makeQuestion(thisQItem);
    this.questionsQueue.update(thisQuestion);

    // Show the answer ui panel.
    this.answerUiPanel.mainDiv.classList.remove("fully-hidden");

    // Updates the displayed question in the answer UI panel with the new first 
    // queue item.
    this._showCurrQ();
  }
}