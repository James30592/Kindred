import express from "express";
import { User } from "../models/user.mjs";
import passport from "passport";
import { logoutIfAlreadyLoggedIn } from "./logout.mjs";



export const registerRouter = express.Router();

registerRouter.get("/", function(req, res) {
  res.render("pages/register");
});


registerRouter.post("/", 
  function(req, res, next) {
    logoutIfAlreadyLoggedIn(req, res, next);
  },

  function(req, res) {
    const thisLoc = getLocObj(req.body);

    User.register(
      {
        email: req.body.email,
        profileName: req.body["profile-name"],
        location: thisLoc,
        isAdmin: false,
        setupComplete: true
      },

      req.body.password,

      function(err, user){
        if (err) {
          console.log(err);
          res.redirect("/register");
        }
        else {
          passport.authenticate("local")(req, res, function(){
            console.log("going to profile");
            res.redirect("/profile");
          });
        };
      }
    );
  }
);


// Creates an address object ready for the database, from the registration page 
// form data.
export function getLocObj(form) {
  const thisLocObj = {
    placeName: form.placeName,
    googlePlaceId: form.googlePlaceId,
    formattedAddress: form.formattedAddress,

    coords: {
      lat: Number(form.lat),
      lng: Number(form.lng)
    },

    country: {
      short: form.countryShort,
      long: form.countryLong
    },

    fullAddress: []
  };

  // Get all the full address lines.
  for (let field in form) {
    const isAddressField = field.slice(0, 11) === "fullAddress";
    if (isAddressField) {
      const addressLine = field.slice(11);
      thisLocObj.fullAddress[addressLine] = form[field];
    };
  };

  return thisLocObj; 
}