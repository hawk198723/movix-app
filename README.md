# 🎬 Movix - Movie & TV Series Streaming App

A modern movie and TV series streaming application built with React + TypeScript, featuring a Netflix-style user interface.

![Movix App](https://img.shields.io/badge/React-18.3.1-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.10-blue?style=flat-square&logo=tailwindcss)
![Firebase](https://img.shields.io/badge/Firebase-10.13.0-orange?style=flat-square&logo=firebase)
![Vite](https://img.shields.io/badge/Vite-5.4.1-646CFF?style=flat-square&logo=vite)

## ✨ Features

### 🔐 User Authentication
- User registration and login
- Firebase Authentication integration
- Protected routes
- Profile management

### 🎭 Movie & TV Series Browsing
- Browse trending movies and TV shows
- Category browsing (Action, Comedy, Horror, Drama, etc.)
- Top-rated content recommendations
- Netflix-style infinite loop carousel
- Press-and-hold continuous scrolling
- Responsive movie/TV cards
- Separate pages for Movies and TV Series

### 🎬 Content Details
- Detailed movie and TV series information
- Trailer playback (YouTube integration)
- Rating and review system
- Similar content recommendations
- Production information and cast/crew details
- Video background hero banner

### 🔍 Search Functionality
- Real-time movie and TV series search
- TMDb API integration
- Paginated search results
- Optimized search interface

### 📱 User Experience
- 🌓 **Dark/Light Theme Toggle**
- Modern Netflix-style UI
- Fully responsive design (Mobile/Tablet/Desktop)
- Smooth animations and transitions
- Optimized loading states
- Error boundary handling
- Video background support
- Red progress bar loading indicator

### 💾 Personal Collections
- Add/remove favorite movies and TV shows
- Personal favorites list
- Real-time sync with Firebase
- Hover to display detailed information

### 🎨 Advanced UI Features
- **Smart Hover Effects**:
  - Centered play button
  - Dynamic rating circle (color changes based on score)
  - Bottom-aligned content information
  - Smooth fade-in/slide-up animations
- **Infinite Carousel**:
  - Seamless looping with triple-array technique
  - Press-and-hold continuous scrolling
  - Smooth 60fps scrolling experience
- **Theme System**:
  - localStorage persistence
  - Smooth transition animations
  - Global theme switching

## 🛠️ Tech Stack

### Frontend Framework
- **React 18** - Modern UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool
- **React Router** - Client-side routing

### Styling and UI
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Modern icon library
- **Class Variance Authority** - Conditional styling management
- **clsx** - Conditional className utility
- **YouTube IFrame API** - Video playback integration

### State Management and Data
- **React Context** - Global state management (Auth & Theme)
- **Axios** - HTTP client
- **Firebase** - Backend services and authentication
- **localStorage** - Theme persistence

### Development Tools
- **ESLint** - Code quality checker
- **TypeScript ESLint** - TypeScript-specific rules
- **PostCSS** - CSS post-processor
- **Autoprefixer** - CSS browser compatibility

## 🚀 Quick Start

### Requirements
- Node.js 16.0 or higher
- npm or yarn package manager
- TMDb API key
- Firebase project configuration

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/hawk198723/debate_register.git
   cd movix-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env.local` file and add the following configuration:
   ```env
   VITE_TMDB_API_KEY=your_tmdb_api_key
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   
   Open your browser and visit `http://localhost:5173`

## 📱 API Integration

### TMDb API
This application uses [The Movie Database (TMDb) API](https://www.themoviedb.org/documentation/api) to fetch content data:

- Trending movies and TV shows
- Category-based content
- Movie and TV series search
- Detailed content information
- Similar content recommendations
- Video trailers and teasers

### Firebase Services
- **Authentication**: User registration, login, logout
- **Firestore**: User data and favorites list storage
- **Hosting**: Application deployment (optional)

## 🏗️ Project Structure

```
movix-app/
├── public/                 # Static assets
│   └── .htaccess          # SPA routing config
├── src/
│   ├── components/         # React components
│   │   ├── ui/            # Common UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── LoadingBar.tsx
│   │   ├── CommentSection.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── Header.tsx
│   │   ├── HeroBanner.tsx
│   │   ├── MovieCard.tsx
│   │   ├── MovieCarousel.tsx
│   │   └── VideoBackground.tsx
│   ├── context/           # React Context
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utility libraries and config
│   │   ├── firebase.ts
│   │   └── utils.ts
│   ├── pages/             # Page components
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── MovieDetails.tsx
│   │   ├── TVSeries.tsx
│   │   ├── TVSeriesDetails.tsx
│   │   ├── MyList.tsx
│   │   ├── Register.tsx
│   │   └── Search.tsx
│   ├── services/          # API services
│   │   ├── firebase.ts
│   │   ├── mockFirebase.ts
│   │   └── tmdb.ts
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── .github/
│   └── workflows/
│       └── deploy-bluehost.yml  # CI/CD configuration
├── package.json
├── tailwind.config.js     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## 🎨 Design Features

### Netflix-Style Interface
- Dark/Light dual theme support
- Red brand color (#E50914)
- Modern card layouts
- Smooth hover effects
- Video background hero banner

### Responsive Design
- Mobile-first design philosophy
- Perfect adaptation for tablets and desktops
- Flexible grid layouts
- Optimized touch interactions
- Responsive navigation bar

### User Experience Optimization
- Progressive loading animations
- Red progress bar loading indicator
- Smooth page transitions
- Intuitive navigation design
- Smart hover information display
- Dynamic rating circle colors
- Infinite loop carousel experience

### Advanced Interactions
- **Press-and-Hold Scrolling**: Hold arrow buttons to continuously scroll through content
- **Theme Switching**: One-click toggle between dark/light modes
- **Video Trailers**: Click play button to watch YouTube trailers
- **Rating System**: Conic gradient displays rating progress (Green ≥7.0, Yellow 5.0-6.9, Red <5.0)

## 🧪 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Code quality check
npm run lint

# Preview production build
npm run preview
```

## 📦 Build and Deployment

### Local Build
```bash
npm run build
```

Build files will be generated in the `dist/` directory.

### Deployment Options

#### Bluehost (Shared Hosting / cPanel)

1) Manual Deployment (Fastest)

- Run `npm run build` to generate `dist/` directory
- Login to cPanel → File Manager → Navigate to `public_html/`
- Upload all files from `dist/` to `public_html/`
- Make sure to upload `public/.htaccess` to the root directory (`public_html/.htaccess`) for SPA routing
- If you see 404 errors or blank pages on refresh, you're likely missing `.htaccess`

2) GitHub Actions Auto-Deployment (Recommended)

- Add Secrets in your GitHub repository: `FTP_HOST`, `FTP_USERNAME`, `FTP_PASSWORD`
- Default deployment target is `public_html/`, adjustable in `.github/workflows/deploy-bluehost.yml`
- Push to `main` branch to automatically build and sync `dist/` via FTPS

Note: If your Bluehost only supports FTP (not FTPS), change `protocol: ftps` to `ftp` in the workflow file.

#### Vercel Deployment
```bash
npm i -g vercel
vercel
```

#### Netlify Deployment
```bash
npm run build
# Drag and drop the dist directory to Netlify
```

#### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 🔧 Custom Configuration

### Tailwind CSS Theme
Customize colors and styles in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      netflix: {
        red: '#E50914',
        black: '#141414',
        gray: '#2A2A2A',
        lightGray: '#B3B3B3',
      }
    },
    keyframes: {
      'loading-slide': {
        '0%': { transform: 'translateX(-100%)' },
        '100%': { transform: 'translateX(100%)' },
      }
    }
  }
}
```

### Firebase Configuration
Configure Firebase services in `src/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // ...other configuration
}
```

## 🤝 Contributing

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Create a Pull Request

## 📄 License

This project is open-sourced under the MIT License. See the [LICENSE](LICENSE) file for more details.

## 🙏 Acknowledgments

- [The Movie Database (TMDb)](https://www.themoviedb.org/) - Providing movie and TV data API
- [Firebase](https://firebase.google.com/) - Backend services and authentication
- [React](https://reactjs.org/) - Frontend framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide](https://lucide.dev/) - Icon library
- [YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference) - Video playback

---

⭐ If this project helps you, please give it a star!
