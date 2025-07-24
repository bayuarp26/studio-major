import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Dictionary untuk email templates
const emailTemplates = {
  id: {
    validation: {
      required: 'Semua field harus diisi',
      invalidEmail: 'Format email tidak valid'
    },
    subject: 'Pesan Baru dari Portfolio Website',
    greeting: 'Halo Wahyu!',
    newMessage: 'Anda mendapat pesan baru dari website portfolio:',
    from: 'Dari',
    message: 'Pesan',
    footer: 'Pesan ini dikirim dari formulir kontak di website portfolio Anda',
    autoReply: {
      subject: 'Terima kasih atas pesan Anda - Wahyu Pratomo',
      title: 'Terima Kasih!',
      greeting: 'Halo',
      thanks: 'Terima kasih telah menghubungi saya melalui website portfolio. Pesan Anda telah saya terima dan akan saya balas dalam waktu 1-2 hari kerja.',
      summary: 'Ringkasan Pesan Anda:',
      contact: 'Sementara itu, Anda juga bisa menghubungi saya langsung melalui:',
      signature: 'Salam,\nWahyu Pratomo\nFull Stack Developer & Digital Marketing Specialist'
    },
    success: 'Email berhasil dikirim!',
    error: 'Gagal mengirim email. Silakan coba lagi atau hubungi saya langsung.'
  },
  en: {
    validation: {
      required: 'All fields are required',
      invalidEmail: 'Invalid email format'
    },
    subject: 'New Message from Portfolio Website',
    greeting: 'Hello Wahyu!',
    newMessage: 'You have received a new message from your portfolio website:',
    from: 'From',
    message: 'Message',
    footer: 'This message was sent from the contact form on your portfolio website',
    autoReply: {
      subject: 'Thank you for your message - Wahyu Pratomo',
      title: 'Thank You!',
      greeting: 'Hello',
      thanks: 'Thank you for contacting me through my portfolio website. I have received your message and will respond within 1-2 business days.',
      summary: 'Summary of Your Message:',
      contact: 'In the meantime, you can also contact me directly through:',
      signature: 'Best regards,\nWahyu Pratomo\nFull Stack Developer & Digital Marketing Specialist'
    },
    success: 'Email sent successfully!',
    error: 'Failed to send email. Please try again or contact me directly.'
  }
};

export async function POST(request: NextRequest) {
  try {
    const { name, email, message, lang = 'id' } = await request.json();
    
    // Get language templates
    const t = emailTemplates[lang as keyof typeof emailTemplates] || emailTemplates.id;

    console.log('Contact form submission:', { name, email, message: message.substring(0, 50) + '...', lang });

    // Validasi input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: t.validation.required },
        { status: 400 }
      );
    }

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: t.validation.invalidEmail },
        { status: 400 }
      );
    }

    // Debug environment variables
    console.log('SMTP Config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      passLength: process.env.SMTP_PASS?.length
    });

    // Konfigurasi transporter email
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Menggunakan service gmail untuk lebih simple
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Template email yang akan dikirim ke Anda
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER, // Email Anda sendiri
      subject: `${t.subject} - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #7c3aed; text-align: center; margin-bottom: 30px;">${t.subject}</h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 15px 0; color: #334155;">${t.from}:</h3>
            <p style="margin: 5px 0;"><strong>${lang === 'id' ? 'Nama' : 'Name'}:</strong> ${name}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
          </div>
          
          <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px;">
            <h3 style="margin: 0 0 15px 0; color: #334155;">${t.message}:</h3>
            <p style="line-height: 1.6; color: #475569; white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px;">${t.footer}</p>
            <p style="color: #64748b; font-size: 12px;">${lang === 'id' ? 'Waktu' : 'Time'}: ${new Date().toLocaleString(lang === 'id' ? 'id-ID' : 'en-US')}</p>
          </div>
        </div>
      `,
    };

    // Email balasan otomatis untuk pengirim
    const autoReplyOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: t.autoReply.subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #7c3aed; text-align: center; margin-bottom: 30px;">${t.autoReply.title}</h2>
          
          <p style="line-height: 1.6; color: #475569;">${t.autoReply.greeting} ${name},</p>
          
          <p style="line-height: 1.6; color: #475569;">
            ${t.autoReply.thanks}
          </p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #334155;">${t.autoReply.summary}</h3>
            <p style="margin: 5px 0;"><strong>${lang === 'id' ? 'Nama' : 'Name'}:</strong> ${name}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 15px 0 5px 0;"><strong>${t.message}:</strong></p>
            <p style="background-color: #ffffff; padding: 10px; border-radius: 4px; border-left: 4px solid #7c3aed; white-space: pre-wrap;">${message}</p>
          </div>
          
          <p style="line-height: 1.6; color: #475569;">
            ${t.autoReply.contact}
          </p>
          
          <ul style="color: #475569;">
            <li>Email: ${process.env.SMTP_USER}</li>
            <li>LinkedIn: <a href="https://www.linkedin.com/in/wahyupratomo26/" style="color: #3b5998;">linkedin.com/in/wahyupratomo26</a></li>
            <li>WhatsApp: <a href="https://wa.me/6282286514244" style="color: #25D366;">wa.me/6282286514244</a></li>
          </ul>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px; white-space: pre-line;">
              ${t.autoReply.signature}
            </p>
          </div>
        </div>
      `,
    };

    // Test koneksi sebelum mengirim
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError);
      return NextResponse.json(
        { error: 'Konfigurasi email tidak valid. Silakan hubungi administrator.' },
        { status: 500 }
      );
    }

    // Kirim email ke Anda
    console.log('Sending email to:', process.env.SMTP_USER);
    await transporter.sendMail(mailOptions);
    console.log('Main email sent successfully');
    
    // Kirim balasan otomatis ke pengirim
    console.log('Sending auto-reply to:', email);
    await transporter.sendMail(autoReplyOptions);
    console.log('Auto-reply sent successfully');

    return NextResponse.json(
      { message: t.success },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Detailed error logging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    const t = emailTemplates.id; // Default to Indonesian for errors
    return NextResponse.json(
      { error: t.error },
      { status: 500 }
    );
  }
}
