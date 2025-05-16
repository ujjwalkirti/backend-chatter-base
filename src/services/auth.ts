import { MongooseError } from "mongoose";
import jwt from "jsonwebtoken";
import Token from "../models/Token";

class AuthService {
    constructor() { }

    async register(userDetails: any, deviceDetails: any) {
        try {
            if (!userDetails || Object.keys(userDetails).length === 0) {
                return {
                    success: false,
                    message: "User details not provided",
                };
            }

            if (!deviceDetails || Object.keys(deviceDetails).length === 0) {
                return {
                    success: false,
                    message: "Device details not provided",
                };
            }

            // generate device fingerprint
            const deviceFingerprint = JSON.stringify(deviceDetails);

            // check for existing valid token
            const existingToken = await Token.findOne({ username: userDetails.username, expired: false, deviceFingerprint });
            if (existingToken) {
                // check if token is expired
                jwt.verify(existingToken.token, process.env.ACCESS_TOKEN_SECRET!, async (err: any, decoded: any) => {
                    if (err) {
                        // generate a new token
                        const token = jwt.sign(userDetails, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "1d" });

                        // update the token
                        existingToken.token = token;

                        await existingToken.save();

                        return {
                            success: true,
                            message: "User registered successfully",
                            data: {
                                token,
                                user: userDetails.username
                            }
                        }
                    }
                })
                return {
                    success: true,
                    message: "User already registered",
                    data: {
                        token: existingToken.token,
                        user: existingToken.username
                    }
                };
            } else {
                //  generate a token
                const token = jwt.sign(userDetails, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "1d" });
                const newToken = new Token({ username: userDetails.username, token, deviceFingerprint });
                await newToken.save();
                return {
                    success: true,
                    message: "User registered successfully",
                    data: {
                        token,
                        user: userDetails.username
                    }
                }
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
