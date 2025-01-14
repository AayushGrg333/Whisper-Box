"use client";

import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios,{AxiosError} from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useToast } from "@/hooks/use-toast";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

function SendMessage() {
    const [message, setMessages] = useState("");
    const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);
    const [AiSuggestion,setAISuggestion] = useState<string[]>([])
    const [loadingAiSuggestion,setLoadingAiSuggestion] = useState<boolean>(false)

    const {toast} = useToast();

    //extracting the username
    const pathname = usePathname();
    const username = pathname.split("/")[2];

    const form = useForm({
        resolver: zodResolver(messageSchema),
    });

    const handleSendMessage = async () => {
      setIsSendingMessage(true)
        try {
            const response = await axios.post<ApiResponse>(
                "/api/send-message",
                {
                  username : username,
                  content : message,
                }
            );
            console.log(response.data.message)
            toast({
                title: "Success",
                description: response.data.message,
            });
        } catch (error) {
          console.error("Error during sening message",error);
          const axiosError = error as AxiosError<ApiResponse>

          let errormessage = axiosError.response?.data.message;

          toast({
            title: 'failed sending message',
            description: errormessage,
            variant: 'destructive',
          });
        }finally{
          setIsSendingMessage(false);
        }
        
    };

    const handleSuggestMessage = async () =>{
      setLoadingAiSuggestion(true)
      try {
        const response = await axios.get<ApiResponse>("/api/suggest-messages");
        const suggestion = response.data.text as string;
        const suggestionArr = suggestion?.split('||');
        setAISuggestion(suggestionArr)

      } catch (error) {
        console.error("Error duing getting message suggestion",error);
        const axiosError = error as AxiosError<ApiResponse>
        let errormessage = axiosError.response?.data.message;
        toast({
          title : "failed getting message suggestion",
          description: errormessage,
          variant: 'destructive',
        })
      } finally{
        setLoadingAiSuggestion(false);
      }
    }

    return (
        <>
            <Button onClick={handleSendMessage}>send</Button><br />
            <Button onClick={handleSuggestMessage}>getsuggestion</Button>
        </>
    );
}

export default SendMessage;
