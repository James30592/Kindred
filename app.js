import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import { User } from "./models/user.mjs"
import { router } from "./controllers/controllers.mjs";
import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import * as dotenv from 'dotenv';
import { serverState } from './lib/serverState/serverState.mjs';



dotenv.config()

const session = require("express-session");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(session({
  secret: process.env.EXPRESS_SESSION,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use("/", router);

mongoose.connect("mongodb://127.0.0.1:27017/kindred02");

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen(3000, () => {console.log("Server running on port 3000.")});
serverState.init();