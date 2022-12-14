import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import { router } from "./controllers/controllers.mjs";
import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import passport from "passport";
import * as dotenv from 'dotenv';
import { serverState } from './lib/serverState/serverState.mjs';
import { initPassport } from './lib/initPassport.mjs';
const MemoryStore = require("memorystore")(session);

 
dotenv.config()

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(session({
  cookie: {maxAge: 86400000},
  store: new MemoryStore({
    checkPeriod: 86400000
  }),
  secret: process.env.EXPRESS_SESSION,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use("/", router);

// mongoose.connect("mongodb://127.0.0.1:27017/kindred02");
mongoose.connect(`mongodb+srv://${process.env.MONGODB_ATLAS_USER}:${process.env.MONGODB_ATLAS_PASS}@cluster0.lt6ndky.mongodb.net/kindred`);
initPassport();
serverState.init();

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, () => {console.log(`Server running on port ${port}.`)});