"use client";

import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState,useEffect } from "react";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useToast } from "@/hooks/use-toast";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

function SendMessage() {
    const [message, setMessage] = useState<string>("");
    const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);
    const [AiSuggestion, setAISuggestion] = useState<string[]>([]);
    const [loadingAiSuggestion, setLoadingAiSuggestion] = useState<boolean>(false);

    const { toast } = useToast();

    //extracting the username
    const pathname = usePathname();
    const username = pathname.split("/")[2];

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: "",
        },
    });
    
    

    const handleSendMessage = async () => {
        setIsSendingMessage(true);
        try {
            const response = await axios.post<ApiResponse>(
                "/api/send-message",
                {
                    username: username,
                    content: message,
                }
            );
            toast({
                title: "Success",
                description: response.data.message,
            });
        } catch (error) {
            console.error("Error during sending message", error);
            const axiosError = error as AxiosError<ApiResponse>;

            let errormessage = axiosError.response?.data.message;

            toast({
                title: "failed sending message",
                description: errormessage,
                variant: "destructive",
            });
        } finally {
            setIsSendingMessage(false);
        }
    };

    const handleSuggestMessage = async () => {
        setLoadingAiSuggestion(true);
        try {
            const response = await axios.get<ApiResponse>(
                "/api/suggest-messages"
            );
            const suggestion = response.data.text as string;
            const suggestionArr = suggestion?.split("||");
            setAISuggestion(suggestionArr);
        } catch (error) {
            console.error("Error duing getting message suggestion", error);
            const axiosError = error as AxiosError<ApiResponse>;
            let errormessage = axiosError.response?.data.message;
            toast({
                title: "failed getting message suggestion",
                description: errormessage,
                variant: "destructive",
            });
        } finally {
            setLoadingAiSuggestion(false);
        }
    };

    return (
        <>
            <div className="">
                <div className="text-3xl">Send Anonymous Message</div>
                <div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSendMessage)}
                            className="space-y-8"
                        >
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Ask me a Question:
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="ask me here..."
                                                {...field}
                                              
                                            />
                                        </FormControl>
                                        <FormMessage>{form.formState.errors.content?.message}</FormMessage>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                </div>
            </div>
            <Button onClick={handleSuggestMessage}>getsuggestion</Button>
        </>
    );
}

export default SendMessage;
