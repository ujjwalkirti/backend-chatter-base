// import express router
import express, { Request, Response } from "express";
import AuthService from "../services/auth";

const authRouter = express.Router();

const authService = new AuthService();

authRouter.post("/register", async (req: Request, res: Response) => {
    try {
        const { username, dob, gender, ip_address, deviceDetails } = req.body;

        const userDetails = {
            username,
            dob,
            gender,
            ip_address,
        };

        const response = await authService.register(userDetails,deviceDetails);
        if (response.success) {
            res.status(200).send(response);
        } else {
            res.status(400).send(response);
        }
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

export default authRouter;
