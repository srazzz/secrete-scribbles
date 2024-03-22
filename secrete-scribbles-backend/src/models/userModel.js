import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

// Define a schema
const usersSchema = new mongoose.Schema({
    uuid: {
        type: String,
        default: uuidv4,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    joinedOn: {
        type: String,
        default: null
    }
});

// Create a model based on the schema
const users = mongoose.model('Users', usersSchema);

export default users
