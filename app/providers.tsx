'use client';

import { SessionProvider } from 'next-auth/react';

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  // value={null} is fine; SessionProvider will fetch on the client
  return <SessionProvider>{children}</SessionProvider>;
}
