import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import connectDb from "@/lib/connnectdb";
import userModel from "@/models/user";
import { User } from "next-auth";

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
        if(updatedResult.modifiedCount == 0){
            return Response.json(
                {
                    success: false,
                    message: "Message not found or already deleted"
                },
                {status : 404}
            )
        }

        return Response.json(
        {
            success: true,
            message: "Message successfully Deleted"
        },
        {status : 200})
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Error deleting message"
            },
            {status: 401}
        )
    }

}
