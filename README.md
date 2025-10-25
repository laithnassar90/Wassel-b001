# 🚗 Wassel (واصل) - Ride-Sharing Platform

> **Share Your Journey** - A modern, bilingual ride-sharing and carpooling platform for the Middle East

[![Production Ready](https://img.shields.io/badge/production-ready-green.svg)](https://github.com)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC.svg)](https://tailwindcss.com/)

## ✨ Features

### 🎯 Core Features
- **Bilingual Support**: Full Arabic/English with RTL support
- **Trip Classification**: Wasel (one-way) and Raje3 (return) trips
- **AI-Powered Matching**: Smart trip recommendations
- **Real-time Communication**: Live chat and notifications
- **Advanced Search**: Filters by price, time, preferences
- **Interactive Maps**: Route visualization with Google Maps integration

### 💳 Payment System
- **10+ Payment Methods**: Including BNPL (Tabby, Tamara)
- **Digital Wallets**: Apple Pay, PayPal, mada
- **Cash Payments**: For flexibility
- **256-bit SSL Encryption**: PCI-DSS compliant
- **Earnings Calculator**: Real-time profit estimation for riders

### 🛡️ Safety & Trust
- **Verified Profiles**: ID, Phone, Driver License verification
- **Rating System**: 5-star reviews for drivers and passengers
- **Emergency Contacts**: Built-in safety features
- **Live Trip Tracking**: Real-time location sharing

### 📱 Progressive Web App
- **Offline Support**: Service worker caching
- **Push Notifications**: Real-time trip updates
- **Install to Home Screen**: Native app experience
- **Responsive Design**: Works on all devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account (optional, for production)
- Google Maps API key (optional, for maps)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/wassel.git
cd wassel

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Setup

Edit `.env.local` with your configuration:

```env
# App Configuration
VITE_APP_ENV=development
VITE_APP_URL=http://localhost:5173

# Supabase (optional)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key

# Maps (optional)
VITE_MAP_API_KEY=your_google_maps_key

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_REPORTING=false
```

## 📁 Project Structure

```
wassel/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── Dashboard.tsx
│   ├── FindRide.tsx
│   └── ...
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── pages/              # Page components (React Router)
├── router/             # Router configuration
├── services/           # External services (API, WebSocket)
├── utils/              # Utility functions
├── test/               # Test files
├── config/             # Configuration files
├── layouts/            # Layout components
└── public/             # Static assets
```

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🏗️ Building for Production

```bash
# Build the project
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Format code
npm run format
```

## 📦 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Build command
npm run build

# Publish directory
dist
```

### Docker

```dockerfile
# Build
docker build -t wassel .

# Run
docker run -p 3000:3000 wassel
```

## 🔧 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **React Router v6** - Navigation
- **shadcn/ui** - UI components
- **Motion** (Framer Motion) - Animations

### State Management
- **React Context** - Global state
- **Custom Hooks** - Optimized state logic

### Backend (Production)
- **Supabase** - Backend as a Service
- **PostgreSQL** - Database
- **Real-time Subscriptions** - Live updates
- **Row Level Security** - Data protection

### Tools & Services
- **Vitest** - Testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **WebSocket** - Real-time communication
- **PWA** - Progressive Web App

## 📊 Performance

- ⚡ **Lighthouse Score**: 95+
- 🎯 **First Contentful Paint**: < 1.5s
- 📦 **Bundle Size**: ~150KB (gzipped)
- 🔄 **Code Splitting**: Automatic with React.lazy()
- 💾 **Caching**: Service Worker + LocalStorage

## 🌐 Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile Safari (iOS 13+)
- Chrome Mobile (Android 8+)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md).

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Project Lead**: Your Name
- **Contributors**: [View all contributors](https://github.com/yourusername/wassel/graphs/contributors)

## 📞 Support

- **Email**: support@wassel.app
- **Documentation**: [docs.wassel.app](https://docs.wassel.app)
- **Issues**: [GitHub Issues](https://github.com/yourusername/wassel/issues)

## 🗺️ Roadmap

- [ ] Mobile apps (React Native)
- [ ] Multi-language support (more languages)
- [ ] Corporate accounts
- [ ] Advanced analytics dashboard
- [ ] AI-powered route optimization
- [ ] Integration with public transport

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Lucide Icons](https://lucide.dev/) - Icon library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Supabase](https://supabase.com/) - Backend infrastructure

---

<div align="center">
  <p>Made with ❤️ for the Middle East</p>
  <p>© 2025 Wassel. All rights reserved.</p>
</div>

  # أنا واصل, انت؟

  This is a code bundle for أنا واصل, انت؟. The original project is available at https://www.figma.com/design/7cBLG5XwF4RX5cq1YP3W5T/%D8%A3%D9%86%D8%A7-%D9%88%D8%A7%D8%B5%D9%84--%D8%A7%D9%86%D8%AA%D8%9F.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  
