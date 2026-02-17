import  express  from "express";
import { login, logout, sendUserData, signUp , updateProfile, verifyEmailCode, verifyMail} from "../controller/authController.js";
import { tokenVerifcation } from "../middleware/tokenVerifcation.js";
// import {upload, uplaodFile } from "../controller/profileUploderController.js";
const authRoutes = express.Router()
authRoutes.post('/signUp',signUp)
authRoutes.post('/login',login)
authRoutes.post('/verifyEmail',verifyMail)
authRoutes.post('/verifyEmailCode',verifyEmailCode)
authRoutes.post('/logout',logout)
authRoutes.post('/updateProfile',updateProfile)
// authRoutes.post('/uploadProfilePhoto',upload.single("file"),uplaodFile)
authRoutes.get("/api/me", tokenVerifcation, sendUserData)

 
export default authRoutes