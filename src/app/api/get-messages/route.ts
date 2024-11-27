import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import connectDb from "@/lib/connnectdb";
import userModel from "@/models/user";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await connectDb();

    const session = await getServerSession(authOptions);
    const user: User = session?.user;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated",
            },
            { status: 401 }
        );
    }

    const userId = new mongoose.Types.ObjectId(user._id); //convert string into objectid
    try {
        const user = await userModel.aggregate([
            {
                $match: {
                    id: userId,
                },
            },
            {
                $unwind: "$messages",//converts array into a document
            },
            {
                $sort : {"messages.createdAt": -1}
            },
            {
                $group : {_id: "$_id", messages: {$push : "$messages"}}
            }
        ]);
        if(!user || user.length === 0 ){
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 401 }
            );
        }

        return Response.json(
            {
                success: true,
                messages: user[0].messages,// send messages data
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("Failed to get Messages")
        return Response.json(
            {
                success: false,
                message: "Failed to get Messages"
            },
            {status: 500}
        )
    }
}
