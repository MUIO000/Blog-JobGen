# JobGen Blog Package

A modern, feature-rich blog module with interactive UI, 3D elements, and seamless Firebase integration. Can be used independently or integrated into other projects.

## ✨ Key Features

- 🎨 **Interactive Hero Section** - Mouse parallax effects, 3D tilt animations, and shimmer text
- 🎭 **Spline 3D Integration** - Interactive 3D scenes for enhanced visual experience
- 📱 **Responsive Design** - Mobile-first approach with Tailwind CSS v4
- 🔥 **Firebase Backend** - Real-time database and authentication
- ☁️ **Cloudinary CDN** - Optimized image storage and delivery
- 🎯 **Smart Navigation** - Dynamic table of contents with scroll tracking
- 🔗 **Centralized Link Config** - Easy management of all external links
- 📝 **Markdown Support** - Rich content editing with ReactMarkdown
- 🎬 **Framer Motion** - Smooth animations and transitions

## 📦 Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS v4 + Custom Fonts (Poppins, Inter)
- **Animations**: Framer Motion
- **3D Graphics**: Spline (@splinetool/react-spline)
- **Database**: Firebase Firestore
- **Image Storage**: Cloudinary
- **Authentication**: Firebase Auth

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable **Firestore Database** (Start in test mode for development)
4. Enable **Authentication** → Sign-in method → Email/Password
5. Copy your Firebase config from Project Settings → Your apps → Web app

### 4. Cloudinary Setup

1. Go to [Cloudinary Console](https://console.cloudinary.com/)
2. Create a free account if needed
3. Go to **Settings** → **Upload** → **Upload presets**
4. Create an **Unsigned** upload preset
5. Copy your Cloud Name and Upload Preset name

### 5. Initialize Database (First Time Only)

Run the migration script to populate initial data:

```bash
node scripts/migrate-to-firebase.js
```

### 6. Create Admin Account

1. Go to Firebase Console → Authentication → Users
2. Click "Add user" and create an admin account with email/password

### 7. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
blog-frontend/
├── src/
│   ├── pages/
│   │   ├── BlogHome.jsx          # Blog home page with timeline
│   │   ├── ArticlePage.jsx       # Article detail with TOC navigation
│   │   ├── BlogLayout.jsx        # Blog layout with header/footer
│   │   ├── components/
│   │   │   ├── HeroSection.jsx   # Interactive hero with 3D & parallax
│   │   │   ├── TimelineSection.jsx # Article timeline grid
│   │   │   ├── CategoryGrid.jsx  # Category filter grid
│   │   │   ├── CTASection.jsx    # Call-to-action section
│   │   │   └── LoadingScreen.jsx # Animated loading screen
│   │   └── admin/                # Admin panel
│   │       ├── AdminLogin.jsx    # Admin login page
│   │       ├── AdminDashboard.jsx # Article management
│   │       └── ArticleEditor.jsx  # Rich article editor
│   ├── firebase/
│   │   ├── config.js             # Firebase configuration
│   │   ├── articleService.js     # Article CRUD + Cloudinary upload
│   │   └── authService.js        # Authentication service
│   ├── config/
│   │   ├── externalLinks.js      # Centralized external URL config
│   │   └── README.md             # Config documentation
│   ├── context/
│   │   └── BlogDataContext.jsx   # Global blog data provider
│   ├── utils/
│   │   └── animations.js         # Reusable animation variants
│   └── data/
│       └── blogData.json         # Sample data (for migration)
├── scripts/
│   ├── migrate-to-firebase.js    # Database migration script
│   ├── test-database.js          # Database connection test
│   ├── test-firebase-data.js     # Verify Firebase data
│   └── upload-article-images.js  # Batch image upload
├── public/
│   └── jobgenLogo.png           # JobGen logo
├── .env                          # Environment variables (create this)
└── package.json
```

## 🔐 Admin Panel

Access the admin panel at `/admin/login`

Features:
- ✏️ Create, edit, and delete articles
- 🖼️ Upload cover images to Cloudinary
- 📋 Manage article metadata (title, category, author, tags, etc.)
- 📝 Rich text content editing with Markdown support
- 👁️ Real-time preview
- 🔍 Article search and filtering

## 📝 Available Routes

| Route | Description |
|-------|-------------|
| `/` | Blog home page with hero and timeline |
| `/blog` | Blog home page (alias) |
| `/blog/article/:id` | Article detail page with TOC |
| `/admin/login` | Admin login |
| `/admin/dashboard` | Article management dashboard |
| `/admin/article/:id` | Edit existing article |
| `/admin/article/new` | Create new article |

## 🎨 UI Components

### HeroSection
- Interactive mouse parallax effects
- 3D tilt animations on cards
- Spline 3D scene integration
- Shimmer text effects
- Custom Poppins font

### TimelineSection
- Responsive article grid
- Category filtering
- Smooth hover animations
- Phase-based organization

### ArticlePage
- Dynamic table of contents
- Scroll-based active section highlighting
- Related articles recommendations
- JobGen promotion sidebar

## 🔗 External Links Configuration

All external links are centralized in `src/config/externalLinks.js`:

```javascript
import { EXTERNAL_LINKS } from '../config/externalLinks';

// Open link in new tab
window.open(EXTERNAL_LINKS.main.website, '_blank', 'noopener,noreferrer');
```

Categories:
- `main` - Primary website links
- `social` - Social media links
- `company` - About, careers, contact
- `timeline` - Phase-specific CTAs

## 🛠️ Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Test database connection
node scripts/test-database.js

# Migrate data to Firebase
node scripts/migrate-to-firebase.js

# Verify Firebase data
node scripts/test-firebase-data.js

# Upload article images to Cloudinary
node scripts/upload-article-images.js
```

## 🔗 Dependencies

### Core
- React 19
- React Router DOM 7
- Vite

### UI & Animation
- Tailwind CSS v4
- Framer Motion
- @splinetool/react-spline
- Lucide React (icons)

### Backend & Data
- Firebase (Firestore + Auth)
- React Markdown
- Cloudinary (via fetch API)

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Deploy to Vercel/Netlify

1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Add environment variables in deployment settings
4. Deploy!

### Environment Variables for Production

Make sure to set all required environment variables in your hosting platform:
- All Firebase config variables
- Cloudinary credentials

## 🎯 Performance Optimizations

- ⚡ Vite for fast HMR and optimized builds
- 🖼️ Lazy loading images with Cloudinary CDN
- 🎨 CSS purging with Tailwind CSS
- 📦 Code splitting with React Router
- 🔄 Context-based state management (no Redux overhead)
- 🎬 GPU-accelerated animations with Framer Motion

## 🐛 Troubleshooting

### Issue: Firebase not connecting
- Check `.env` file has all required variables
- Verify Firebase project settings
- Ensure Firestore is enabled in Firebase Console

### Issue: Images not uploading
- Verify Cloudinary upload preset is "unsigned"
- Check cloud name and preset name in `.env`
- Ensure CORS is configured in Cloudinary settings

### Issue: Admin login not working
- Create admin user in Firebase Console → Authentication
- Check email/password is correct
- Verify Firebase Auth is enabled

## 📚 Documentation

- [Firebase Setup Guide](./FIREBASE_SETUP.md) (if exists)
- [External Links Config](./src/config/README.md)
- [API Documentation](./docs/API.md) (if exists)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

Consistent with the main project.

