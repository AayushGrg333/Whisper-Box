import dbConnect from "@/lib/connnectdb";
import User from "@/models/user";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json();
        const existingUserVerifiedByUsername = await User.findOne({
            username,
            isVerified: true,
        });

        if (existingUserVerifiedByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "username is already taken",
                },
                { status: 400 }
            );
        }

        const existingUserByEmail = await User.findOne({ email });
        const verifyCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                //case 1: User with email exists and is verified
                return Response.json(
                    {
                        success: false,
                        message: "User with this email already exists",
                    },
                    { status: 400 } //client error
                );
            } else {
                //Case 2 : user with email exists but is not verified
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(
                    Date.now() + 3600000
                );
                await existingUserByEmail.save();
                //send verification email
                const emailResponse = await sendVerificationEmail(
                    email,
                    username,
                    verifyCode
                );

                if (!emailResponse.success) {
                    return Response.json(
                        {
                            success: false,
                            message: emailResponse.message,
                        },
                        { status: 500 }
                    );
                }

                return Response.json(
                    {
                        success: false,
                        message:
                            "User Registered Successfully. Please verify your email",
                    },
                    { status: 201 }
                );
            }
        } else {    
            // case 3 : New user registration
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new User({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: [],
            });

            await newUser.save();
        }

        //send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        );

        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                { status: 500 }
            );
        }

        return Response.json(
            {
                success: false,
                message:
                    "User Registered Successfully. Please verify your email",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error registering user", error);
        return Response.json(
            {
                success: false,
                message: "Error Registering user",
            },
            {
                status: 500,
            }
        );
    }
}
