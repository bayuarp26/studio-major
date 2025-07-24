// Script untuk test konfigurasi email
// Jalankan dengan: node test-email.js

const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

async function testEmailConfig() {
  console.log('Testing email configuration...');
  console.log('SMTP_USER:', process.env.SMTP_USER);
  console.log('SMTP_PASS length:', process.env.SMTP_PASS?.length);
  
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Test connection
    await transporter.verify();
    console.log('✅ SMTP connection successful!');

    // Test sending email
    const testMail = {
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: 'Test Email from Portfolio',
      text: 'This is a test email to verify the configuration.',
    };

    const result = await transporter.sendMail(testMail);
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', result.messageId);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔧 Fix suggestions:');
      console.log('1. Make sure you\'re using an App Password, not your regular Gmail password');
      console.log('2. Enable 2-Factor Authentication on your Gmail account');
      console.log('3. Generate a new App Password from Google Account settings');
      console.log('4. Remove spaces from the app password in .env.local');
    }
  }
}

testEmailConfig();
