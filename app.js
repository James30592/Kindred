import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import * as models from "./models/models.mjs";
import {router} from "./controllers/controllers.mjs";
import {ServerState} from "./lib/serverState/serverState.mjs";

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/", router);

mongoose.connect("mongodb://127.0.0.1:27017/kindred02");

passport.use(models.User.createStrategy());
passport.serializeUser(models.User.serializeUser());
passport.deserializeUser(models.User.deserializeUser());

app.listen(3000, function(){
  console.log("Server running on port 3000.");
});

export const serverState = new ServerState();
serverState.init();