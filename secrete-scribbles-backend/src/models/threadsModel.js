import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

// Define a schema
const threadSchema = new mongoose.Schema({
    uuid: {
        type: String,
        default: uuidv4,
        unique: true
    },
    userId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    repliesCount: {
        type: Number,
        default: 0
    },
    // type of the replied on is it a thread or comment
    type: {
        type: String,
        required: true,
        default: "post"
    },
    repliedOnId: {
        type: String,
        required: true,
        default: "null"
    },
    content: {
        type: String,
        required: true
    },
    timeStamp:{
        type:String,
        required:true
    }
});

// Create a model based on the schema
const Threads = mongoose.model('Threads', threadSchema);

export default Threads
