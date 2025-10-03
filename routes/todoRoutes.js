import express from "express";
import * as todoController from "../controllers/TodoController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, todoController.createTodo);
router.get("/", verifyToken, todoController.getTodos);
router.get("/:id", verifyToken, todoController.getTodoById);
router.put("/:id", verifyToken, todoController.updateTodo);
router.delete("/:id", verifyToken, todoController.deleteTodo);

export default router;
