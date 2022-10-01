import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";



const locationSchema = new mongoose.Schema({
  placeName: {
    type: String, 
    required: true
  },

  googlePlaceId: {
    type: String, 
    required: true
  },

  formattedAddress: {
    type: String, 
    required: true
  },

  coords: {
    lat: {
      type: Number, 
      required: true
    },
    lng: {
      type: Number, 
      required: true
    }
  },

  country: {
    short: {
      type: String, 
      required: true
    },
    long: {
      type: String, 
      required: true
    }
  },

  fullAddress: [{
    type: String, 
    required: true
  }]

}, {_id: false});



// Collection of users.
const userSchema = new mongoose.Schema({
  email: {
    type: String, 
    required: true, 
    unique: true
  },

  profileName: {
    type: String, 
    required: true
  },

  location: {
    type: locationSchema, 
    required: true
  },

  isAdmin: {
    type: Boolean,
    required: true
  }
});

userSchema.plugin(passportLocalMongoose, {usernameField: "email"});



export const User = new mongoose.model("User", userSchema);