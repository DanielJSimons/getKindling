'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b bg-white/70 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between p-4">
        {/* Brand */}
        <Link href="/" className="text-lg font-bold tracking-tight">
          <span className="material-symbols-outlined mr-1 text-amber-500">
            local_fire_department
          </span>
          Kindling
        </Link>

        {/* Right side */}
        {status === 'loading' ? null : session ? (
          /* ── Logged-in menu ───────────────────────── */
          <div className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-amber-100"
            >
              <span className="material-symbols-outlined text-amber-500">
                account_circle
              </span>
              <span className="hidden sm:block">{session.user?.email}</span>
              <span className="material-symbols-outlined text-sm">
                expand_more
              </span>
            </button>

            {open && (
              <ul
                className="absolute right-0 mt-2 w-44 rounded border bg-white py-1 text-sm shadow-lg"
                onMouseLeave={() => setOpen(false)}
              >
                <li>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 hover:bg-gray-50"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 hover:bg-gray-50"
                  >
                    Settings
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex w-full items-center px-4 py-2 hover:bg-gray-50"
                  >
                    Log&nbsp;out
                  </button>
                </li>
              </ul>
            )}
          </div>
        ) : (
          /* ── Not logged in ───────────────────────── */
          <Link
            href="/login"
            className="rounded-md bg-amber-500 px-4 py-2 text-white shadow-sm transition hover:bg-amber-600"
          >
            Log&nbsp;in
          </Link>
        )}
      </nav>
    </header>
  );
}
