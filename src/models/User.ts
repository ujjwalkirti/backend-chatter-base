import mongoose from "mongoose";

// User model, index should be on username
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    dob: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    ip_address: {
        type: String,
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

// check if model already exists, if not, create a new one
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
