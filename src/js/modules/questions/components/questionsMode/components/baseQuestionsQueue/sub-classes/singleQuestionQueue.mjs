import { BaseQuestionsQueue } from "../baseQuestionsQueue.mjs";
import { SingleDomQueue } from "../components/singleDomQueue.mjs";



export class SingleQuestionQueue extends BaseQuestionsQueue {

  constructor(qModeMainDiv, categoryType = null, category = null) {
    super(qModeMainDiv, categoryType, category);

    this._domQueue = new SingleDomQueue(qModeMainDiv, categoryType, category);
  }

  update(question) {
    this._resetQueue();
    this._addToQueue([question]);
  }
}