import mongoose from "mongoose";


const ChatroomSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    lastMessageContent: {
        type: String,
        required: true,
    },
    participantCount: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Chatroom = mongoose.models.Chatroom || mongoose.model("Chatroom", ChatroomSchema);
export default Chatroom;
