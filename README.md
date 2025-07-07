# 🚀 Studio Major - Portfolio Website

![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-6.7.0-green?style=for-the-badge&logo=mongodb)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css)

> A modern, multilingual portfolio website built with cutting-edge technologies and best practices.

## ✨ Features

### 🌐 **Multilingual Support**
- **English & Indonesian** language support
- Dynamic content translation
- SEO-optimized metadata for each language
- Automatic locale detection and routing

### 🎨 **Modern UI/UX**
- **Dark/Light theme** toggle with system preference detection
- Responsive design optimized for all devices
- Beautiful animations and transitions
- Professional component library using **Radix UI**

### 🔐 **Admin Dashboard**
- Secure authentication with **JWT**
- Content management system for:
  - Projects portfolio
  - Education history
  - Certificates
  - Skills management
- Image upload functionality
- Real-time form validation

### 🚀 **Performance & SEO**
- **Static Site Generation (SSG)** for lightning-fast loading
- Optimized images with Next.js Image component
- SEO-friendly URLs and metadata
- Google Analytics integration
- Core Web Vitals optimized

### 🛠 **Technical Excellence**
- **100% TypeScript** for type safety
- Modern React patterns with hooks
- Reusable component architecture
- Form validation with **Zod** schema
- Database integration with **MongoDB**
- AI-powered content generation with **Google Genkit**

## 🛠 Tech Stack

### Frontend
- **Next.js 15.3.3** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animation library
- **React Hook Form** - Performant forms
- **Zod** - Schema validation

### Backend & Database
- **MongoDB** - NoSQL database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Google Genkit** - AI integration

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
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
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # Authentication
   JWT_SECRET=your_jwt_secret_key
   
   # AI Integration (Optional)
   GOOGLE_GENAI_API_KEY=your_google_ai_key
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
npm run genkit:dev   # Start AI development server
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js 13+ App Router
│   ├── (main)/            # Main layout group
│   ├── [lang]/            # Internationalized routes
│   └── admin/             # Admin dashboard
├── components/            
│   ├── sections/          # Page sections
│   ├── ui/               # Reusable UI components
│   └── ...               # Feature components
├── lib/                   # Utilities and configurations
│   ├── actions.ts        # Server actions
│   ├── auth.ts           # Authentication logic
│   ├── data.ts           # Data fetching
│   ├── mongodb.ts        # Database connection
│   └── types.ts          # TypeScript types
├── dictionaries/          # Translation files
├── hooks/                # Custom React hooks
└── ai/                   # AI integration
```

## 🌍 Internationalization

This project supports multiple languages with automatic detection:

- **English** (`/en`) - Default language
- **Indonesian** (`/id`) - Bahasa Indonesia

The i18n system automatically:
- Detects user's preferred language
- Generates static pages for each locale
- Provides SEO-friendly URLs
- Switches content dynamically

## 🎯 Key Features Implementation

### Type-Safe Multilingual Content
```typescript
type MultilingualString = {
  [key in Locale]: string;
};

const getText = (field: MultilingualString, lang: Locale): string => {
  return field[lang] || field.en || '';
};
```

### Secure Authentication Flow
```typescript
// JWT-based authentication with secure cookies
export async function createSession(username: string) {
  const payload: SessionPayload = { username, expiresAt };
  const token = sign(payload, SECRET_KEY, { expiresIn: '7d' });
  // Set secure httpOnly cookie
}
```

### Dynamic Content Management
- Real-time CRUD operations
- Image upload with optimization
- Form validation with Zod schemas
- Optimistic UI updates

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on every push to `production` branch

### Manual Deployment
```bash
npm run build
npm run start
```

## 🎨 Design System

The project follows a consistent design system with:
- **Color palette** supporting dark/light themes
- **Typography scale** using Inter font family
- **Component variants** using class-variance-authority
- **Accessibility** first approach with Radix UI

## 📈 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for excellent user experience
- **Bundle Size**: Optimized with tree-shaking and code splitting
- **Loading Speed**: Static generation ensures fast page loads

## 🔧 Development Workflow

1. **Feature Branch**: Create feature branches from `master`
2. **Type Safety**: All code is TypeScript with strict mode
3. **Code Quality**: ESLint and Prettier for consistent code style
4. **Testing**: Build verification before deployment
5. **Production**: Deploy via `production` branch

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Bayu Arp**
- GitHub: [@bayuarp26](https://github.com/bayuarp26)
- Portfolio: [https://www.wahyupratomo.my.id](https://www.wahyupratomo.my.id)

---

<div align="center">

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**

⭐ If you found this project helpful, please give it a star!

</div>
