import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";
import userModel from "@/models/user";
import connectDb from "@/lib/connnectdb";
import { User } from "next-auth";
import { NextRequest } from "next/server";

// Define route segment config
export const dynamic = "force-dynamic";

export async function DELETE(
  _request: NextRequest,
  context: { params: { messageid: string } }
): Promise<Response> {
  const { messageid } =  context.params; 
  await connectDb();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !user) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Not Authenticated",
      }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const updatedResult = await userModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageid } } }
    );

    if (updatedResult.modifiedCount === 0) {
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
