import { Joi } from 'express-validation';

const signUpAndLogin = {
    body: Joi.object({
        email: Joi.string()
            .email()
            .required(),
        password: Joi.string()
            .required(),
    }),
}

const forgotPassword = {
    body: Joi.object({
        email: Joi.string().email().required()
    })
}

const verifyOtp = {
    body: Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.string().required()
    })
}

const createPost = {
    body: Joi.object({
        content: Joi.string().required()
    }),
}

const createComment = {
    body: Joi.object({
        content: Joi.string().required(),
        repliedOnId: Joi.string().required(),
        repliedOnPost: Joi.string().required(),
    })
}

export default {
    signUpAndLogin,
    forgotPassword,
    verifyOtp,
    createPost,
    createComment
}