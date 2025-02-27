"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "./ui/card";

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
import axios, { AxiosError } from "axios";
import timeAgo from "@/utils/dateconverter";
import { useCopyToClipboard } from "usehooks-ts";

type MessageCardProp = {
    message: Message;
    onMessageDelete: (messageId: string) => void;
    copy: (text: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProp) => {
    const { toast } = useToast();
    const [, copyToClipboard] = useCopyToClipboard();

    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete<ApiResponse>(
                `/api/delete-messages/${message._id}`
            );

            toast({
                title: response.data.message,
            });

            onMessageDelete(message._id as string);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description:
                    axiosError.response?.data.message ??
                    "Failed to delete message",
                variant: "destructive",
            });
        }
    };

    const handleCopy = () => {
        copyToClipboard(message.content);
        toast({
            title: "Copied to clipboard!",
            description: message.content,
        });
    };

    return (
        <Card>
            <CardContent className="mt-10">
                <p className="text-xl">{message.content}</p>
                <p className="text-md">
                    {timeAgo(message.createdAt.toString())}
                </p>
                <div className="mt-5 flex justify-between items-center">
                    <Button onClick={handleCopy}>Copy</Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                className="w-5 h-8 bg-red-600"
                                variant="destructive"
                            >
                                <X />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete this message.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDeleteConfirm}
                                >
                                    Continue
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardContent>
        </Card>
    );
};

export default MessageCard;
