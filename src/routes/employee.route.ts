import { Router } from "express";

import {
    createEmployee,
    getAll,
    getById,
    update,
    remove
} from "../controllers/employee.controller";

import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";

const router = Router();

router.use(authenticate);
router.use(requireAdmin);

router.post("/create", createEmployee);

router.get("/", getAll);

router.get("/:id", getById);

router.put("/:id", update);

router.delete("/:id", remove);

export default router;