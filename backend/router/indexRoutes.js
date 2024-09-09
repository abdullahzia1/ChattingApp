import express from "express";
const appRoutes = express.Router();

import userRoutes from "./userRoutes.js";
import todoRoutes from "./todoRoutes.js";

// @desc user Routes separated
appRoutes.use("/users", userRoutes);
appRoutes.use("/todos", todoRoutes);

export default appRoutes;
