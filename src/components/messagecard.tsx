"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";
import { Message } from "@/models/user";
import { useToast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import axios from "axios";
import timeAgo from "@/utils/dateconverter";

type MessageCardProp = {
  message: Message;
  onMessageDelete : (messageId: string) => void
}

const MessageCard = ({message , onMessageDelete } : MessageCardProp) => {
  const {toast}  = useToast();
  const handleDeleteConfirm = async() => {
   const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
   toast({
    title: response.data.message
   })
   onMessageDelete(message._id as string);
  }
    return (
        <Card >
            <CardContent className="mt-10">
                <p className="text-xl">{message.content}</p>
                <p className="text-md">{timeAgo(message.createdAt.toString())}</p>
            </CardContent>
            <CardHeader>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className="w-5 h-8 bg-red-600" variant="destructive"><X/></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete this messsage.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirm} >Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
               
            </CardHeader>
            
        </Card>
    );
}

export default MessageCard;
