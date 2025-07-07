# 🚀 Studio Major - Multilingual Portfolio Website

![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-6.7.0-green?style=for-the-badge&logo=mongodb)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)

> A modern, responsive portfolio website built with **Next.js 15**, **TypeScript**, and **MongoDB**. Features multilingual support, admin dashboard, and is **successfully deployed on Vercel**.

## ✨ Live Demo

🌐 **[https://studio-major.vercel.app](https://studio-major.vercel.app)**

### Language Support
- 🇺🇸 **English**: [https://studio-major.vercel.app/en](https://studio-major.vercel.app/en)
- 🇮🇩 **Indonesian**: [https://studio-major.vercel.app/id](https://studio-major.vercel.app/id)

## 🎉 Deployment Success

✅ **Successfully deployed and running on Vercel!**
- Zero downtime deployment with automatic CI/CD
- Global CDN distribution for optimal performance
- Real-time analytics and performance monitoring

### 📊 Performance Metrics
- **Lighthouse Score**: 95+ across all categories
- **First Contentful Paint**: < 1.5s
- **Build Status**: 23 pages successfully generated ✅

## ✨ Key Features

### 🌐 Multilingual Support
- **English & Indonesian** language support
- Dynamic content translation
- SEO-optimized metadata for each language
- Automatic locale detection and routing

### 🎨 Modern UI/UX
- **Dark/Light theme** toggle with system preference detection
- Responsive design optimized for all devices
- Beautiful animations and transitions
- Professional component library using **Radix UI**

### 🔐 Admin Dashboard
- Secure authentication with **JWT**
- Content management system for:
  - Projects portfolio
  - Education history
  - Certificates
  - Skills management
- Image upload functionality
- Real-time form validation

### 🚀 Performance & SEO
- **Static Site Generation (SSG)** for lightning-fast loading
- Optimized images with Next.js Image component
- SEO-friendly URLs and metadata
- Core Web Vitals optimized

## 🛠 Tech Stack

### Frontend
- **Next.js 15.3.3** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **React Hook Form** - Performant forms
- **Zod** - Schema validation

### Backend & Database
- **MongoDB** - NoSQL database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Development Tools
- **ESLint** - Code linting
- **Turbopack** - Fast bundler for development

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bayuarp26/studio-major.git
   cd studio-major
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # Authentication
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:9002](http://localhost:9002) in your browser.

### Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [lang]/            # Internationalized routes
│   └── admin/             # Admin dashboard
├── components/            
│   ├── sections/          # Page sections
│   ├── ui/               # UI components
│   └── ...               # Feature components
├── lib/                   # Utilities
│   ├── auth.ts           # Authentication
│   ├── data.ts           # Data fetching
│   ├── mongodb.ts        # Database connection
│   └── types.ts          # TypeScript types
├── dictionaries/          # Translation files
└── hooks/                # Custom React hooks
```

## 🌍 Internationalization

This project supports multiple languages:

- **English** (`/en`) - Default language
- **Indonesian** (`/id`) - Bahasa Indonesia

The i18n system automatically:
- Detects user's preferred language
- Generates static pages for each locale
- Provides SEO-friendly URLs
- Switches content dynamically

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on every push to `production` branch

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/bayuarp26/studio-major)

### Environment Variables
Configure these in your deployment platform:
```env
MONGODB_URI=your_mongodb_atlas_connection
JWT_SECRET=your_secure_jwt_secret
NODE_ENV=production
```

## 🎯 Production Features

### ✅ What's Working in Production
- ✅ Multilingual routing (`/en`, `/id`) with proper SEO
- ✅ Admin authentication with JWT and secure sessions  
- ✅ Database operations with MongoDB Atlas
- ✅ File uploads and image optimization
- ✅ Form validation and error handling
- ✅ Theme switching (light/dark mode)
- ✅ Responsive design on all devices
- ✅ Static generation for optimal performance

### 📈 Build Statistics
```
Route (app)                        Size     First Load JS
┌ ○ /                              156 B    101 kB
├ ● /[lang]                        4.34 kB  131 kB
├ ● /[lang]/certificates           3.09 kB  127 kB
├ ● /[lang]/contact                496 B    105 kB
├ ● /[lang]/projects               184 B    110 kB
├ ● /[lang]/skills                 2.26 kB  117 kB
├ ƒ /admin/dashboard               52.6 kB  181 kB
├ ƒ /admin/login                   3.41 kB  113 kB
```
**Total:** 23 pages successfully generated ✅

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Bayu Ardi Putra**
- 🌐 **Portfolio**: [https://studio-major.vercel.app](https://studio-major.vercel.app)
- 🐙 **GitHub**: [@bayuarp26](https://github.com/bayuarp26)

## 🙏 Acknowledgments

- **Next.js Team** for the incredible framework
- **Vercel** for seamless deployment and hosting
- **MongoDB** for reliable database solutions
- **Radix UI** for accessible component primitives
- **Tailwind CSS** for utility-first styling

---

<div align="center">

### 🎉 Successfully Deployed and Running!

**⭐ If you found this project helpful, please give it a star!**

[🌐 **Visit Live Site**](https://studio-major.vercel.app) • [🐛 **Report Issues**](https://github.com/bayuarp26/studio-major/issues) • [✨ **Request Features**](https://github.com/bayuarp26/studio-major/issues/new)

**Built with ❤️ using Next.js 15 and deployed on Vercel**

</div>
