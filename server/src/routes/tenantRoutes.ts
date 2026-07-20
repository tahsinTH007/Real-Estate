import express from "express";
import { getTenant } from "../controllers/tenantControllers";

const router = express.Router();

router.get("/:cognitoId", getTenant);

export default router;
