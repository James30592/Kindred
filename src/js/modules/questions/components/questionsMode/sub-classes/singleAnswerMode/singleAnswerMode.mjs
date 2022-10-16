import { QuestionsMode } from "../../questionsMode.mjs";

import { SingleQuestionQueue } from "../../components/baseQuestionsQueue/\
sub-classes/singleQuestionQueue.mjs";

import { CentreModal } from "../../../../../centreModal.mjs";



export class SingleAnswerMode extends QuestionsMode {
  name = "single";
  _qSource;
  _answerUiModal;

  constructor(mainDiv, qSource, btn = null) {
    super(mainDiv, btn);
    this.questionsQueue = new SingleQuestionQueue(mainDiv);
    this._qSource = qSource;

    const modalWrapper = mainDiv.querySelector(".centre-modal-wrapper");
    this._answerUiModal = new CentreModal(modalWrapper);
  }

  init() {
    super.init();

    this._qSource.addEventListener("answerSingleQ", evt => {
      this._handleClickSingleQ(evt);
    });

    this._answerUiModal.init();
  }

  // Save answer information.
  answerQuestion(event) {
    const currQuestion = this.questionsQueue.removeQueueItem(0, true);

    // Get the answer object as it should be stored in the DB.
    const answerObj = this.getAnswerObj(event, currQuestion); 

    // Emit event to be picked up by the questions page.
    this.dispatchEvent(
      new CustomEvent("answeredQ", {detail: {answerObj: answerObj}})
    );

    // Hide the answer ui panel.
    this._answerUiModal.hide();

    return answerObj;
  }

  _handleClickSingleQ(evt) {
    // Get the question from this item and make it the queue contents.
    const thisQItem = evt.detail.question;
    const thisQuestion = this._makeQuestion(thisQItem);
    this.questionsQueue.update(thisQuestion);

    // Show the answer ui panel.
    this._answerUiModal.show();

    // Updates the displayed question in the answer UI panel with the new first 
    // queue item.
    this._showCurrQ();
  }
}