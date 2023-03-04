import express from 'express'
import { deleteUserProfile, loginUser, registerUser, updateUserProfile } from '../Controllers/UserController.js';
import { protect } from '../Midllewares/Auth.js';

const router = express.Router();

router.post("/",registerUser);
router.post("/login",loginUser);

router.put("/",protect,updateUserProfile);
router.delete("/",protect,deleteUserProfile);

export default router;