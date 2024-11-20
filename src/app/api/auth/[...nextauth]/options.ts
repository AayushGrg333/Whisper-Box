import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import connectDb from "@/lib/connnectdb";
import User from "@/models/user";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",type: "text"},
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials:any):Promise<any>{
                await connectDb()
                try {
                    const user = await User.findOne({
                        $or: [
                            {email: credentials.identifier},
                            {username : credentials.identifier}
                        ]
                    })   
                    if(!user){
                        throw new Error('No user found with this email')
                    }      
                    
                    if(user.isVerified){
                        throw new Error('Please verify you account first')
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    if(isPasswordCorrect){
                        return user
                    }
                    else{
                        throw new Error('Incorrect Password')
                    }
                } catch (err : any) {
                    throw new Error
                }
            }
        }),
    ],
};