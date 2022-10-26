import { QuestionsQueue } from "../questionsQueue.mjs";



export class AutoQuestionsQueue extends QuestionsQueue {
  endQueueMsg = "You have answered all suggested questions in this category! Use Search to answer more!";
  queueType = "auto";

  // Adds in data on whether previously answered questions should be included.
  _getPostObj(numQuestions, currQueueIds, allRecentQIds, startApiPage) {
    const postObj = super._getPostObj(numQuestions, currQueueIds, allRecentQIds, 
      startApiPage);

    postObj.data.includeAnsweredQs = this.inputPanel.includeAlreadyAnsweredCheckbox.checked;
    return postObj;
  }
}