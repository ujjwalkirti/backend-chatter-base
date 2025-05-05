import { MongooseError } from "mongoose";
import User from "../models/User";

class AuthService {
    constructor() { }

    async register(userDetails: any) {
        try {
            if (!userDetails || Object.keys(userDetails).length === 0) {
                return {
                    success: false,
                    message: "User details not provided",
                };
            }

            // check if username already exists
            const existingUser = await User.findOne({ username: userDetails.username });
            if (existingUser) {
                return {
                    success: false,
                    message: "Username already exists",
                    user: existingUser
                };
            }

            const newUser = await User.create(userDetails);

            return {
                success: true,
                message: "User registered successfully",
                user: newUser
            }
        } catch (error) {
            // if there is some mongodb generated error
            if (error instanceof MongooseError) {
                return {
                    success: false,
                    message: error.message,
                };
            } else {
                console.log(error);
                return {
                    success: false,
                    message: "Internal Server Error",
                    error: error
                };
            }
        }
    }
}


export default AuthService;
