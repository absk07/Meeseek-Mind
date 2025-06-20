export const maxDuration = 60;
import OpenAI from 'openai';
import Chat from '@/models/Chat';
import connectDB from '@/config/db';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
interface promptInterface {
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

const openai = new OpenAI({
    baseURL: process.env.BASE_URL || '',
    apiKey: process.env.OPENROUTER_API_KEY || ''
});

export async function POST(req: NextRequest) {
    try {
        const { userId } = getAuth(req);
        if(!userId) {
            return NextResponse.json({
                'success': false,
                'message': 'User not authenticated!'
            });
        }

        await connectDB();

        const { chatId, prompt, model } = await req.json();

        const chat = await Chat.findOne({ _id: chatId, userId });
        if (!chat) {
            return NextResponse.json({
                success: false,
                message: 'Chat not found!',
            });
        }
        
        const userPrompt: promptInterface = {
            role: 'user',
            content: prompt,
            timestamp: Date.now()
        };
        
        chat?.messages.push(userPrompt);
        // // console.log(chat)

        // // console.log(prompt)
        // // console.log(model)

        // call ai model api
        const completion = await openai.chat.completions.create({
            model: model,
            messages: [{ role: 'user', content: prompt }],
            store: true
        });

        // // console.log(completion.choices[0].message);

        const assistantMsg: promptInterface = {
            role: completion.choices[0].message.role,
            content: completion.choices[0].message.content || '',
            timestamp: Date.now(),
        };

        chat.messages.push(assistantMsg);
        await chat.save();

        return NextResponse.json({
            'success': true,
            'data': chat
        });
    } catch(err) { // eslint-disable-line @typescript-eslint/no-unused-vars
        // console.error(err);
        return NextResponse.json({
            'success': false,
            'message': 'Something went wrong!'
        });
    }
}