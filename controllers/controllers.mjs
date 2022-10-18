import express from "express";
import "express-async-errors";

import { defaultRouter } from "./default.mjs";
import { homeRouter } from "./home.mjs";
import { registerRouter } from "./register.mjs";
import { loginRouter } from "./login.mjs";
import { profileRouter } from "./profile.mjs";
import { logoutRouter } from "./logout.mjs";
import { findKindredRouter } from "./findKindred.mjs";
import { recommendationsRouter } from "./recommendations.mjs";
import { adminRouter } from "./admin.mjs";
import { questionsMenuRouter } from "./questions-menu.mjs";
import { questionsRouter } from "./questions/questions.mjs";
import { pageNotFoundRouter } from "./pageNotFound.mjs";
import { errHandler } from "./errorHandler.mjs";
import { authRouter } from "./oAuth/oAuth.mjs";
import { completeOAuthAcctRouter } from "./oAuth/completeOAuthAcct.mjs";



export const router = express.Router();

router.use("*", defaultRouter);
router.use("/", homeRouter);
router.use("/register", registerRouter);
router.use("/login", loginRouter);
router.use("/auth", authRouter);
router.use("/completeOAuthAcct", completeOAuthAcctRouter);
router.use("/profile", profileRouter);
router.use("/logout", logoutRouter);
router.use("/find-kindred", findKindredRouter);
router.use("/recommendations", recommendationsRouter);
router.use("/admin", adminRouter);
router.use("/questions-menu", questionsMenuRouter);
router.use("/questions", questionsRouter);
router.use(pageNotFoundRouter);
router.use(errHandler);