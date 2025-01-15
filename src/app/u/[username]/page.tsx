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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

function SendMessage() {
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

    const handleSendMessage = async (data: z.infer<typeof messageSchema>) => {
        setIsSendingMessage(true);
        try {
            const response = await axios.post<ApiResponse>(
                "/api/send-message",
                {
                    username: username,
                    content: data.content,
                }
            );
            toast({
                title: "Success",
                description: response.data.message,
            });
            form.reset();
        } catch (error) {
            console.error("Error during sending message", error);
            const axiosError = error as AxiosError<ApiResponse>;

            const errormessage = axiosError.response?.data.message;

            toast({
                title: "failed sending message",
                description: errormessage,
                variant: "destructive",
            });
        } finally {
            setIsSendingMessage(false);
        }
    };

    useEffect(() => {
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
                const errormessage = axiosError.response?.data.message;
                toast({
                    title: "failed getting message suggestion",
                    description: errormessage,
                    variant: "destructive",
                });
            } finally {
                setLoadingAiSuggestion(false);
            }
        };
        handleSuggestMessage()
    }, [toast])

    const handleSuggestionClick = (suggestion : string) =>{
        form.setValue("content",suggestion);
    }

    return (
        <>
            <div className="flex justify-center flex-col items-center min-h-screen bg-grey">
                <div className="w-full max-w-2xl p-8 space-y-8 bg-white rounded-lg ">
                <div className="text-center">
                    <h1 className="text-3xl font-bold trackeing-tight lg:text-4xl">Send Anonymous Message to {username}</h1>
                </div>
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
                            <Button type="submit">
                                {isSendingMessage ? (
                                    <>
                                        <Loader2 className="mr-2 h-2 w-4 animate-spin"/>sending...
                                    </>
                                ):(
                                    "send Message"
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
                </div>

                <div>
                    {loadingAiSuggestion ? (
                        <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin"/>Loading ai Suggestion...
                        </>
                    ):(
                        <div className="bg-slate-200 max-w-4xl flex flex-col justify-center items-center w-full p-8 space-y-8 rounded-lg">
                        <h2 className="text-3xl">AI Generated suggestions:</h2>
                        <div className="flex flex-col justify-center space-y-5">
                                    {
                                        AiSuggestion.map((AiSuggestion,index)=>(
                                            <Button 
                                            key={index}
                                            variant='outline'
                                            onClick={()=>handleSuggestionClick(AiSuggestion)}
                                            >
                                                {AiSuggestion}
                                            </Button>
                                            
                                        ))
                                    }
                        </div>
                    </div>
                    )}
                </div>

            </div>
        </>
    );
}

export default SendMessage;
