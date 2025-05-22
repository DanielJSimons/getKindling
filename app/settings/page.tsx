'use client';

import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

export default function Settings() {
  const { data: session } = useSession();

  /* ─── Profile form state ───────────────────────── */
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    setName(session?.user?.name ?? '');
  }, [session]);

  async function saveProfile() {
    setSaving(true);
    await fetch('/api/user', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    setSaving(false);
  }

  /* ─── API key state (mock) ─────────────────────── */
  const [apiKey, setApiKey] = useState<string | null>(null);
  async function generateKey() {
    const res = await fetch('/api/user/key', { method: 'POST' });
    const { key } = await res.json();
    setApiKey(key);
  }

  return (
    <main className="grid min-h-screen place-items-start bg-gradient-to-br from-amber-50 to-rose-50 px-4 py-16 sm:px-6">
      <div className="mx-auto w-full max-w-3xl space-y-16 rounded-lg bg-white p-8 shadow-lg">
        {/* ─── Header ─────────────────────────────── */}
        <header className="flex flex-col items-center gap-2 text-center">
          <span className="material-symbols-outlined text-4xl text-amber-500">
            settings
          </span>
          <h1 className="text-2xl font-bold">Account settings</h1>
        </header>

        {/* ─── Profile section ────────────────────── */}
        <section id="profile" className="space-y-4">
          <SectionTitle icon="person">Profile</SectionTitle>

          <label className="block text-sm font-medium">Display name</label>
          <input
            className="w-full rounded border px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="block text-sm font-medium">Email</label>
          <input
            className="w-full cursor-not-allowed rounded border bg-gray-100 px-3 py-2 text-gray-500"
            value={session?.user?.email ?? ''}
            disabled
          />

          <div className="mt-4 flex justify-end">
            <button
              onClick={saveProfile}
              disabled={saving}
              className="rounded bg-amber-500 px-4 py-2 text-white transition hover:bg-amber-600 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </section>

        {/* ─── Payouts section ────────────────────── */}
        <section id="payouts" className="space-y-4">
          <SectionTitle icon="credit_card">Payouts</SectionTitle>

          <p className="text-sm text-gray-600">
            Connect a Stripe account to receive sponsorship revenue.
          </p>

          <button className="rounded bg-rose-500 px-4 py-2 text-white transition hover:bg-rose-600">
            Set up Stripe Connect
          </button>
        </section>

        {/* ─── API key section ────────────────────── */}
        <section id="apikey" className="space-y-4">
          <SectionTitle icon="vpn_key">API key</SectionTitle>

          {apiKey ? (
            <>
              <input
                readOnly
                className="w-full select-all rounded border bg-gray-100 px-3 py-2 font-mono text-sm"
                value={apiKey}
              />
              <p className="text-xs text-gray-500">
                Store this key securely. You won’t see it again.
              </p>
            </>
          ) : (
            <button
              onClick={generateKey}
              className="rounded border px-4 py-2 transition hover:bg-gray-50"
            >
              Generate new key
            </button>
          )}
        </section>

        {/* ─── Danger zone ────────────────────────── */}
        <section id="danger" className="space-y-4">
          <SectionTitle icon="warning" color="text-red-600">
            Danger zone
          </SectionTitle>

          <p className="text-sm text-gray-600">
            Deleting your account removes all sites, slots, and data
            permanently.
          </p>

          <button
            onClick={() => alert('TODO: implement')}
            className="rounded bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
          >
            Delete account
          </button>
        </section>

        {/* ─── Sign-out link ──────────────────────── */}
        <div className="flex justify-center pt-8">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
          >
            <span className="material-symbols-outlined text-[18px]">
              logout
            </span>
            Log out
          </button>
        </div>
      </div>
    </main>
  );
}

/* —————————————————— helper component —————————————————— */
function SectionTitle({
  icon,
  children,
  color = 'text-amber-500',
}: {
  icon: string;
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <h2 className="flex items-center gap-2 text-lg font-semibold">
      <span className={`material-symbols-outlined ${color}`}>{icon}</span>
      {children}
    </h2>
  );
}
