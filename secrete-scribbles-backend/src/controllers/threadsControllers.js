import Threads from "../models/threadsModel.js";

const createThread = async (req, res) => {
    try {
        const { content, userId } = req.body;
        const threadData = {
            userId,
            userName: "random1",
            content,
            timeStamp: new Date().toISOString()
        }
        const thread = await Threads.create(threadData)
        const savedThread = await thread.save()
        if (!savedThread) {
            return res.status(200).json({ success: false, message: "Post not created.Try Again!" })
        } else {
            res.status(200).json({ success: true, message: "Post created successfully!!" })
        }
    } catch (err) {
        return res.status(500).json({ error: "Internal server error:" + err })
    }
}

const createComment = async (req, res) => {
    try {
        const { userId, content, repliedOnId } = req.body
        const existingPost = await Threads.findOne({ uuid: repliedOnId })
        if (!existingPost) {
            return res.status(404).json({ error: "Post not found!!" })
        }
        const commentData = {
            userId,
            content,
            repliedOnId,
            timeStamp: new Date().toISOString(),
            type: "comment",
            userName: "randomComment"
        }
        const createdComment = await Threads.create(commentData)
        const savedComment = await createdComment.save()
        if (!savedComment) {
            return res.status(200).json({ success: false, message: "Comment not created.Please try again!!" })
        } else {
            return res.status(200).json({ success: true, message: "Commented successfully!!" })
        }
    } catch (err) {
        return res.status(500).json({ error: "Internal server error:" + err })
    }
}

export default { createThread, createComment }
