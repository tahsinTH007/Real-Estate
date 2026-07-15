import express from "express";
import { getManager } from "../controllers/managerControllers";

const router = express.Router();

router.get("/:cognitoId", getManager);

export default router;
