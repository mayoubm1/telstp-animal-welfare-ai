# TELSTP Animal Welfare & Compassion AI

**AI-Powered Veterinary Diagnostics Platform for Cats and Dogs**

A comprehensive web application that provides pet owners with AI-powered symptom checking, visual diagnosis, emergency triage, and access to veterinary knowledge bases. Built with React, tRPC, and powered by advanced AI models.

## 🎯 Mission

To advance animal welfare and human compassion through technology by providing accessible, AI-powered veterinary diagnostics and education for pet owners worldwide, with special focus on serving the Egyptian community and international users.

## ✨ Features

### 🔍 AI-Powered Diagnostics
- **Symptom Checker** - Describe pet symptoms and receive AI-powered assessment with differential diagnosis
- **Visual Diagnosis** - Upload photos for AI analysis of skin conditions, eye problems, dental issues
- **Emergency Triage** - Rapid urgency assessment with immediate action recommendations
- **Case History** - Track symptoms, treatments, and outcomes over time for each pet

### 📚 Knowledge Base
- **Vaccination Protocols** - Age-appropriate vaccination schedules for cats and dogs
- **Dietary Supplements** - Evidence-based supplement information with dosages and interactions
- **Pet Nutrition** - Life-stage specific nutrition guidelines and trusted food brands
- **Medications** - Comprehensive medication database with dosages and side effects

### 🎤 Advanced Features
- **Vocalization Analysis** - Interpret pet sounds to identify pain, stress, or illness
- **Multi-Language Support** - English and Arabic for global accessibility
- **Veterinarian Connection** - Request consultations and share diagnostic data with licensed vets
- **Clinic Finder** - Locate nearby veterinary clinics with directions and contact info

### 👥 User Management
- **Pet Profiles** - Create and manage profiles for multiple pets
- **Secure Authentication** - OAuth-based authentication with Manus
- **Personal Dashboard** - Quick access to all diagnostic tools and pet information
- **Notification System** - Stay updated on important health milestones

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern UI library with hooks
- **Vite** - Lightning-fast build tool
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **tRPC** - End-to-end typesafe APIs
- **Wouter** - Lightweight client-side router

### Backend
- **Express.js** - Fast, minimalist web framework
- **tRPC** - Type-safe RPC framework
- **Drizzle ORM** - Lightweight TypeScript ORM
- **PostgreSQL** - Supabase PostgreSQL database
- **MySQL** - Local development database support

### AI & Services
- **LLM Integration** - Advanced language models for diagnosis
- **Image Generation** - Visual reference creation for conditions
- **Voice Transcription** - Whisper API for audio-to-text
- **Google Maps API** - Clinic location and directions

### Deployment
- **Vercel** - Serverless deployment platform
- **Supabase** - PostgreSQL database hosting
- **GitHub** - Version control and CI/CD

## 📋 Project Structure

```
telstp-animal-welfare-ai/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/           # Utilities and tRPC client
│   │   └── App.tsx        # Main application
│   ├── public/            # Static assets
│   └── index.html         # HTML entry point
├── server/                # Express backend
│   ├── routers.ts         # tRPC procedure definitions
│   ├── db.ts              # Database queries
│   ├── db-adapter.ts      # Dual database support
│   └── _core/             # Core infrastructure
├── drizzle/               # Database schema and migrations
├── supabase/              # Supabase-specific configuration
├── shared/                # Shared types and constants
├── storage/               # S3 storage helpers
├── package.json           # Dependencies
└── vercel.json           # Vercel deployment config
```

## 🚀 Getting Started

### Prerequisites
- Node.js 22+
- pnpm 10+
- MySQL 8+ (local development)
- Supabase account (production)

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/mayoubm1/telstp-animal-welfare-ai.git
cd telstp-animal-welfare-ai
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. **Start development server**
```bash
pnpm dev
```

5. **Open in browser**
```
http://localhost:3000
```

### Database Setup

**For local development (MySQL):**
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE telstp_animal_welfare;"

# Run migrations
pnpm db:push
```

**For production (Supabase):**
1. Create Supabase project
2. Run SQL from `supabase/schema.sql` in SQL Editor
3. Set environment variables

## 📖 Usage

### For Pet Owners

1. **Sign In** - Authenticate using Manus OAuth
2. **Create Pet Profile** - Add your cat or dog with basic information
3. **Use Symptom Checker** - Describe symptoms to get AI-powered assessment
4. **Upload Images** - Share photos for visual diagnosis
5. **Track History** - Monitor your pet's health over time
6. **Consult Vets** - Request consultation with licensed veterinarians

### For Veterinarians

1. **Register Profile** - Set up professional profile
2. **Review Cases** - Access consultation requests from pet owners
3. **Provide Feedback** - Share professional diagnosis and recommendations
4. **Manage Clinic Info** - Update clinic location and services

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test -- knowledge-base.test.ts

# Watch mode
pnpm test -- --watch

# Coverage report
pnpm test -- --coverage
```

## 🔒 Security

- **Authentication** - Secure OAuth flow with Manus
- **Row Level Security** - Database-level access control
- **Environment Variables** - Sensitive data never committed
- **HTTPS Only** - All connections encrypted
- **Input Validation** - Server-side validation for all inputs
- **Rate Limiting** - API rate limiting to prevent abuse

## 📊 Database Schema

Key tables:
- `users` - User accounts and authentication
- `pets` - Pet profiles with medical history
- `cases` - Diagnostic cases and assessments
- `diseases` - Disease database with treatment protocols
- `vaccination_protocols` - Vaccination schedules
- `dietary_supplements` - Supplement information
- `pet_foods` - Nutrition database
- `medications` - Medication reference
- `veterinarians` - Licensed vet profiles
- `consultation_requests` - Vet consultation system

## 🌍 Internationalization

Currently supporting:
- **English** - Full support
- **Arabic** - Full support

To add new languages:
1. Create translation files in `client/locales/`
2. Update language selector in UI
3. Configure i18n provider

## 📈 Performance

- **Optimized Builds** - Tree-shaking and code splitting
- **Lazy Loading** - Components loaded on demand
- **Caching** - Aggressive caching strategies
- **Database Indexes** - Optimized query performance
- **CDN Distribution** - Global content delivery via Vercel

## 🔄 CI/CD Pipeline

Automated workflows:
- **Tests** - Run on every push
- **Build** - Verify production build
- **Deployment** - Auto-deploy to Vercel on main branch
- **Database Migrations** - Applied during deployment

## 🐛 Known Issues

None currently. Please report issues via GitHub Issues.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is part of the TELSTP initiative. All rights reserved.

## 👥 Team

- **TELSTP** - Technology & Life Science Park, Egypt
- **Manus** - AI Platform & Infrastructure

## 📞 Support

For issues, questions, or suggestions:
- GitHub Issues: [Report a bug](https://github.com/mayoubm1/telstp-animal-welfare-ai/issues)
- Email: support@telstp.org
- Website: https://telstp.org

## 🙏 Acknowledgments

This platform is built with the vision of advancing animal welfare and human compassion through technology. Special thanks to:
- Veterinary professionals who provided clinical guidance
- Pet owners who participated in user testing
- The open-source community for excellent tools and libraries

---

**Version:** 1.0.0  
**Last Updated:** February 2, 2026  
**Status:** Production Ready ✅

Made with ❤️ for animal welfare
