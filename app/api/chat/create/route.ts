import connectDB from '@/config/db';
import Chat from '@/models/Chat';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

interface chatDataInterface {
    userId: string;
    messages: [];
    name: string;
}


export async function POST(req: NextRequest) {
    try {
        const { userId } = getAuth(req);
        if(!userId) {
            return NextResponse.json({
                'success': false,
                'message': 'User not authenticated!'
            });
        }

        const chatData: chatDataInterface = {
            userId,
            messages: [],
            name: 'New Chat'
        };

        await connectDB();

        await Chat.create(chatData);

        return NextResponse.json({
            'success': true,
            'message': 'Chat created.'
        });
    } catch(err) {
        return NextResponse.json({
            'success': false,
            'error': err
        });
    }    
}
