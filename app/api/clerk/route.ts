import { Webhook } from 'svix';
import connectDB from '@/config/db';
import User from '@/models/User';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

interface userDataInterface {
    user_id: string;
    name: string;
    email: string;
    image?: string;
}

interface ClerkUserPayload {
  id: string;
  first_name: string;
  last_name: string;
  image_url?: string;
  email_addresses: {
    email_address: string;
  }[];
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    const signingSecret = process.env.SIGNING_SECRET;
    if (!signingSecret) {
        return NextResponse.json({ 
            error: 'SIGNING_SECRET not set' 
        });
    }
    const wh = new Webhook(signingSecret)
    const headerPayload = await headers()
    const svixHeaders = {
        'svix-id': headerPayload.get('svix-id') ?? '',
        'svix-timestamp': headerPayload.get('svix-timestamp') ?? '',
        'svix-signature': headerPayload.get('svix-signature') ?? ''
    };

    // get the payload and verify it
    let event: { data: ClerkUserPayload; type: string };
    try {
        const payload = await req.json();
        // console.log(payload)
        const body = JSON.stringify(payload)
        event = wh.verify(body, svixHeaders) as { data: ClerkUserPayload; type: string }
    } catch (err) {
        // console.log(err)
        return NextResponse.json({ 
            error: err 
        });
    }

    const { data, type } = event;

    // console.log({user_data: data, event_type: type})
    
    // save user data in db
    const userData: userDataInterface = {
        user_id: data.id,
        email: data.email_addresses[0].email_address,
        name: `${data.first_name} ${data.last_name}`,
        image: data.image_url
    };

    // console.log(userData)

    await connectDB();

    switch(type) {
        case 'user.created':
            await User.create(userData);
            // console.log('User created', u)
            break;
        case 'user.updated':
            await User.findByIdAndUpdate(data.id, userData);
            break;
        case 'user.deleted':
            await User.findByIdAndDelete(data.id);
            break;
        default:
            break;
    }

    return NextResponse.json({
        message: 'Event Received'
    });
}