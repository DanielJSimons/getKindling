import { NextRequest } from 'next/server';
import { sendVerificationEmail } from '@/lib/email.server';
import { NextResponse } from 'next/server';
import type { SentMessageInfo } from 'nodemailer';

export const runtime = 'nodejs'; // Force Node.js runtime

export async function POST(request: Request) {
  try {
    const { identifier, url, provider } = await request.json();
    
    const nodemailer = (await import('nodemailer')).default;
    
    const transport = nodemailer.createTransport(provider.server);
    const { host } = new URL(url);
    
    const info: SentMessageInfo = await transport.sendMail({
      to: identifier,
      from: provider.from,
      subject: `Sign in to ${host}`,
      text: `Sign in to ${host}\n${url}\n\n`,
      html: `<p>Sign in to <b>${host}</b></p><p><a href="${url}">Click here</a></p>`,
    });

    if (process.env.NODE_ENV !== 'production' && nodemailer.getTestMessageUrl) {
      try {
        const testUrl = nodemailer.getTestMessageUrl(info);
        if (testUrl) {
          console.log('✉️  Magic-link preview→', testUrl);
        }
      } catch {
        console.log('✉️ Email sent, no preview URL available');
      }
    }

    // Only return necessary info to avoid type issues
    return NextResponse.json({
      success: true,
      info: {
        messageId: info.messageId,
        response: info.response,
      },
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 