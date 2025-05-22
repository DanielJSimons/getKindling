// lib/auth.ts
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import type { NextAuthOptions } from 'next-auth';
import Email   from 'next-auth/providers/email';
import Google  from 'next-auth/providers/google';
import AzureAD from 'next-auth/providers/azure-ad';
import GitHub  from 'next-auth/providers/github';
import { prisma } from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/email.server';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret : process.env.NEXTAUTH_SECRET,

  providers: [
    Email({
      server: {
        host : process.env.EMAIL_SERVER_HOST,
        port : Number(process.env.EMAIL_SERVER_PORT),
        auth : {
          user: process.env.EMAIL_SERVER_USER!,
          pass: process.env.EMAIL_SERVER_PASS!,
        },
        secure: false,
        tls   : { rejectUnauthorized: false },
      },
      from                     : process.env.EMAIL_FROM,
      sendVerificationRequest  : async (params) => {
        // call our server helper, return void
        await sendVerificationEmail(params);
      },
    }),
    Google({
      clientId    : process.env.GOOGLE_ID     ?? '',
      clientSecret: process.env.GOOGLE_SECRET ?? '',
    }),
    AzureAD({
      clientId    : process.env.MS_ID     ?? '',
      clientSecret: process.env.MS_SECRET ?? '',
      tenantId    : 'common',
    }),
    GitHub({
      clientId    : process.env.GITHUB_ID     ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? '',
    }),
  ],

  session: { strategy: 'database' },
  callbacks: {
    async session({ session, user }) {
      if (session.user) session.user.id = user.id;
      return session;
    },
  },
  pages: {
    signIn       : '/login',
    verifyRequest: '/login/verify',
  },
};
