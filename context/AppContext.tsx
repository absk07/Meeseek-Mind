'use client'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import axios from 'axios';

interface AppContextProviderProps {
  children: ReactNode;
}

interface Chat {
  _id: string;
  name: string;
  userId: string;
  messages: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface AppContextType {
  user: ReturnType<typeof useUser>['user'];
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  selectedChat: Chat | null;
  setSelectedChat: React.Dispatch<React.SetStateAction<Chat | null>>;
  getChats: () => Promise<void>;
  createNewChat: () => Promise<void>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext must be used within AppContextProvider');
    return context;
}

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
    const { user } = useUser();
    const { getToken } = useAuth();

    const [ chats, setChats ] = useState<Chat[]>([]);
    const [ selectedChat, setSelectedChat ] = useState<Chat |null>(null);

    const createNewChat = async (): Promise<void> => {
        try {
            if(!user) {
                toast.error('Please Login to continue');
                return;
            }

            const token = await getToken();
            const { data } = await axios.post('/api/chat/create', {}, { 
                headers: { Authorization: `Bearer ${token}` }
            });

            if(data.success) {
                console.log(data);
                toast.success(data.message);
                await getChats();
            } else {
                console.log(data);
                toast.error(data.message);
            }
        } catch (err: any) {
            console.error(err);
            toast.error(err.message);
        }
    }

    const getChats = async (): Promise<void> => {
        try {
            const token = await getToken();

            const { data } = await axios.get('/api/chat/get', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if(data.success) {
                // console.log(data);
                const chatList: Chat[] = data.data;
                chatList?.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
                setChats(chatList);

                if(chatList.length === 0) {
                    // console.log('AppContext')
                    await createNewChat();
                    getChats();
                } else {
                    // console.log(chatList[0]);
                    setSelectedChat(chatList[0]);
                }
            } else {
                console.log(data);
                toast.error(data.message);
            }
        } catch (err: any) {
            console.error(err);
            toast.error(err.message);
        }
    }

    useEffect(() => {
        if(user) getChats();
    }, [user]);

    const value: AppContextType = {
        user,
        chats,
        setChats, 
        selectedChat,
        setSelectedChat,
        getChats,
        createNewChat
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}