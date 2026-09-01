import { Router } from "express";

import {
    punchIn,
    punchOut,
    myAttendance,
    adminAttendanceReport
} from "../controllers/attendence.controller";

import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin, requireEmployee } from "../middleware/role.middleware";

const router = Router();

router.use(authenticate);

router.get(
    "/admin",
    requireAdmin,
    adminAttendanceReport
);

router.use(requireEmployee);

router.post("/punch-in", punchIn);

router.post("/punch-out", punchOut);

router.get("/my", myAttendance);

export default router;