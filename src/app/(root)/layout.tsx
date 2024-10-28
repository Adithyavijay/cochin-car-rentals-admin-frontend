import React from 'react';
import Sidebar from '@/modules/sidebar/Sidebar';
import { Poppins } from 'next/font/google';
import { Inter } from 'next/font/google';

export const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
    variable: '--font-inter',
});

const poppins = Poppins({
    weight: ['400', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
});
import { Outfit } from 'next/font/google';

export const outfit = Outfit({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex overflow-hidden">
      <div className="flex  overflow-y-auto">
        <Sidebar />
      </div>
      <main className={`${outfit.className} flex-grow overflow-y-auto bg-purple-100`}>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
} 