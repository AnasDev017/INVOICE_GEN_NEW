import express from "express";
import { getDashboardStats } from "../controller/analyticsController.js";
import { tokenVerifcation } from "../middleware/tokenVerifcation.js";

const analyticsRoutes = express.Router();

analyticsRoutes.get("/getDashboardStats", tokenVerifcation, getDashboardStats);

export default analyticsRoutes;
