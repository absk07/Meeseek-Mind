'use client';
import React, { FormEvent, JSX, KeyboardEvent, useState } from 'react';
import Image from 'next/image';
import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import toast from 'react-hot-toast';
import axios from 'axios';

interface PromptBoxProps {
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

interface promptInterface {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

const PromptBox = ({ isLoading, setIsLoading }: PromptBoxProps): JSX.Element => {

    const [prompt, setPrompt] = useState<string>('');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user, chats, setChats, selectedChat, setSelectedChat } = useAppContext();

    const sendPrompt = async (e: FormEvent) => {
        const promptCopy = prompt;
        try {
            e.preventDefault();

            if(!user) return toast.error('Login to continue.');
            if(isLoading) return toast.error('Waiting for previous response');

            setIsLoading(true);
            setPrompt('');

            // save user prompt in chats array
            const userPrompt: promptInterface = {
                role: 'user',
                content: promptCopy,
                timestamp: Date.now()
            };
            setChats((prevChats) => prevChats.map((chat) => chat._id === selectedChat?._id ? {
                    ...chat,
                    messages: [...chat.messages, userPrompt]
                } : chat
            ));

            // save user prompt in selected chat
            setSelectedChat((prev) => {
                if(!prev) return prev;
                return {
                    ...prev,
                    messages: [...prev?.messages, userPrompt]
                }
            });

            const { data } = await axios.post('/api/chat/ai/deepseek', {
                chatId: selectedChat?._id,
                prompt
            });

            // console.log('api data', data)

            if(data.success) {
                // console.log('inside data.success')
                // console.log('before setChats', chats)
                setChats((prevChats) => prevChats.map((chat) => chat._id === selectedChat?._id ? {
                    ...chat,
                    messages: [...chat.messages, data.data.messages.slice(-1)[0]]
                } : chat
                ));
                // console.log('after setChats', chats)


                const msg = data?.data?.messages?.slice(-1)[0].content;
                // console.log('real msg', msg)
                const msgTokens = msg?.split(' ');
                // console.log('token msg', msgTokens)

                const assistantMsg: promptInterface = {
                    role: 'assistant',
                    content: '',
                    timestamp: Date.now()
                }
                setSelectedChat((prev) => {
                    if(!prev) return prev;
                    return {
                        ...prev,
                        messages: [...prev?.messages, assistantMsg]
                    }
                }); 
                
                for(let i = 0; i < msgTokens?.length; i++) {
                    setTimeout(() => {
                        assistantMsg.content = msgTokens?.slice(0, i + 1).join(' ');
                        setSelectedChat((prev) => {
                            if(!prev) return prev;

                            const updatedMsg = [
                                ...prev.messages.slice(0, -1),
                                assistantMsg
                            ]

                            return { ...prev, messages: updatedMsg }
                        });
                    }, i * 80)
                }
            } else {
                console.log(data);
                toast.error(data.message);
                setPrompt(promptCopy);
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message);
                console.error(err);
                setPrompt(promptCopy);
            } else {
                toast.error('An unknown error occurred.');
                console.error('Unknown error:', err);
            }
        } finally {
            setIsLoading(false);
        }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        if(e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendPrompt(e);
        }
    }

    return (
        <form onSubmit={sendPrompt} className={`w-full ${selectedChat?.messages ? 'max-w-3xl' : 'max-w-2xl'} bg-[#404045] p-4 rounded-3xl mt-4 transition-all`}>
            <textarea
                onKeyDown={handleKeyDown}
                className='outline-none w-full resize-none overflow-hidden break-words bg-transparent'
                rows={2} 
                placeholder='Ask Anything' 
                required 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
            />
            <div className='flex items-center justify-between text-sm'>
                <div className='flex items-center gap-2'>
                    <p className='flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition'>
                        <Image className='h-5' src={assets.deepthink_icon} alt='' />
                        Switch Model
                    </p>
                    <p className='flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition'>
                        <Image className='h-5' src={assets.search_icon} alt='' />
                        Search
                    </p>
                </div>
                <div className='flex items-center gap-2'>
                    <Image className='w-4 cursor-pointer' src={assets.pin_icon} alt='' />
                    <button className={`${prompt ? 'bg-cyan-400' : 'bg-[#71717a]'} rounded-full p-2 cursor-pointer`}>
                        <Image className='w-3.5 aspect-square' src={prompt ? assets.enter_icon_active : assets.enter_icon} alt='' />
                    </button>
                </div>
            </div>
        </form>
    )
}

export default PromptBox;