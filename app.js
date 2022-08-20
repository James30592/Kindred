import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import * as models from "./models/models.mjs";
import { router } from "./controllers/controllers.mjs";
import express from "express";
import mongoose from "mongoose";
import passport from "passport";
const session = require("express-session");



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

app.listen(3000, () => {console.log("Server running on port 3000.")});