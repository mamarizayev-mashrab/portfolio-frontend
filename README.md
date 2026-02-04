# Full-Stack Portfolio System

A production-ready, full-stack portfolio system with React frontend, Node.js/Express backend, MongoDB database, JWT authentication, admin panel, and multi-language support (Uzbek, English, Russian).

## 🚀 Features

### Public Portfolio
- **Hero** - Animated typing effect with CTA buttons
- **About** - Storytelling section with manga-style layout
- **Skills** - Category-filtered skills with proficiency bars
- **Projects** - Dynamic grid with hover effects
- **Experience** - Interactive timeline
- **Contact** - Form with validation and email notifications

### Admin Panel
- **Dashboard** - Statistics overview
- **Projects CRUD** - Full management with i18n support
- **Skills CRUD** - Category and proficiency management
- **Experience CRUD** - Timeline entry management
- **Messages** - View and manage contact submissions
- **Settings** - Password change, social links, theme

### Technical Features
- 🌍 **i18n** - 3 languages (UZ, EN, RU)
- 🌓 **Dark/Light Mode** - Persistent theme toggle
- 🔐 **JWT Authentication** - Secure admin access
- 🛡️ **Rate Limiting** - API protection
- 📧 **Email Notifications** - Contact form alerts
- 📱 **Responsive Design** - Mobile-first approach

---

## 📁 Project Structure

```
temporal-ionosphere/
├── backend/           # Node.js/Express API
│   ├── config/        # Database configuration
│   ├── controllers/   # Route handlers
│   ├── middleware/    # Auth, validation, rate limiting
│   ├── models/        # Mongoose schemas
│   ├── routes/        # API endpoints
│   ├── utils/         # Email, seed scripts
│   └── server.js      # Entry point
│
└── frontend/          # React + Vite
    ├── src/
    │   ├── api/       # Axios configuration
    │   ├── components/# UI components
    │   ├── context/   # React Context providers
    │   ├── i18n/      # Translation files
    │   ├── pages/     # Page components
    │   ├── styles/    # Global CSS
    │   └── utils/     # Helpers
    └── index.html
```

---

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd backend
npm install
npm run seed    # Create admin user
npm run dev     # Start on http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev     # Start on http://localhost:5173
```

---

## 🔑 Default Admin Credentials

```
Email: admin@portfolio.com
Password: Admin@123456
```

**⚠️ Change these in production!**

---

## 🌐 API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/login` | Public | Admin login |
| GET | `/api/auth/me` | Private | Get current user |
| POST | `/api/auth/change-password` | Private | Change password |
| GET | `/api/projects` | Public | List projects |
| POST | `/api/projects` | Private | Create project |
| PUT | `/api/projects/:id` | Private | Update project |
| DELETE | `/api/projects/:id` | Private | Delete project |
| GET | `/api/skills` | Public | List skills |
| POST | `/api/skills` | Private | Create skill |
| PUT | `/api/skills/:id` | Private | Update skill |
| DELETE | `/api/skills/:id` | Private | Delete skill |
| GET | `/api/experiences` | Public | List experiences |
| POST | `/api/experiences` | Private | Create experience |
| PUT | `/api/experiences/:id` | Private | Update experience |
| DELETE | `/api/experiences/:id` | Private | Delete experience |
| POST | `/api/messages` | Public | Submit contact form |
| GET | `/api/messages` | Private | List messages |
| DELETE | `/api/messages/:id` | Private | Delete message |
| GET | `/api/settings` | Public | Get settings |
| PUT | `/api/settings` | Private | Update settings |

---

## 🚀 Deployment

### Frontend (Vercel)

1. Push to GitHub
2. Import to Vercel
3. Set environment variable:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```

### Backend (Render/Railway)

1. Push to GitHub
2. Create new web service
3. Set environment variables from `.env.example`
4. Use MongoDB Atlas for database

---

## 📜 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=Admin@123456
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🎨 Design System

- **Colors**: Black/White base with Neon Purple (#a855f7) & Cyan (#06b6d4) accents
- **Typography**: Inter (sans) + JetBrains Mono (mono)
- **Effects**: Glassmorphism, glow shadows, manga panel borders
- **Animations**: Float, pulse, typing cursor, slide transitions

---

## 📄 License

MIT
