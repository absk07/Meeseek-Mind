'use client';
import React, { JSX, useEffect, useRef, useState } from 'react';
import { assets } from '@/assets/assets';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';
import PromptBox from '@/components/PromptBox';
import Message from '@/components/Message';
import { useAppContext } from '@/context/AppContext';

interface MessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export default function Home(): JSX.Element {
  const [expand, setExpand] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<MessageProps[]>([]);

  const { selectedChat } = useAppContext();

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(selectedChat)
      setMessages(selectedChat?.messages)
  }, [selectedChat]);

  useEffect(() => {
    if(containerRef.current)
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      })
  }, [messages]);

  return (
    <div>
      <div className='flex h-screen'>
        {/* sidebar */}
        <Sidebar expand={expand} setExpand={setExpand} />
        <div className='flex-1 flex flex-col items-center justify-center px-4 pb-8 bg-[#292a2d] text-white relative'>
          <div className='md:hidden absolute top-1 flex items-center justify-between w-full'>
            <Image
              onClick={() => (expand ? setExpand(false) : setExpand(true))}
              className='rotate-180' 
              src={assets.hamburger_sidebar_open} 
              alt='' 
            />
            <Image className='opacity-70' src={assets.new_chat} alt='' />
          </div>
          {
            messages.length === 0 ? (
              <>
                <div className='flex items-center gap-3 p-4'>
                    <p className='text-3xl font-medium'>What can I help with?</p>
                </div>
              </>
            ) : (
              <div ref={containerRef} className='relative flex flex-col items-center justify-start w-full mt-20 max-h-screen overflow-y-auto'>
                <p className='fixed top-8 border border-transparent hover:border-gray-500/50 py-1 px-2 rounded-lg font-semibold mb-6'>
                  { selectedChat?.name }
                </p>
                {
                  messages.map((msg, idx) => (
                    <Message
                      key={idx}
                      role={msg.role}
                      content={msg.content}
                    />
                  ))
                }
                {
                  isLoading && (
                    <div className='flex gap-4 max-w-3xl w-full py-3'>
                      <Image src={assets.logo_icon} alt='Logo' className='h-9 w-9 p-1 border border-white/15 rounded-full' />
                      <div className='loader flex justify-center items-center gap-1'>
                        <div className='w-1 h-1 rounded-full bg-white animate-bounce'></div>
                        <div className='w-1 h-1 rounded-full bg-white animate-bounce'></div>
                        <div className='w-1 h-1 rounded-full bg-white animate-bounce'></div>
                      </div>
                    </div>
                  )
                }
              </div>
            )
          }
          <PromptBox
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
          <p className='text-xs absolute bottom-1 text-gray-500 '>AI generated, for reference only as AI can make mistakes, so double-check it</p>
        </div>
      </div>
    </div>
  );
}
