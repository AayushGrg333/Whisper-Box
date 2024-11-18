import { Message } from "@/models/user";

export interface ApiResponse{
    success:boolean;
    message: string;
    isAcceptingMessages?:boolean;
    messages?: Message[]
}