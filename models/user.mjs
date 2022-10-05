import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
const findOrCreate = require("mongoose-findorcreate");



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


// Only recorded for oAuth accounts.
const oAuthInfoSchema = new mongoose.Schema({
  // googleId: id
  // or
  // facebookId: id
  // etc.
}, {_id: false, strict: false});


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
  },

  oAuthInfo: {
    type: oAuthInfoSchema,
    required: false
  },

  // For oAuth accounts, only true once they have also provided profile name 
  // and location seperately to oAth.
  setupComplete: {
    type: Boolean,
    required: true
  }
});

userSchema.plugin(passportLocalMongoose, {usernameField: "email"});
userSchema.plugin(findOrCreate);

export const User = new mongoose.model("User", userSchema);