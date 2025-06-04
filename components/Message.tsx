import React, { JSX, useEffect } from 'react';
import Image from 'next/image';
import { assets } from '@/assets/assets';
import Markdown from 'react-markdown';
import toast from 'react-hot-toast';
import hljs from 'highlight.js';
import 'highlight.js/styles/vs2015.css';
import rehypeHighlight from 'rehype-highlight';


interface MessageProps {
    role: 'user' | 'assistant';
    content: string;
}

const Message = ({ role, content }: MessageProps): JSX.Element => {
    useEffect(() => {
        hljs.highlightAll();
    }, [content]);

    const copyMessage = () => {
        navigator.clipboard.writeText(content);
        toast.success('Message copied to clipboard');
    }

    return (
        <div className='flex flex-col items-center w-full max-w-3xl text-sm'>
            <div className={`flex flex-col w-full mb-8 ${role === 'user' && 'items-end'}`}>
                <div className={`group relative flex max-w-2xl py-3 rounded-xl ${role === 'user' ? 'bg-[#414158] px-5' : 'gap-3'}`}>
                    <div className={`opacity-0 group-hover:opacity-100 absolute ${role === 'user' ? 'left-4 -bottom-6' : 'left-9 -bottom-6'} transition-all}`}>
                        <div className='flex items-center gap-2 opacity-70'>
                            {
                                role === 'user' ? (
                                    <>
                                        <Image onClick={copyMessage} className='w-4 cursor-pointer' src={assets.copy_icon} alt='' />
                                        <Image className='w-4.5 cursor-pointer' src={assets.pencil_icon} alt='' />
                                    </>
                                ) : (
                                    <>
                                        <Image onClick={copyMessage} className='w-4.5 cursor-pointer' src={assets.copy_icon} alt='' />
                                        <Image className='w-4 cursor-pointer' src={assets.regenerate_icon} alt='' />
                                        <Image className='w-4 cursor-pointer' src={assets.like_icon} alt='' />
                                        <Image className='w-4 cursor-pointer' src={assets.dislike_icon} alt='' />
                                    </>
                                )
                            }
                        </div>
                    </div>
                    {
                        role === 'user' ? (
                            <span className='text-white/90'>{content}</span>
                        ) : (
                            <>
                                <Image className='h-9 w-9 p-1 border border-white/15 rounded-full' src={assets.logo_icon} alt='' />
                                <div className='space-y-4 w-full overflow-scroll markdown-content'>
                                    <Markdown rehypePlugins={[rehypeHighlight]}>{content}</Markdown>
                                </div>
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Message;