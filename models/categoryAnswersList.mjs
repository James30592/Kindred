import mongoose from "mongoose";



const answerQuestionDetails = new mongoose.Schema({}, 
  {_id: false, strict: false});



// Collection of user answers for each category for each user, linked to user 
// and categoryType through ids.
const answerDetailSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.Mixed, 
    required: true
  },

  skip: {
    type: Boolean, 
    required: true
  },

  answerVal: {
    type: Number,
    min: [0, "Score must be at least 0."],
    max: [10, "Score must be at most 10."]
  },

  questionDetails: answerQuestionDetails
}, {_id: false});



const categoryAnswersListSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User"
  },

  categoryTypeId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "CategoryType", 
    required: true
  },

  categoryType: {
    type: String, 
    required: true
  },

  category: {
    type: String, 
    required: true
  },
  
  answers: [answerDetailSchema]
});



export const CategoryAnswersList = new mongoose.model("CategoryAnswersList", 
  categoryAnswersListSchema);