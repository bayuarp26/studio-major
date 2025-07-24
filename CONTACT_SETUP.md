# Quick Setup: Contact Form Email Integration

## 🚀 Contact Form is Ready!

Your portfolio now has a fully functional contact form that will send emails directly to your inbox when visitors fill it out.

## ⚙️ Quick Setup (5 minutes)

### 1. Gmail App Password Setup
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Security → 2-Step Verification → App passwords
3. Generate new app password for "Mail"
4. Copy the 16-character password

### 2. Update Email Settings
Edit `.env.local` file:
```bash
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
```

### 3. Test It
1. Run: `npm run dev`
2. Go to contact section
3. Fill out the form
4. Check your email!

## ✨ What Happens

When someone fills the contact form:
- **You get**: Professional email with their details
- **They get**: Auto-reply confirmation
- **Both**: Clean, branded email templates

## 📁 Files Modified
- `src/components/sections/ContactProject.tsx` - Contact form with email integration
- `src/app/api/contact/route.ts` - Email sending API
- `.env.local` - Email configuration

## 🔧 Need Help?
Check `docs/email-setup-guide.md` for detailed setup instructions and troubleshooting.

---
**Ready to use!** Your contact form will now send emails directly to your inbox. 📧
