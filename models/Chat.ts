import mongoose, { Document, Model, Schema } from 'mongoose';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatDocument extends Document {
  name: string;
  messages: Message[];
  userId: string;
}

const ChatSchema: Schema<ChatDocument> = new mongoose.Schema<ChatDocument>({
    name: {
        type: String,
        required: true
    },
    messages: [{
        role: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        timestamp: {
            type: Number,
            required: true
        },
    }],
    userId: {
        type: String,
        required: true
    } 
}, { timestamps: true });

const Chat: Model<ChatDocument> = (mongoose.models.Chat as Model<ChatDocument>) || mongoose.model<ChatDocument>('Chat', ChatSchema);

export default Chat;