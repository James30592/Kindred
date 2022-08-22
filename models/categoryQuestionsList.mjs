import mongoose from "mongoose";



// - removed for now to just do 0 - 10 numeric answers--------------------

// // Collection of questions for each category, linked to categoryType and 
// // category by id.
// const possAnswerSchema = new mongoose.Schema({
//   ansId: Number,
//   ansText: String
//   // ansPerc: Number     perhaps store this here, or some other type variable if a non-quantifiable question.
// }, {_id: false});



const questionSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.Mixed, 
    required: true
  },

  text: {
    type: String, 
    required: false
  },
  // possAnswers: [possAnswerSchema]                  - removed for now to just do 0 - 10 numeric answers
}, {strict: false});

const apiInfo = new mongoose.Schema({
  _id: {type: Number, required: true},
  name: String
});



const categoryQuestionsListSchema = new mongoose.Schema({
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

  // recommendable: Boolean,
  // isSourceAPI: { type: Boolean, required: true },                      - not needed anymore
  apiInfo: apiInfo,
  questions: [questionSchema]
  // possAnswers: [{ type: Schema.Types.ObjectId, ref: "PossAnswer" }]      - default possAnswers for this category, removed for now
});



export const CategoryQuestionsList = new mongoose.model("CategoryQuestionsList", 
  categoryQuestionsListSchema);