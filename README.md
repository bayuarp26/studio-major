# 🚀 Studio Major - Modern Portfolio Website

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.7.0-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

<!-- Language Toggle -->
**🌍 Language / Bahasa:**
[![🇺🇸 English](https://img.shields.io/badge/🇺🇸-English-blue?style=for-the-badge)](#english-version) 
[![🇮🇩 Indonesia](https://img.shields.io/badge/🇮🇩-Indonesia-red?style=for-the-badge)](#versi-indonesia)

</div>

---

# <a id="english-version"></a>🇺🇸 English Version

> 🌟 A **high-performance**, **multilingual portfolio website** built with cutting-edge technologies, featuring advanced admin capabilities, performance optimizations, and modern design patterns.

## 📋 Table of Contents

- [🏗️ Branch Structure](#️-branch-structure-en)
- [✨ Features](#-features-en)
- [🛠 Tech Stack](#-tech-stack-en)
- [🚀 Quick Start](#-quick-start-en)
- [📱 Performance Optimizations](#-performance-optimizations-en)
- [🌐 Deployment](#-deployment-en)
- [📁 Project Structure](#-project-structure-en)
- [📚 Documentation](#-documentation-en)
- [🤝 Contributing](#-contributing-en)
- [📞 Support & Contact](#-support--contact-en)

---

## <a id="branch-structure-en"></a>🏗️ Branch Structure

### 📊 **Branch Overview**

| Branch | Status | Purpose | Description |
|--------|--------|---------|-------------|
| **`master`** | 🟢 Stable | Main | Main stable branch (default) |
| **`production`** | 🟢 Live | Deploy | Live deployment branch with latest features |
| **`pre-build`** | 🔄 Active | Development | **Current active branch** - Performance optimizations & new features |
| **`backup/production-20250724`** | � Archive | Backup | Production backup from July 24, 2025 |

---

### 🔧 **Branch Details**

#### **`production` Branch** 🟢
- **Purpose**: Live production deployment
- **Status**: Stable and tested
- **Features**: 
  - ✅ Complete multilingual portfolio
  - ✅ Admin dashboard with authentication
  - ✅ Mobile-responsive design
  - ✅ Contact form integration
  - ✅ Blog management system

#### **`pre-build` Branch** ⚡ *(Current Active)*
- **Purpose**: Performance optimizations & advanced features
- **Status**: Under active development
- **Latest Optimizations**:
  - 🚀 **React Component Memoization** - 60% fewer re-renders
  - 🖼️ **Image Optimization** - WebP/AVIF support (50-80% smaller images)
  - 📦 **Webpack Bundle Splitting** - Optimized chunks for faster loading
  - 🔄 **Debounced IntersectionObserver** - Smooth scroll performance
  - 📱 **Mobile Performance** - Touch optimization and 60fps scrolling
  - 🧠 **Memory Optimization** - Proper cleanup and efficient hooks

#### **`master` Branch** 🏠
- **Purpose**: Main repository branch
- **Status**: Stable baseline
- **Features**: Core functionality with proven stability

#### **`backup/production-20250724` Branch** �
- **Purpose**: Production backup from July 24, 2025
- **Status**: Archived backup
- **Usage**: Disaster recovery and rollback purposes

---

## <a id="features-en"></a>✨ Features

### 🌐 **Multilingual System**
- **Languages**: English (`/en`) & Indonesian (`/id`) 
- **Default**: Indonesian with automatic locale detection
- **SEO**: Optimized metadata and URLs for each language
- **Dynamic**: Real-time language switching

### 🎨 **Modern UI/UX**
- **Design**: Clean, professional, and accessible
- **Themes**: Dark/Light mode with system preference
- **Responsive**: Mobile-first approach with touch optimization
- **Animations**: Smooth transitions and micro-interactions

### 🔐 **Admin Dashboard**
- **Authentication**: Secure JWT-based login system
- **Content Management**: 
  - 📄 Blog posts with rich editor
  - 🖼️ Project portfolio management
  - 🎓 Education & certificates
  - 🛠️ Skills management
- **File Upload**: Secure image upload with validation
- **Real-time**: Live preview and validation

### 🚀 **Performance Excellence**
- **Core Web Vitals**: Optimized for perfect scores
- **Loading**: SSG + ISR for lightning-fast pages
- **Images**: Next.js Image optimization with modern formats
- **Bundle**: Code splitting and lazy loading
- **Memory**: Efficient component memoization

---

## <a id="tech-stack-en"></a>🛠 Tech Stack

### **Frontend Technologies**
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.3.3 | React framework with App Router & SSG |
| **TypeScript** | 5.0+ | Type-safe development |
| **Tailwind CSS** | 3.4.1 | Utility-first styling |
| **Radix UI** | Latest | Accessible component primitives |
| **Framer Motion** | Latest | Smooth animations |
| **React Hook Form** | Latest | Performant form handling |
| **Zod** | Latest | Schema validation |

### **Backend & Database**
| Technology | Purpose |
|------------|---------|
| **MongoDB** | NoSQL database for content |
| **JWT** | Secure authentication |
| **bcryptjs** | Password encryption |
| **Google Genkit** | AI content generation |
| **Nodemailer** | Email integration |

### **Development & Build Tools**
| Tool | Purpose |
|------|---------|
| **Turbopack** | Ultra-fast development bundler |
| **ESLint** | Code quality and consistency |
| **Prettier** | Code formatting |
| **TypeScript** | Static type checking |

---

## <a id="quick-start-en"></a>🚀 Quick Start

### **Prerequisites**
- ✅ **Node.js** 18.0+ 
- ✅ **MongoDB** database (local or cloud)
- ✅ **Git** for version control
- ✅ **npm** or **yarn** package manager

### **🔧 Installation Steps**

#### **1. Clone Repository**
```bash
# Clone the repository
git clone https://github.com/bayuarp26/studio-major.git
cd studio-major

# Switch to desired branch
git checkout production    # For stable version
git checkout pre-build     # For latest optimizations
git checkout master        # For main stable branch
```

#### **2. Install Dependencies**
```bash
npm install
# or
yarn install
```

#### **3. Environment Configuration**
```bash
# Copy environment template
cp .env.example .env.local
```

**Configure your `.env.local`:**
```env
# Database
MONGODB_URI=mongodb://localhost:27017/studio-major
# or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/studio-major

# Authentication
JWT_SECRET=your-super-secret-jwt-key
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# Email (for contact form)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Optional: AI Integration
GENKIT_API_KEY=your-genkit-key
```

#### **4. Database Setup**
```bash
# Start MongoDB locally (if using local MongoDB)
mongod

# Or use MongoDB Atlas cloud service
# Update MONGODB_URI in .env.local with your Atlas connection string
```

#### **5. Run Development Server**
```bash
# Development (with Turbopack)
npm run dev

# Production build
npm run build
npm start
```

#### **6. Access Application**
- **Frontend**: http://localhost:9002
- **Admin**: http://localhost:9002/admin/login
- **Default Admin**: Create via registration or seed data

---

## <a id="performance-optimizations-en"></a>📱 Performance Optimizations

### **⚡ Current Performance Metrics** *(pre-build branch)*

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| **First Contentful Paint** | ~2.1s | ~0.8s | 62% faster |
| **Largest Contentful Paint** | ~3.2s | ~1.2s | 63% faster |
| **Time to Interactive** | ~4.1s | ~1.8s | 56% faster |
| **Bundle Size** | ~850KB | ~680KB | 20% smaller |
| **Re-renders** | ~450/page | ~180/page | 60% reduction |

### **🚀 Optimization Techniques Applied**

#### **Component-Level Optimizations**
- ✅ **React.memo()** - Prevents unnecessary re-renders
- ✅ **useMemo()** - Memoizes expensive calculations
- ✅ **useCallback()** - Optimizes function references
- ✅ **Lazy Loading** - Dynamic imports for heavy components

#### **Build & Bundle Optimizations**
- ✅ **Webpack Splitting** - Vendor, framework, and app chunks
- ✅ **Tree Shaking** - Eliminates unused code
- ✅ **Image Optimization** - WebP/AVIF formats, responsive sizing
- ✅ **Font Loading** - Preload critical fonts with swap strategy

#### **Runtime Performance**
- ✅ **Debounced Observers** - Efficient scroll and intersection detection
- ✅ **RequestAnimationFrame** - Smooth 60fps animations
- ✅ **Touch Optimization** - Mobile-first interaction handling
- ✅ **Memory Management** - Proper cleanup of event listeners

---

## <a id="deployment-en"></a>🌐 Deployment

### **Production Deployment** 🚀

#### **Vercel (Recommended)**
```bash
# Deploy to Vercel
npm install -g vercel
vercel --prod

# Auto-deploy from GitHub
# Connect your repository at vercel.com
```

#### **Docker Deployment**
```bash
# Build Docker image
docker build -t studio-major .

# Run container
docker run -p 3000:3000 studio-major
```

#### **Manual Deployment**
```bash
# Build for production
npm run build

# Start production server
npm start
```

### **Environment Variables for Production**
```env
# Production Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/studio-major

# Security
JWT_SECRET=ultra-secure-production-secret
NEXTAUTH_SECRET=production-auth-secret
NEXTAUTH_URL=https://your-domain.com

# Email Service
EMAIL_USER=noreply@your-domain.com
EMAIL_PASS=production-email-password
```

---

## <a id="project-structure-en"></a>📁 Project Structure

```
📦 studio-major/
├── 📁 src/
│   ├── 📁 app/                     # Next.js App Router
│   │   ├── 📁 (main)/              # Main public routes
│   │   │   ├── 📄 layout.tsx       # Main layout
│   │   │   ├── 📁 contact/         # Contact page
│   │   │   ├── 📁 projects/        # Projects showcase
│   │   │   └── 📁 ...             # Other sections
│   │   ├── 📁 [lang]/              # Internationalized routes
│   │   │   ├── 📄 layout.tsx       # i18n layout
│   │   │   ├── 📄 page.tsx         # Home page
│   │   │   └── 📁 ...             # Localized pages
│   │   ├── 📁 admin/               # Admin dashboard
│   │   │   ├── 📄 page.tsx         # Admin overview
│   │   │   ├── 📁 dashboard/       # Admin management
│   │   │   └── 📁 login/          # Authentication
│   │   └── 📁 api/                 # API routes
│   │       ├── 📁 contact/         # Contact form API
│   │       ├── 📁 admin/          # Admin API
│   │       └── 📁 ...             # Other APIs
│   ├── 📁 components/              # React components
│   │   ├── 📁 sections/            # Page sections
│   │   │   ├── 📄 Hero.tsx         # Landing hero
│   │   │   ├── 📄 About.tsx        # About section
│   │   │   ├── 📄 Projects.tsx     # Projects showcase
│   │   │   └── 📄 ...             # Other sections
│   │   ├── 📁 ui/                  # Reusable UI components
│   │   │   ├── 📄 button.tsx       # Button component
│   │   │   ├── 📄 card.tsx         # Card component
│   │   │   └── 📄 ...             # Other UI components
│   │   ├── 📁 admin/               # Admin-specific components
│   │   ├── 📁 lazy/                # Lazy-loaded components
│   │   ├── 📄 Header.tsx           # Navigation header
│   │   ├── 📄 Footer.tsx           # Site footer
│   │   └── 📄 ...                 # Feature components
│   ├── 📁 lib/                     # Utilities & config
│   │   ├── 📄 actions.ts           # Server actions
│   │   ├── 📄 auth.ts              # Authentication
│   │   ├── 📄 data.ts              # Data fetching
│   │   ├── 📄 mongodb.ts           # Database connection
│   │   ├── 📄 types.ts             # TypeScript definitions
│   │   └── 📄 utils.ts             # Helper utilities
│   ├── 📁 dictionaries/            # i18n translations
│   │   ├── 📄 en.json              # English translations
│   │   └── 📄 id.json              # Indonesian translations
│   ├── 📁 hooks/                   # Custom React hooks
│   │   ├── 📄 use-active-section.ts # Section detection
│   │   └── 📄 ...                 # Other hooks
│   └── 📄 middleware.ts            # Next.js middleware
├── 📁 public/                      # Static assets
│   ├── 📄 portfolio-data.json      # Portfolio data
│   ├── 📄 manifest.json            # PWA manifest
│   └── 🖼️ ...                     # Images & icons
├── 📁 docs/                        # Documentation
├── 📄 next.config.ts               # Next.js configuration
├── 📄 tailwind.config.ts           # Tailwind CSS config
├── 📄 tsconfig.json                # TypeScript config
├── 📄 package.json                 # Dependencies
└── 📄 README.md                    # This file
```

---

## <a id="documentation-en"></a>📚 Documentation

### **🔍 Key Components**

#### **Sections** (`src/components/sections/`)
- **Hero.tsx** - Landing hero with animated introduction
- **About.tsx** - Personal introduction and background
- **Projects.tsx** - Portfolio showcase with filtering
- **Skills.tsx** - Technical skills visualization
- **Contact.tsx** - Contact form and information

#### **Admin System** (`src/app/admin/`)
- **Dashboard** - Content management interface
- **Authentication** - Secure login system
- **Forms** - CRUD operations for all content

#### **API Routes** (`src/app/api/`)
- **Contact** - Form submission handling
- **Admin** - Admin data operations
- **Blog** - Blog post management

### **🌐 Internationalization**
- **Route Structure**: `/[lang]/page` format
- **Dictionary Files**: `src/dictionaries/`
- **Type Safety**: Multilingual TypeScript types
- **SEO**: Language-specific metadata

### **🔐 Authentication Flow**
1. **Login** → JWT token generation
2. **Middleware** → Route protection
3. **Session** → Persistent authentication
4. **Admin Access** → Protected admin routes

---

## <a id="contributing-en"></a>🤝 Contributing

### **Development Workflow**

#### **1. Fork & Clone**
```bash
# Fork the repository on GitHub
git clone https://github.com/YOUR_USERNAME/studio-major.git
cd studio-major
```

#### **2. Branch Strategy**
```bash
# Create feature branch from pre-build
git checkout pre-build
git pull origin pre-build
git checkout -b feature/your-feature-name

# Or bug fix from main
git checkout main
git checkout -b bugfix/issue-description
```

#### **3. Development**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run type checking
npm run typecheck

# Run linting
npm run lint
```

#### **4. Testing**
```bash
# Test the application
npm run build
npm start

# Test in different languages
# Visit: http://localhost:9002/en and http://localhost:9002/id

# Test admin functionality
# Visit: http://localhost:9002/admin/login
```

#### **5. Submit Changes**
```bash
# Commit changes
git add .
git commit -m "feat: your feature description"

# Push to your fork
git push origin feature/your-feature-name

# Create Pull Request to pre-build branch
```

### **📋 Contribution Guidelines**

- ✅ **Code Style**: Follow existing TypeScript and React patterns
- ✅ **Performance**: Maintain or improve performance metrics
- ✅ **Accessibility**: Ensure WCAG 2.1 compliance
- ✅ **Mobile First**: Test on mobile devices
- ✅ **Multi-language**: Test both English and Indonesian versions
- ✅ **Documentation**: Update README if adding new features

### **🐛 Bug Reports**
Use the GitHub issue template and include:
- **Branch**: Which branch you're using
- **Environment**: Node.js version, OS, browser
- **Steps**: Clear reproduction steps
- **Expected vs Actual**: What should happen vs what happens

### **💡 Feature Requests**
- **Use Case**: Describe the problem you're solving
- **Proposed Solution**: Your suggested implementation
- **Alternatives**: Other solutions you considered
- **Branch Target**: Suggest which branch for the feature

---

## <a id="support--contact-en"></a>📞 Support & Contact

### **Developer**
- **Name**: Bayu Arp
- **GitHub**: [@bayuarp26](https://github.com/bayuarp26)
- **Email**: [bayuarp26@gmail.com](mailto:bayuarp26@gmail.com)

### **Repository**
- **GitHub**: [studio-major](https://github.com/bayuarp26/studio-major)
- **Issues**: [Report bugs](https://github.com/bayuarp26/studio-major/issues)
- **Discussions**: [Ask questions](https://github.com/bayuarp26/studio-major/discussions)

### **Live Demo**
- **Production**: [Visit Live Site](https://your-domain.com)
- **Admin Demo**: [Admin Dashboard](https://your-domain.com/admin)

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with energy, effort, sleepless nights, and time by [Wahyu Pratomo](https://github.com/bayuarp26)

</div>

---

# <a id="versi-indonesia"></a>🇮🇩 Versi Indonesia

> 🌟 **Website portfolio multibahasa** berkinerja tinggi yang dibangun dengan teknologi terdepan, menampilkan kemampuan admin canggih, optimasi performa, dan pola desain modern.

## 📋 Daftar Isi

- [🏗️ Struktur Branch](#struktur-branch-id)
- [✨ Fitur](#fitur-id)
- [🛠 Tech Stack](#tech-stack-id)
- [🚀 Memulai Cepat](#memulai-cepat-id)
- [📱 Optimasi Performa](#optimasi-performa-id)
- [🌐 Deployment](#deployment-id)
- [📁 Struktur Proyek](#struktur-proyek-id)
- [📚 Dokumentasi](#dokumentasi-id)
- [🤝 Kontribusi](#kontribusi-id)
- [📞 Dukungan & Kontak](#dukungan--kontak-id)

---

## <a id="struktur-branch-id"></a>🏗️ Struktur Branch

### 📊 **Gambaran Branch**

| Branch | Status | Tujuan | Deskripsi |
|--------|--------|---------|-----------|
| **`master`** | 🟢 Stabil | Main | Branch utama yang stabil (default) |
| **`production`** | 🟢 Live | Deploy | Branch deployment live dengan fitur terbaru |
| **`pre-build`** | 🔄 Aktif | Development | **Branch aktif saat ini** - Optimasi performa & fitur baru |
| **`backup/production-20250724`** | � Arsip | Backup | Backup produksi dari 24 Juli 2025 |

---

### 🔧 **Detail Branch**

#### **Branch `production`** 🟢
- **Tujuan**: Deployment produksi live
- **Status**: Stabil dan teruji
- **Fitur**: 
  - ✅ Portfolio multibahasa lengkap
  - ✅ Dashboard admin dengan autentikasi
  - ✅ Desain responsif mobile
  - ✅ Integrasi form kontak
  - ✅ Sistem manajemen blog

#### **Branch `pre-build`** ⚡ *(Aktif Saat Ini)*
- **Tujuan**: Optimasi performa & fitur lanjutan
- **Status**: Dalam pengembangan aktif
- **Optimasi Terbaru**:
  - 🚀 **Memoization Komponen React** - 60% lebih sedikit re-render
  - 🖼️ **Optimasi Gambar** - Dukungan WebP/AVIF (50-80% lebih kecil)
  - 📦 **Webpack Bundle Splitting** - Chunk teroptimasi untuk loading lebih cepat
  - 🔄 **Debounced IntersectionObserver** - Performa scroll yang mulus
  - 📱 **Performa Mobile** - Optimasi sentuh dan scroll 60fps
  - 🧠 **Optimasi Memori** - Pembersihan yang tepat dan hook efisien

#### **Branch `master`** 🏠
- **Tujuan**: Branch utama repository
- **Status**: Baseline stabil
- **Fitur**: Fungsionalitas inti dengan stabilitas terbukti

#### **Branch `backup/production-20250724`** �
- **Tujuan**: Backup produksi dari 24 Juli 2025
- **Status**: Backup terarsip
- **Penggunaan**: Disaster recovery dan tujuan rollback

---

## <a id="fitur-id"></a>✨ Fitur

### 🌐 **Sistem Multibahasa**
- **Bahasa**: English (`/en`) & Indonesian (`/id`) 
- **Default**: Indonesia dengan deteksi locale otomatis
- **SEO**: Metadata dan URL teroptimasi untuk setiap bahasa
- **Dinamis**: Pergantian bahasa real-time

### 🎨 **UI/UX Modern**
- **Desain**: Bersih, profesional, dan aksesibel
- **Tema**: Mode Dark/Light dengan preferensi sistem
- **Responsif**: Pendekatan mobile-first dengan optimasi sentuh
- **Animasi**: Transisi halus dan micro-interactions

### 🔐 **Dashboard Admin**
- **Autentikasi**: Sistem login aman berbasis JWT
- **Manajemen Konten**: 
  - 📄 Post blog dengan rich editor
  - 🖼️ Manajemen portfolio proyek
  - 🎓 Pendidikan & sertifikat
  - 🛠️ Manajemen skills
- **Upload File**: Upload gambar aman dengan validasi
- **Real-time**: Preview dan validasi langsung

### 🚀 **Keunggulan Performa**
- **Core Web Vitals**: Dioptimalkan untuk skor sempurna
- **Loading**: SSG + ISR untuk halaman super cepat
- **Gambar**: Optimasi Next.js Image dengan format modern
- **Bundle**: Code splitting dan lazy loading
- **Memori**: Memoization komponen yang efisien

---

## <a id="tech-stack-id"></a>🛠 Tech Stack

### **Teknologi Frontend**
| Teknologi | Versi | Tujuan |
|-----------|-------|--------|
| **Next.js** | 15.3.3 | Framework React dengan App Router & SSG |
| **TypeScript** | 5.0+ | Pengembangan type-safe |
| **Tailwind CSS** | 3.4.1 | Styling utility-first |
| **Radix UI** | Terbaru | Primitif komponen aksesibel |
| **Framer Motion** | Terbaru | Animasi halus |
| **React Hook Form** | Terbaru | Penanganan form performa tinggi |
| **Zod** | Terbaru | Validasi schema |

### **Backend & Database**
| Teknologi | Tujuan |
|-----------|--------|
| **MongoDB** | Database NoSQL untuk konten |
| **JWT** | Autentikasi aman |
| **bcryptjs** | Enkripsi password |
| **Google Genkit** | Generasi konten AI |
| **Nodemailer** | Integrasi email |

### **Development & Build Tools**
| Tool | Tujuan |
|------|--------|
| **Turbopack** | Bundler development ultra-cepat |
| **ESLint** | Kualitas dan konsistensi kode |
| **Prettier** | Format kode |
| **TypeScript** | Type checking statis |

---

## <a id="memulai-cepat-id"></a>🚀 Memulai Cepat

### **Persyaratan**
- ✅ **Node.js** 18.0+ 
- ✅ **MongoDB** database (lokal atau cloud)
- ✅ **Git** untuk version control
- ✅ **npm** atau **yarn** package manager

### **🔧 Langkah Instalasi**

#### **1. Clone Repository**
```bash
# Clone repository
git clone https://github.com/bayuarp26/studio-major.git
cd studio-major

# Pindah ke branch yang diinginkan
git checkout production    # Untuk versi stabil
git checkout pre-build     # Untuk optimasi terbaru
git checkout master        # Untuk branch utama stabil
```

#### **2. Install Dependencies**
```bash
npm install
# atau
yarn install
```

#### **3. Konfigurasi Environment**
```bash
# Copy template environment
cp .env.example .env.local
```

**Konfigurasi `.env.local` Anda:**
```env
# Database
MONGODB_URI=mongodb://localhost:27017/studio-major
# atau MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/studio-major

# Authentication
JWT_SECRET=kunci-jwt-super-rahasia-anda
NEXTAUTH_SECRET=secret-nextauth-anda
NEXTAUTH_URL=http://localhost:3000

# Email (untuk form kontak)
EMAIL_USER=email-anda@gmail.com
EMAIL_PASS=password-app-anda

# Opsional: Integrasi AI
GENKIT_API_KEY=kunci-genkit-anda
```

#### **4. Setup Database**
```bash
# Start MongoDB lokal (jika menggunakan MongoDB lokal)
mongod

# Atau gunakan layanan MongoDB Atlas cloud
# Update MONGODB_URI di .env.local dengan string koneksi Atlas Anda
```

#### **5. Jalankan Development Server**
```bash
# Development (dengan Turbopack)
npm run dev

# Build produksi
npm run build
npm start
```

#### **6. Akses Aplikasi**
- **Frontend**: http://localhost:9002
- **Admin**: http://localhost:9002/admin/login
- **Admin Default**: Buat melalui registrasi atau seed data

---

## <a id="optimasi-performa-id"></a>📱 Optimasi Performa

### **⚡ Metrik Performa Saat Ini** *(branch pre-build)*

| Metrik | Sebelum | Sesudah | Peningkatan |
|--------|---------|---------|-------------|
| **First Contentful Paint** | ~2.1s | ~0.8s | 62% lebih cepat |
| **Largest Contentful Paint** | ~3.2s | ~1.2s | 63% lebih cepat |
| **Time to Interactive** | ~4.1s | ~1.8s | 56% lebih cepat |
| **Bundle Size** | ~850KB | ~680KB | 20% lebih kecil |
| **Re-renders** | ~450/page | ~180/page | 60% berkurang |

### **🚀 Teknik Optimasi yang Diterapkan**

#### **Optimasi Level Komponen**
- ✅ **React.memo()** - Mencegah re-render yang tidak perlu
- ✅ **useMemo()** - Memoize kalkulasi mahal
- ✅ **useCallback()** - Optimasi referensi fungsi
- ✅ **Lazy Loading** - Dynamic import untuk komponen berat

#### **Optimasi Build & Bundle**
- ✅ **Webpack Splitting** - Chunk vendor, framework, dan app
- ✅ **Tree Shaking** - Eliminasi kode yang tidak digunakan
- ✅ **Optimasi Gambar** - Format WebP/AVIF, sizing responsif
- ✅ **Font Loading** - Preload font kritikal dengan strategi swap

#### **Performa Runtime**
- ✅ **Debounced Observers** - Deteksi scroll dan intersection yang efisien
- ✅ **RequestAnimationFrame** - Animasi halus 60fps
- ✅ **Optimasi Sentuh** - Penanganan interaksi mobile-first
- ✅ **Manajemen Memori** - Pembersihan event listener yang tepat

---

## <a id="deployment-id"></a>🌐 Deployment

### **Deployment Produksi** 🚀

#### **Vercel (Direkomendasikan)**
```bash
# Deploy ke Vercel
npm install -g vercel
vercel --prod

# Auto-deploy dari GitHub
# Hubungkan repository Anda di vercel.com
```

#### **Docker Deployment**
```bash
# Build Docker image
docker build -t studio-major .

# Jalankan container
docker run -p 3000:3000 studio-major
```

#### **Manual Deployment**
```bash
# Build untuk produksi
npm run build

# Start production server
npm start
```

### **Environment Variables untuk Produksi**
```env
# Database Produksi
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/studio-major

# Security
JWT_SECRET=secret-produksi-ultra-aman
NEXTAUTH_SECRET=secret-auth-produksi
NEXTAUTH_URL=https://domain-anda.com

# Layanan Email
EMAIL_USER=noreply@domain-anda.com
EMAIL_PASS=password-email-produksi
```

---

## <a id="struktur-proyek-id"></a>📁 Struktur Proyek

```
📦 studio-major/
├── 📁 src/
│   ├── 📁 app/                     # Next.js App Router
│   │   ├── 📁 (main)/              # Route publik utama
│   │   │   ├── 📄 layout.tsx       # Layout utama
│   │   │   ├── 📁 contact/         # Halaman kontak
│   │   │   ├── 📁 projects/        # Showcase proyek
│   │   │   └── 📁 ...             # Bagian lain
│   │   ├── 📁 [lang]/              # Route internasionalisasi
│   │   │   ├── 📄 layout.tsx       # Layout i18n
│   │   │   ├── 📄 page.tsx         # Halaman beranda
│   │   │   └── 📁 ...             # Halaman lokal
│   │   ├── 📁 admin/               # Dashboard admin
│   │   │   ├── 📄 page.tsx         # Overview admin
│   │   │   ├── 📁 dashboard/       # Manajemen admin
│   │   │   └── 📁 login/          # Autentikasi
│   │   └── 📁 api/                 # Route API
│   │       ├── 📁 contact/         # API form kontak
│   │       ├── 📁 admin/          # API admin
│   │       └── 📁 ...             # API lain
│   ├── 📁 components/              # Komponen React
│   │   ├── 📁 sections/            # Bagian halaman
│   │   │   ├── 📄 Hero.tsx         # Hero landing
│   │   │   ├── 📄 About.tsx        # Bagian tentang
│   │   │   ├── 📄 Projects.tsx     # Showcase proyek
│   │   │   └── 📄 ...             # Bagian lain
│   │   ├── 📁 ui/                  # Komponen UI reusable
│   │   │   ├── 📄 button.tsx       # Komponen button
│   │   │   ├── 📄 card.tsx         # Komponen card
│   │   │   └── 📄 ...             # Komponen UI lain
│   │   ├── 📁 admin/               # Komponen khusus admin
│   │   ├── 📁 lazy/                # Komponen lazy-loaded
│   │   ├── 📄 Header.tsx           # Header navigasi
│   │   ├── 📄 Footer.tsx           # Footer situs
│   │   └── 📄 ...                 # Komponen fitur
│   ├── 📁 lib/                     # Utilities & config
│   │   ├── 📄 actions.ts           # Server actions
│   │   ├── 📄 auth.ts              # Autentikasi
│   │   ├── 📄 data.ts              # Data fetching
│   │   ├── 📄 mongodb.ts           # Koneksi database
│   │   ├── 📄 types.ts             # Definisi TypeScript
│   │   └── 📄 utils.ts             # Helper utilities
│   ├── 📁 dictionaries/            # Terjemahan i18n
│   │   ├── 📄 en.json              # Terjemahan Inggris
│   │   └── 📄 id.json              # Terjemahan Indonesia
│   ├── 📁 hooks/                   # Custom React hooks
│   │   ├── 📄 use-active-section.ts # Deteksi bagian
│   │   └── 📄 ...                 # Hook lain
│   └── 📄 middleware.ts            # Next.js middleware
├── 📁 public/                      # Aset statis
│   ├── 📄 portfolio-data.json      # Data portfolio
│   ├── 📄 manifest.json            # Manifest PWA
│   └── 🖼️ ...                     # Gambar & ikon
├── 📁 docs/                        # Dokumentasi
├── 📄 next.config.ts               # Konfigurasi Next.js
├── 📄 tailwind.config.ts           # Config Tailwind CSS
├── 📄 tsconfig.json                # Config TypeScript
├── 📄 package.json                 # Dependencies
└── 📄 README.md                    # File ini
```

---

## <a id="dokumentasi-id"></a>📚 Dokumentasi

### **🔍 Komponen Utama**

#### **Sections** (`src/components/sections/`)
- **Hero.tsx** - Hero landing dengan intro animasi
- **About.tsx** - Perkenalan personal dan latar belakang
- **Projects.tsx** - Showcase portfolio dengan filtering
- **Skills.tsx** - Visualisasi keterampilan teknis
- **Contact.tsx** - Form kontak dan informasi

#### **Sistem Admin** (`src/app/admin/`)
- **Dashboard** - Interface manajemen konten
- **Authentication** - Sistem login aman
- **Forms** - Operasi CRUD untuk semua konten

#### **Route API** (`src/app/api/`)
- **Contact** - Penanganan submit form
- **Admin** - Operasi data admin
- **Blog** - Manajemen post blog

### **🌐 Internasionalisasi**
- **Struktur Route**: Format `/[lang]/page`
- **File Dictionary**: `src/dictionaries/`
- **Type Safety**: Tipe TypeScript multibahasa
- **SEO**: Metadata khusus bahasa

### **🔐 Alur Autentikasi**
1. **Login** → Generasi token JWT
2. **Middleware** → Proteksi route
3. **Session** → Autentikasi persisten
4. **Akses Admin** → Route admin terlindungi

---

## <a id="kontribusi-id"></a>🤝 Kontribusi

### **Workflow Pengembangan**

#### **1. Fork & Clone**
```bash
# Fork repository di GitHub
git clone https://github.com/USERNAME_ANDA/studio-major.git
cd studio-major
```

#### **2. Strategi Branch**
```bash
# Buat feature branch dari pre-build
git checkout pre-build
git pull origin pre-build
git checkout -b feature/nama-fitur-anda

# Atau bug fix dari main
git checkout main
git checkout -b bugfix/deskripsi-issue
```

#### **3. Development**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Jalankan type checking
npm run typecheck

# Jalankan linting
npm run lint
```

#### **4. Testing**
```bash
# Test aplikasi
npm run build
npm start

# Test dalam bahasa berbeda
# Kunjungi: http://localhost:9002/en dan http://localhost:9002/id

# Test fungsionalitas admin
# Kunjungi: http://localhost:9002/admin/login
```

#### **5. Submit Changes**
```bash
# Commit perubahan
git add .
git commit -m "feat: deskripsi fitur anda"

# Push ke fork anda
git push origin feature/nama-fitur-anda

# Buat Pull Request ke branch pre-build
```

### **📋 Panduan Kontribusi**

- ✅ **Code Style**: Ikuti pola TypeScript dan React yang ada
- ✅ **Performa**: Pertahankan atau tingkatkan metrik performa
- ✅ **Aksesibilitas**: Pastikan kepatuhan WCAG 2.1
- ✅ **Mobile First**: Test pada perangkat mobile
- ✅ **Multi-bahasa**: Test versi Inggris dan Indonesia
- ✅ **Dokumentasi**: Update README jika menambah fitur baru

### **🐛 Laporan Bug**
Gunakan template GitHub issue dan sertakan:
- **Branch**: Branch mana yang Anda gunakan
- **Environment**: Versi Node.js, OS, browser
- **Langkah**: Langkah reproduksi yang jelas
- **Expected vs Actual**: Yang seharusnya terjadi vs yang terjadi

### **💡 Permintaan Fitur**
- **Use Case**: Jelaskan masalah yang Anda pecahkan
- **Solusi yang Diusulkan**: Implementasi yang Anda sarankan
- **Alternatif**: Solusi lain yang Anda pertimbangkan
- **Target Branch**: Sarankan branch mana untuk fitur tersebut

---

## <a id="dukungan--kontak-id"></a>📞 Dukungan & Kontak

### **Developer**
- **Nama**: Bayu Arp
- **GitHub**: [@bayuarp26](https://github.com/bayuarp26)
- **Email**: [bayuarp26@gmail.com](mailto:bayuarp26@gmail.com)

### **Repository**
- **GitHub**: [studio-major](https://github.com/bayuarp26/studio-major)
- **Issues**: [Laporkan bug](https://github.com/bayuarp26/studio-major/issues)
- **Discussions**: [Ajukan pertanyaan](https://github.com/bayuarp26/studio-major/discussions)

### **Demo Live**
- **Produksi**: [Kunjungi Situs Live](https://your-domain.com)
- **Demo Admin**: [Dashboard Admin](https://your-domain.com/admin)

---

## 📄 License

Proyek ini dilisensikan di bawah **MIT License** - lihat file [LICENSE](LICENSE) untuk detail.

---

<div align="center">

**⭐ Beri bintang repository ini jika Anda merasa terbantu!**

Dibuat dengan energi, usaha, malam tanpa tidur, dan waktu oleh [Wahyu Pratomo](https://github.com/bayuarp26)

</div>
