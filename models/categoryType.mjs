import mongoose from "mongoose";



// Collection of category types and their sub-categories (embedded).
const categorySchema = new mongoose.Schema({
  name: {
    type: String, 
    required: true, 
    unique: true
  },

  isRecommendable: {
    type: Boolean,
    required: true
  }
});



const categoryTypeSchema = new mongoose.Schema({
  name: {
    type: String, 
    required: true, 
    unique: true
  },
  categories: [categorySchema]
});



export const CategoryType = new mongoose.model("CategoryType", categoryTypeSchema);