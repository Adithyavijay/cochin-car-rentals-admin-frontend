import React from 'react';
import Sidebar from '@/modules/sidebar/Sidebar';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
    weight: ['400', '600', '700'],
    subsets: ['latin'],
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
      <main className={`${poppins.className} flex-grow overflow-y-auto bg-purple-100`}>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
} 