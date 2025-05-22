import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth.server';
import { getServerSession } from 'next-auth';
import { NavSidebar } from './nav-sidebar';
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'react-hot-toast';

// Use the same fonts as the root layout
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// This is a server component that provides a completely different layout for dashboard
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen">
      {/* Left Navigation Panel - use client component */}
      <NavSidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gradient-to-br from-amber-50 to-rose-50">
        {children}
        <Toaster position="top-right" />
      </div>
    </div>
  );
} 