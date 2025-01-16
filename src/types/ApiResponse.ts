import { Message } from "@/models/user";

export interface ApiResponse{
    success:boolean;
    message: string;
    isAcceptingMessage?:boolean;
    data?: {
        messages?: Message[];
      }[];
      text?: string;
}