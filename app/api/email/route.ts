import { NextResponse } from 'next/server';
// Import nodemailer dynamically

export const runtime = 'nodejs'; // Force Node.js runtime

export async function POST(request: Request) {
  try {
    const { identifier, url, provider } = await request.json();
    
    // Dynamic import of nodemailer
    const nodemailer = (await import('nodemailer')).default;
    
    const transport = nodemailer.createTransport(provider.server);
    const { host } = new URL(url);
    
    const info = await transport.sendMail({
      to: identifier,
      from: provider.from,
      subject: `Sign in to ${host}`,
      text: `Sign in to ${host}\n${url}\n\n`,
      html: `<p>Sign in to <b>${host}</b></p><p><a href="${url}">Click here</a></p>`,
    });

    // In dev, log Ethereal preview URL
    if (process.env.NODE_ENV !== 'production' && nodemailer.getTestMessageUrl) {
      try {
        const testUrl = nodemailer.getTestMessageUrl(info);
        if (testUrl) {
          console.log('✉️  Magic-link preview→', testUrl);
        }
      } catch {
        // Ignore if getTestMessageUrl fails
        console.log('✉️ Email sent, no preview URL available');
      }
    }

    return NextResponse.json({ success: true, info });
  } catch (error) {
    console.error('Failed to send email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 