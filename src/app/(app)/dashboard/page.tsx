'use client'

import { useToast } from '@/hooks/use-toast';
import { Message } from '@/models/user';
import React,{useCallback} from 'react'
import { useState,useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import axios,{AxiosError} from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { useRouter } from 'next/navigation';
import { Loader2, MoveLeft, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import MessageCard from '@/components/messagecard';
import { User } from 'next-auth';

function Dashboard() {
  const Router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isloading,setIsloading] = useState<boolean>(false);
  const [isSwitchLoading, setSwitchLoading] = useState<boolean>(false);

  const {toast} = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message)=>message._id !== messageId));
  }

  const {data : session} = useSession();

  const form = useForm({
    resolver : zodResolver(acceptMessageSchema)
  })

  const {register, watch, setValue} = form;

  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessage = useCallback(async () => {
    setSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/acceptMessages');
      setValue('acceptMessages', response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Failed to fetch message settings',
        variant: 'destructive',
      });
    } finally {
      setSwitchLoading(false);
    }
  },[setValue])
  
  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsloading(true);
    setSwitchLoading(false);
    try{
     const response =  await axios.get<ApiResponse>('/api/get-messages');
     setMessages(response.data.messages || [])
     if (refresh){
      toast({
        title: 'Refreshed messages',
        description: 'Showing latest Messages',
      });
     }
    }catch(error){
      toast({
        title: 'Error',
        description: 'Failed to fetch message settings',
        variant: 'destructive',
      });
    } finally {
      setIsloading(false);
      setSwitchLoading(false);
    }   
  },[setIsloading, setMessages]);

  useEffect(()=>{
    if(!session || !session.user) return 
    fetchMessages();
    fetchAcceptMessage();
  },[session,setValue,fetchAcceptMessage,fetchMessages]);

  //handle switch change
  const handleSwitchChange = async() => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages',{
        acceptMessages: !acceptMessages
      });
      setValue('acceptMessages', !acceptMessages)
      toast({
        title: response.data.message,
        variant : 'default'
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Failed to fetch message settings',
        variant: 'destructive',
      });
    }
  }

  if (!session || !session.user) {
    return <div> Please Login </div>
    }

  const {username} = session?.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL Copied',
      description: "Profile URL has been copied to clipboard",
    })
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
        <span
          onClick={() => Router.push("/")}
          className="text-sm text-blue-900 flex items-center group cursor-pointer"
        >
          <MoveLeft  className="w-6 h-4 transition-transform duration-300 ease-linear group-hover:-translate-x-3 " />
          <p className="ml-1 group-hover:underline">Back to home</p>
        </span>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4 flex items-center">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2.5 text-[15px]">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isloading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw  className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id as string}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard