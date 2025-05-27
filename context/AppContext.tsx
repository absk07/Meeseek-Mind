"use client"
import { useUser } from "@clerk/nextjs";
import { createContext, ReactNode, useContext } from "react";

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContext = createContext<any>(undefined);

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
    const { user } = useUser();

    const value: any = {
        user
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}