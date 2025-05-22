// lib/email.server.ts
// Next.js treats *.server.ts as server-only—never bundled for client code

import type { SendVerificationRequestParams } from 'next-auth/providers/email';

export async function sendVerificationEmail({
  identifier,
  url,
  provider,
}: SendVerificationRequestParams) {
  // dynamic import so Webpack/Turbopack never sees nodemailer in client graph
  const nodemailer = (await import('nodemailer')).default;

  const transport = nodemailer.createTransport(provider.server);
  const { host } = new URL(url);

  const info = await transport.sendMail({
    to      : identifier,
    from    : provider.from,
    subject : `Sign in to ${host}`,
    text    : `Sign in to ${host}\n${url}\n\n`,
    html    : `<p>Sign in to <b>${host}</b></p><p><a href="${url}">Click here</a></p>`,
  });

  // In dev, log Ethereal preview URL
  if (process.env.NODE_ENV !== 'production' && nodemailer.getTestMessageUrl) {
    // eslint-disable-next-line no-console
    console.log('✉️  Magic-link preview→', nodemailer.getTestMessageUrl(info));
  }
}
