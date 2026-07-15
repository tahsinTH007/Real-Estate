import express from "express";
import { createManager, getManager } from "../controllers/managerControllers";

const router = express.Router();

router.post("/", createManager);
router.get("/:cognitoId", getManager);

export default router;
