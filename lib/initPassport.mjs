import passport from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from "../models/user.mjs";



// Sets up passport and the strategies it uses.
export function initPassport() {
  passport.use(User.createStrategy());

  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/profile"
    },
    function(accessToken, refreshToken, profile, cb) {
      User.findOrCreate(
        {"oAuthInfo.googleId": profile.id},
        {
          email: `PLACEHOLDER - googleId: ${profile.id}`,
          profileName: "PLACEHOLDER",
          isAdmin: false,
          setupComplete: false,
          oAuthInfo: {googleId: profile.id},
          location: {
            placeName: "PLACEHOLDER",
            googlePlaceId: "PLACEHOLDER",
            formattedAddress: "PLACEHOLDER",
            coords: {lat: 0, lng: 0},
            country: {short: "PLACEHOLDER", long: "PLACEHOLDER"},
            fullAddress: ["PLACEHOLDER"]
          }
        },
        function (err, user) {
          return cb(err, user);
        }
      );
    }
  ));

  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
}