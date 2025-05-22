'use client';

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  async function handleEmail(e: FormEvent) {
    e.preventDefault();
    await signIn('email', { email, callbackUrl: '/dashboard' });
    setSent(true);
  }

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-amber-50 to-rose-50 px-4 py-12">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        {/* Logo */}
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 text-xl font-bold text-amber-600">
          <span className="material-symbols-outlined text-[28px]">
            local_fire_department
          </span>
          Kindling
        </Link>

        <h1 className="mb-6 text-center text-2xl font-semibold">
          Sign in to your account
        </h1>

        {/* === Magic-link form === */}
        {sent ? (
          <p className="rounded bg-amber-100 p-4 text-sm text-amber-800">
            Magic link sent – check your inbox.
          </p>
        ) : (
          <form onSubmit={handleEmail} className="space-y-3">
            <label className="block text-sm font-medium">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded border px-3 py-2"
            />
            <button className="w-full rounded bg-amber-500 py-2 font-medium text-white transition hover:bg-amber-600">
              Email me a magic link
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="my-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs uppercase tracking-wide text-gray-500">
            Or continue with
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* === OAuth buttons === */}
        <div className="space-y-3">
          <OAuthButton
            provider="google"
            label="Sign in with Google"
            iconPath="/google.svg"
          />
          <OAuthButton
            provider="microsoft"
            label="Sign in with Microsoft"
            iconPath="/microsoft.svg"
          />
          <OAuthButton
            provider="github"
            label="Sign in with GitHub"
            iconPath="/github.svg"
          />
        </div>
      </div>
    </main>
  );
}

/* -------------------------------------------------- */
/* Small helper component for OAuth buttons           */
/* -------------------------------------------------- */
function OAuthButton({
  provider,
  label,
  iconPath,
}: {
  provider: string;
  label: string;
  iconPath: string;
}) {
  return (
    <button
      onClick={() => signIn(provider, { callbackUrl: '/dashboard' })}
      className="flex w-full items-center justify-center gap-3 rounded border border-gray-300 bg-white py-2 transition hover:bg-gray-50"
    >
      <Image src={iconPath} alt="" width={20} height={20} />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
