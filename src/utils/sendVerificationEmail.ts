import { resend } from "@/lib/resend";
import VerificationEmail from '../../emails/VerificationEmail'

import { ApiResponse } from "@/types/ApiResponse";

//sends an verification email to the user
export async function sendVerificationEmail(
    email:string,
    username: string,
    verifyCode: string,
) : Promise<ApiResponse> {
    try {
        await  resend.emails.send({
            from: 'onboarding@resend.dev',
            to:email,
            subject: "Mystry message | Verification code",
            react: VerificationEmail({username, otp:verifyCode}),
        })
        return {success: false,
            message: "verification email sent succesfully"
        }
        
    } catch (emailError) {
        console.error("Error sending Verification email",emailError)
        return {success: false,
            message: "Failed to send verification email"
        }
    }

    
}