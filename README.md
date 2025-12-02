# JobGen Blog Package

A standalone Blog module package that can be used independently or integrated into other projects.

## 📦 Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS v4
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
│   │   ├── BlogHome.jsx          # Blog home page
│   │   ├── ArticlePage.jsx       # Article detail page
│   │   ├── BlogLayout.jsx        # Blog layout component
│   │   ├── components/           # UI components
│   │   └── admin/                # Admin panel
│   │       ├── AdminLogin.jsx    # Admin login page
│   │       ├── AdminDashboard.jsx # Article management
│   │       └── ArticleEditor.jsx  # Article editor
│   ├── firebase/
│   │   ├── config.js             # Firebase configuration
│   │   ├── articleService.js     # Article CRUD + Cloudinary upload
│   │   └── authService.js        # Authentication service
│   ├── context/
│   │   └── BlogDataContext.jsx   # Global blog data provider
│   └── data/
│       └── blogData.json         # Sample data (for migration)
├── scripts/
│   ├── migrate-to-firebase.js    # Database migration script
│   └── test-database.js          # Database connection test
├── .env                          # Environment variables (create this)
└── package.json
```

## 🔐 Admin Panel

Access the admin panel at `/admin/login`

Features:
- Create, edit, and delete articles
- Upload cover images to Cloudinary
- Manage article metadata (title, category, author, etc.)
- Rich text content editing with Markdown support

## 📝 Available Routes

| Route | Description |
|-------|-------------|
| `/` | Blog home page |
| `/blog` | Blog home page (alias) |
| `/article/:id` | Article detail page |
| `/admin/login` | Admin login |
| `/admin/dashboard` | Article management |
| `/admin/article/:id` | Edit article |
| `/admin/article/new` | Create new article |

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
```

## 🔗 Dependencies

- React 19
- React Router DOM 7
- Firebase (Firestore + Auth)
- Framer Motion
- Lucide React
- React Markdown
- Tailwind CSS v4

## 📄 License

Consistent with the main project.

