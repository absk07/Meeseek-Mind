import connectDB from '@/config/db';
import Chat from '@/models/Chat';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { userId } = getAuth(req);
        if(!userId) {
            return NextResponse.json({
                'success': false,
                'message': 'User not authenticated!'
            });
        }
        
        const { chatId } = await req.json();

        await connectDB();

        await Chat.deleteOne({ _id: chatId, userId });        

        return NextResponse.json({
            'success': true,
            'message': 'Chat deleted.'
        });
    } catch(err) {
        return NextResponse.json({
            'success': false,
            'error': err
        });
    }    
}
