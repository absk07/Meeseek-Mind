'use client'
import { useAuth, useUser } from '@clerk/nextjs';
import { createContext, ReactNode, useContext, useState } from 'react';

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContext = createContext<any>(undefined);

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
    const { user } = useUser();
    const { getToken } = useAuth();

    const [ chats, setChats ] = useState([]);
    const [ selectedChat, setSelectedChat ] = useState(null);

    

    const value: any = {
        user
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}