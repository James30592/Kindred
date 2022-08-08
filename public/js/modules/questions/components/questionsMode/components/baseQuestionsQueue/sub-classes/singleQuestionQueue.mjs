import { BaseQuestionsQueue } from "../baseQuestionsQueue.mjs";



export class SingleQuestionQueue extends BaseQuestionsQueue {
  update(question) {
    this.queue = [question];
  }
}