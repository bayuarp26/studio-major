# 🔧 Contact Form Error - Troubleshooting Guide

## Error yang Terjadi
Contact form menampilkan: "Sorry, there was an error sending your message. Please try again or contact me directly."

## 🎯 Kemungkinan Penyebab & Solusi

### 1. Gmail App Password Issue (Paling Umum)

**Solusi:**
1. **Regenerate App Password baru:**
   - Buka: https://myaccount.google.com/security
   - 2-Step Verification → App passwords
   - Hapus password lama untuk "Mail"
   - Generate password baru
   - Copy tanpa spasi: `abcdefghijklmnop`

2. **Update .env.local:**
   ```bash
   SMTP_PASS=password-baru-tanpa-spasi
   ```

### 2. Gmail Security Settings

**Cek & Enable:**
- ✅ 2-Factor Authentication ON
- ✅ Less secure app access OFF (menggunakan app password)
- ✅ Account tidak ter-suspend atau ter-limit

### 3. Network/Firewall Issues

**Cek:**
- Port 587 tidak diblok
- SMTP Gmail tidak diblok oleh ISP
- Koneksi internet stabil

### 4. Environment Variables

**Verifikasi di .env.local:**
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=wahyupratomo@gmail.com
SMTP_PASS=passwordbarutanpaspasi
```

## 🚀 Quick Fix Steps

### Step 1: Generate New App Password
1. Google Account → Security → 2-Step Verification
2. App passwords → Mail → Generate
3. Copy 16-character password

### Step 2: Update Environment
```bash
# Di .env.local
SMTP_PASS=abcd1234efgh5678  # Password baru tanpa spasi
```

### Step 3: Restart Application
```bash
npm run dev
```

### Step 4: Test Contact Form
- Isi form dengan data test
- Submit
- Cek email masuk

## 🔍 Debug Mode

Untuk melihat error detail, cek browser console atau terminal saat submit form.

## 📧 Alternative Solution

Jika masih error, bisa gunakan service email lain:

### SendGrid (Recommended)
```bash
npm install @sendgrid/mail
```

### Mailgun
```bash
npm install mailgun.js
```

## ✅ Verification Checklist

- [ ] 2FA enabled on Gmail
- [ ] New app password generated
- [ ] .env.local updated without spaces
- [ ] Application restarted
- [ ] Form tested with real data

## 🆘 Last Resort

Jika semua gagal, gunakan service seperti Formspree atau Netlify Forms untuk contact form tanpa setup email server.
