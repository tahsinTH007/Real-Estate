import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { getLeases } from "../controllers/leaseControllers";

const router = express.Router();

router.get("/", authMiddleware(["manager", "tenant"]), getLeases);

export default router;
