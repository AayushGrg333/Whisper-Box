'use client';

import { useToast } from '@/hooks/use-toast';
import { Message } from '@/models/user';
import React from 'react'
import { useState,useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';

function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isloading,setIsloading] = useState<boolean>(false);
  const [isSwitchLoading, setsSwitchLoading] = useState<boolean>(false);

  const {toast} = useToast();

  const handleDelete = (messageId: string) => {
    setMessages(messages.filter((message)=>message._id !== messageId));
  }

  const {data : session} = useSession();

  const form = useForm({
    resolver : zodResolver(acceptMessageSchema)
  })

  return (
    <div>Dashboard</div>
  )
}

export default Dashboard