import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { AppContextProvider } from '@/context/AppContext';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Meeseek Mind',
  description: 'Hello, I am Mr. Meeseek.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <AppContextProvider>
        <html lang='en'>
          <body className={`${inter.className} antialiased`}>
            <Toaster
              toastOptions={{
                success: {
                  style: {
                    background: "black", color: "white"
                  }
                },
                error: {
                  style: {
                    background: "black", color: "white"
                  }
                }
              }}
            />
            {children}
          </body>
        </html>
      </AppContextProvider>
    </ClerkProvider>
  );
}
