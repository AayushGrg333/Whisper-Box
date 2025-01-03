import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import connectDb from "@/lib/connnectdb";
import userModel from "@/models/user";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function DELETE(request: Request,{params}: {params: {messageid: string}}) {
    await connectDb();

    const session = await getServerSession(authOptions);
    const user: User = session?.user;

}
