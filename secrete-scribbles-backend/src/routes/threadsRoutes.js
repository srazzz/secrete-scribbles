import threadControllers from "../controllers/threadsControllers.js"
import express from 'express'
import { validate } from 'express-validation';
import validation from "../dataValidation.js"
import customErrorHandler from "../errorHandler.js";
import verifyToken from "../jwtverify.js"

const router = express.Router()

router.post("/create", validate(validation.createPost), verifyToken, threadControllers.createThread)
router.post("/comment/create", validate(validation.createComment), verifyToken, threadControllers.createComment)
router.post("/getPost", verifyToken, threadControllers.getThreadById)
router.get("/getPopularPosts", verifyToken, threadControllers.getPopularPosts)

// custom error handler for validation errors
router.use(customErrorHandler)

export default router