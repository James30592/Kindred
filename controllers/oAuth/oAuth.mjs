import express from "express";
import { authGoogleRouter } from "./strategies/google.mjs";



export const authRouter = express.Router();

authRouter.use("/google", authGoogleRouter);