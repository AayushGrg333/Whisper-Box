import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import connectDb from "@/lib/connnectdb";
import userModel from "@/models/user";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function DELETE(request: Request,{params}: {params: {messageid: string}}) {
    const messageId = params.messageid
    await connectDb();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if(!session || !user){
        return Response.json({
            success: false,
            message: "User not authenicated",
        },{status: 401})
    };

    try {
        const updatedResult = await userModel.updateOne({_id: user._id},{
            $pull : {messages : { _id : messageId}}
        })
    } catch (error) {
        
    }

}
