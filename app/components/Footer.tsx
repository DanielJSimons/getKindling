'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Footer() {
  const pathname = usePathname();
  const [isDashboard, setIsDashboard] = useState(false);
  
  useEffect(() => {
    // Check both client-side pathname and window.location to ensure it works
    const path = pathname || window.location.pathname;
    setIsDashboard(path.startsWith('/dashboard'));
  }, [pathname]);
  
  // Hidden in dashboard
  if (isDashboard) {
    return null;
  }

  return (
    <footer className="border-t bg-white/70 backdrop-blur">
      <div className="mx-auto max-w-5xl p-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Kindling — micro-sponsorships for startups
      </div>
    </footer>
  );
}