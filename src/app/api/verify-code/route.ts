import connectDb from "@/lib/connnectdb";
import User from "@/models/user";
import {z} from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { messageSchema } from "@/schemas/messageSchema";

export async function POST(request:Request) {
    await connectDb();
    try {
        const {username, code} = await request.json();
        const decodedUsername = decodeURIComponent(username)
        const user = await User.findOne({username: decodedUsername})
        if(!user){
            return  Response.json({
                success: false,
                message: 'User not found'
            },{
                status: 400
            })
        }

        const iscodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if(iscodeValid && isCodeNotExpired){
            user.isVerified = true;
            await user.save();

            return Response.json(
                {
                    success: true,
                    message: "Account Verified successfully"
                },
                {status: 200}
            )

        } else if(!isCodeNotExpired){
            return  Response.json({
                success: false,
                message: 'session expired please signup again to get a new code'
            },{
                status: 400
            })
        } else{
            return  Response.json({
                success: false,
                message: 'Incorrect verification code'
            },{
                status: 400
            })
        }


    } catch (error) {
        console.error("Error checking username",error);
        return  Response.json({
            success: false,
            message: 'Username is already taken'
        },{
            status: 400
        })
    }
}