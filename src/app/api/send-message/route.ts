import connectDb from "@/lib/connnectdb";
import userModel from "@/models/user";

import { Message } from '@/models/user';

export async function POST(request:Request) {
    await connectDb();
    const { username , content } = await request.json();
    try {
        const user = await userModel.findOne({username});
        
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }

        //is user accpeing the messages
        if (!user.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    message: "User is not accepting Messages",
                },
                { status: 403 }
            );   
        }
        const newMessage = {content,createdAt : new Date()};
        user.messages.push(newMessage as Message)//gurennte that it is a in string
        await user.save();
        return Response.json(
            {
                success: true,
                message: "Message sent successfully",
            },
            { status: 200 }
        );

    } catch (error) {
        console.log("Failed to send Messages",error)
        return Response.json(
            {
                success: false,
                message: "Failed to send Messages"
            },
            {status: 500}
        )
    }
}