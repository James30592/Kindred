import { router } from "./controllers/controllers.mjs";
import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import passport from "passport";
import * as dotenv from 'dotenv';
import { serverState } from './lib/serverState/serverState.mjs';
import { initPassport } from './lib/initPassport.mjs';


 
dotenv.config()

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
initPassport();
serverState.init();

app.listen(3000, () => {console.log("Server running on port 3000.")});