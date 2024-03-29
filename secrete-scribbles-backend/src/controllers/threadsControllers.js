import Threads from "../models/threadsModel.js";

function generateRandomAlphanumeric(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// create a thread = create a new post
const createThread = async (req, res) => {
    try {
        const { content, userId } = req.body;
        const randomUserName = generateRandomAlphanumeric(8);

        const threadData = {
            userId,
            userName: randomUserName,
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

const findExistingUserInThread = (uuid) => {

}

// comment on a thread
const createComment = async (req, res) => {
    try {
        const { userId, content, repliedOnId, repliedOnPost } = req.body
        const existingPost = await Threads.findOne({ uuid: repliedOnId })
        if (!existingPost) {
            return res.status(404).json({ error: "Post not found!!" })
        }
        const existingCommentByUser = await Threads.findOne({ repliedOnPost: repliedOnPost, userId: userId })
        // assign same user name for same user in same thread
        let randomUserName
        if (existingCommentByUser) {
            randomUserName = existingCommentByUser.userName
        } else {
            randomUserName = generateRandomAlphanumeric(8);
        }

        const commentData = {
            userId,
            content,
            repliedOnId,
            timeStamp: new Date().toISOString(),
            type: "comment",
            userName: randomUserName,
            repliedOnPost
        }
        const createdComment = await Threads.create(commentData)
        const savedComment = await createdComment.save()
        if (!savedComment) {
            return res.status(200).json({ success: false, message: "Comment not created.Please try again!!" })
        } else {
            // update the parent post with new comments count
            existingPost.repliesCount += 1;
            await existingPost.save();
            return res.status(200).json({ success: true, message: "Commented successfully!!" })
        }
    } catch (err) {
        return res.status(500).json({ error: "Internal server error:" + err })
    }
}

// Function to retrieve all comments recursively
const getAllComments = async (postId) => {
    const comments = await Threads.find({ repliedOnId: postId }).sort({ timeStamp: 1 });
    if (comments.length === 0) {
        return [];
    }
    const nestedComments = await Promise.all(comments.map(async (comment) => {
        const nested = await getAllComments(comment.uuid);
        return { ...comment._doc, comments: nested };
    }));
    return nestedComments;
};

// get thread by id 
const getThreadById = async (req, res) => {
    try {
        const { postId } = req.body;
        const existingPost = await Threads.findOne({ uuid: postId })
        if (existingPost) {
            const allComments = await getAllComments(postId);
            return res.status(404).json({ result: { ...existingPost._doc, comments: allComments }, success: false })
        } else {
            return res.status(404).json({ message: "Post not found", success: false })
        }
    } catch (err) {
        return res.status(500).json({ error: "Internal server error:" + err })
    }
}


const getPopularPosts = async (req, res) => {
    try {
        const popularPosts = await Threads.find({}).sort({ repliesCount: -1 }).limit(5)
        if (popularPosts && popularPosts.length) {
            return res.status(200).json({ success: true, posts: popularPosts })
        }else{
            return res.status(200).json({ success: true, message: "unable to retrieve popular posts" })
        }
    } catch (err) {
        return res.status(500).json({ error: "Internal server error:" + err })
    }
}

export default { createThread, createComment, getThreadById, getPopularPosts }
