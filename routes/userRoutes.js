import express from 'express';
import * as userController from '../controllers/UserController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { validatePayload } from '../middleware/validatePayload.js';
import { signupSchema, loginSchema, updateUserSchema } from "../validators/userValidator.js";

const router = express.Router();

router.post("/signup", validatePayload(signupSchema), userController.signup);
router.post("/login", validatePayload(loginSchema), userController.login);
router.post('/refresh', userController.refreshToken);
router.post('/logout/:id', verifyToken, userController.logout);

router.get('/', verifyToken, userController.getAllUsers);
router.get('/:id', verifyToken, userController.getUserById);
router.put("/:id", verifyToken, validatePayload(updateUserSchema), userController.updateUser);
router.delete('/:id', verifyToken, userController.deleteUser);

export default router;



