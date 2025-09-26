'use client';

import './globals.css';
import { ReactNode } from 'react';
import StoreProvider from '@/app/StoreProvider';
import Navbar from '@/components/Navbar';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <StoreProvider>
          <Navbar />
          <main className="pt-6">{children}</main>
        </StoreProvider>
      </body>
    </html>
  );
}
