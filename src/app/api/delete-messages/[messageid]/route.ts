import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";
import userModel from "@/models/user";
import connectDb from "@/lib/connnectdb";
import mongoose from "mongoose";

interface RouteContext {
  params: {
    messageid: string;
    [key: string]: string | string[];
  };
}

export async function DELETE(
  { params }: RouteContext
) {
  const { messageid } = params;

  await connectDb();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);
  
  try {
    const updatedResult = await userModel.updateOne(
      { _id: userId },
      {
        $pull: { messages: { _id: messageid } },
      }
    );

    if (updatedResult.modifiedCount == 0) {
      return Response.json(
        {
          success: false,
          message: "Message not found or already deleted",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message Deleted Successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting message:", error);   
    return Response.json(
      {
        success: false,
        message: "Error deleting message",
      },
      { status: 500 }
    );
  }
}