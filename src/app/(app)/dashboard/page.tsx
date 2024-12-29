'use client';

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


function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isloading,setIsloading] = useState<boolean>(false);
  const [isSwitchLoading, setSwitchLoading] = useState<boolean>(false);

  const {toast} = useToast();

  const handleDelete = (messageId: string) => {
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
    try{
      const response = await axios.get<ApiResponse>('/api/acceptMessages');
      setValue('acceptMessages',response.data.isAcceptingMessages);
    }catch(error){
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || "failed to fetch message settings",
        variant: "destructive"
      })
    }finally{
      setIsloading(false);
    }
  },[setValue])

  return (
    <div>Dashboard</div>
  )
}

export default Dashboard