import authControllers from "../controllers/authControllers.js"
import express from 'express'
import { validate } from 'express-validation';
import validation from "../dataValidation.js"
import customErrorHandler from "../errorHandler.js";

const router = express.Router()

router.post("/signup", validate(validation.signUpAndLogin), authControllers.signUp)
router.get("/users", authControllers.getAllUsers)
router.post("/login", validate(validation.signUpAndLogin), authControllers.login)
router.post("/forgot-password", validate(validation.forgotPassword), authControllers.forgotPassword)
router.post("/verify-otp", validate(validation.verifyOtp), authControllers.validateAndSavePassword)

// custom error handler for validation errors
router.use(customErrorHandler)

export default router