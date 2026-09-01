import { Router } from "express";

import { adminAttendanceReport } from "../controllers/attendance.controller";

import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";

const router = Router();

router.use(authenticate);
router.use(requireAdmin);

router.get("/admin/attendance", adminAttendanceReport);

export default router;