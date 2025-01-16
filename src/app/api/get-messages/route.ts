import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import connectDb from "@/lib/connnectdb";
import userModel from "@/models/user";
import mongoose from "mongoose";

export async function GET() {
    await connectDb();

    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!session || !user) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Not Authenticated",
            }),
            { status: 401, headers: { "Content-Type": "application/json" } }
        );
    }

    const userId = new mongoose.Types.ObjectId(user._id); 
    try {
        const userData = await userModel.aggregate([
            {
              $match: {
                _id: userId,
              },
            },
            {
              $unwind: "$messages",
            },
            {
              $sort: {
                "messages.createdAt": -1,
              },
            },
            {
              $group : {_id: "$_id", messages: {$push : "$messages"}}
            }
          ]);

        return new Response(
            JSON.stringify({
                success: true,
                data: userData,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error fetching user data",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
