import { Router } from "express";
import { loggerTest } from "../controllers/logger.controller.js";
import {  handlePolicies } from "../middewares/auth.middleware.js";

const router = Router();

router.get('/', handlePolicies(['USER', 'ADMIN', 'PREMIUM']), loggerTest);

export default router;