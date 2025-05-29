import mongoose, { Document, Model, Schema } from 'mongoose';

interface UserSchemaType {
    name: string;
    email: string;
    image?: string;
}

type UserDocument = UserSchemaType & Document;

const UserSchema: Schema<UserDocument> = new mongoose.Schema<UserDocument>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    }
}, { timestamps: true });

const User: Model<UserDocument> = (mongoose.models.User as Model<UserDocument>) || mongoose.model<UserDocument>('User', UserSchema);

export default User;