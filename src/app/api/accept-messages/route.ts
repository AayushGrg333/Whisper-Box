import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import connectDb from "@/lib/connnectdb";
import userModel from "@/models/user";
import { User } from "next-auth"

export async function POST(request: Request) {
    await connectDb()

    const session  = await getServerSession(authOptions)
    const user:User = session?.user;
    console.log(session)

    if(!session || !session.user){
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            {status: 401}
        )
    }

    const userId = user._id;
    const { acceptMessages } = await request.json()

    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,{isAcceptingMessage :acceptMessages},
            {new: true}//returns the updated new value
        )
        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "failed to update user"
                },
                {status: 401}
            )
        }

        return Response.json(
            {
                success: true,
                message: "Mesage Acceptace status updated successfully",
                updatedUser
            },
            {status: 200}
        )
    } catch (error) {
        console.log("Failed to update user status to accept messages")
        return Response.json(
            {
                success: false,
                message: "Failed to update user status to accept messages"
            },
            {status: 500}
        )
    }

}

export async function GET(request: Request) {
    await connectDb()

    const session  = await getServerSession(authOptions)
    const user = session?.user;

    if(!session || !session.user){
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            {status: 401}
        )
    }

    const userId = user._id;

    try {
        const foundUser = await userModel.findById({userId})
        if (!foundUser) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {status: 404}
            )
        }
        
        return Response.json(
            {
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessage
            },
            {status: 401}
        )
    } catch (error) {
        console.log("Failed to update user status to accept messages")
        return Response.json(
            {
                success: false,
                message: "Error in getting message acceptance status"
            },
            {status: 500}
        )
    }
}