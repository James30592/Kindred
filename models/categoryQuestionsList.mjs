import mongoose from "mongoose";



const questionSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },

  text: {
    type: String,
    required: false
  },

  shortText: {
    type: String,
    required: false
  }
  
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

  apiInfo: apiInfo,
  questions: [questionSchema]
});



export const CategoryQuestionsList = new mongoose.model("CategoryQuestionsList", 
  categoryQuestionsListSchema);