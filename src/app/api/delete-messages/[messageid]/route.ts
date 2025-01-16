import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";
import userModel from "@/models/user";
import connectDb from "@/lib/connnectdb";
import mongoose from "mongoose";

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } }
) {
  const { messageid } = params;

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

  const userId = new mongoose.Types.ObjectId(user._id); //convert string into objectid
  try {
    const updatedResult = await userModel.updateOne(
      { _id: userId },
      {
        $pull: { messages: { _id: messageid } },
      }
    );

    if (updatedResult.modifiedCount == 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Message not found or already deleted",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Message Deleted Successfully",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error deleting message:", error);   
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error deleting message",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}