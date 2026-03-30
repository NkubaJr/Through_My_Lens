# My Lens

A gallery platform built for young African creatives to share their work and connect with the world.

🌍 **Live:** https://through-my-lens-amber.vercel.app  
💻 **Repo:** https://github.com/NkubaJr/Through_My_Lens

---

## Overview

My Lens gives African youth a space to post their photography, paintings, and digital art alongside the story behind each piece. The idea is simple — art without context is just decoration. Here, every upload requires a written narrative, making the platform less of a portfolio tool and more of a storytelling medium.

Visitors can browse the gallery, filter by country or category, like and comment on pieces, and reach out to artists directly to collaborate or make an offer.

---

## What's built

- User registration and login with JWT sessions
- Artwork upload with up to 5 images and a mandatory story (50 character minimum)
- Public gallery with category and country filters
- Likes, comments, and a Connect with Artist modal
- Artist portfolio page with an inbox showing who reached out
- Admin dashboard for content moderation — hide or delete any artwork
- Forgot/reset password flow via email
- Mobile responsive layout
- Images stored permanently on Cloudinary
- Database hosted on Turso (persistent cloud SQLite)

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React + Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Database | Turso (libSQL) |
| Images | Cloudinary |
| Auth | JWT + bcrypt |
| Frontend hosting | Vercel |
| Backend hosting | Render |

---

## Running locally

You'll need Node.js v18+ and Git.

**Clone the repo**
```bash
git clone https://github.com/NkubaJr/Through_My_Lens.git
cd Through_My_Lens
```

**Backend setup**
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```
JWT_SECRET=any_secret_string_you_choose
PORT=5000
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
TURSO_URL=your_turso_db_url
TURSO_TOKEN=your_turso_auth_token
```

Start the server:
```bash
node server.js
```

Terminal should show:
```
Server running on port 5000
Turso database ready!
Admin account created!
```

**Frontend setup**

Open a second terminal:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```
VITE_API_URL=http://localhost:5000
```

Start the dev server:
```bash
npm run dev
```

App runs at `http://localhost:5173`

---

## Admin access

The admin account is seeded automatically on server start:
```
Email:    admin@mylens.com
Password: mylens_admin_2024
```

Logging in with these credentials redirects to `/admin` where you can hide or delete any content on the platform.

---

## Folder structure
```
Through_My_Lens/
├── backend/
│   ├── routes/
│   │   ├── auth.js          # auth routes — register, login, password reset
│   │   ├── artworks.js      # core routes — gallery, upload, like, comment, connect
│   │   └── upload.js        # handles Cloudinary image uploads
│   ├── database.js          # Turso client, schema init, admin seed
│   └── server.js            # entry point
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # Home, Login, Register, Upload, Profile, ArtworkDetail, Admin
│   │   ├── components/      # Navbar, ArtworkCard, ConnectModal
│   │   └── context/         # AuthContext
│   └── index.html
│
└── README.md
```

---

## Deployment notes

The backend is on Render's free tier — it spins down after inactivity so the first request after a quiet period may take 20–30 seconds to respond. Everything else runs normally after that.

All environment variables are set directly on Render and Vercel — nothing sensitive is in the repository.

---

## SRS Document

Full software requirements specification including use case diagrams, ERD, and sequence diagrams:  
[Add your SRS link here]

---

Igiraneza Nkuba Junior — African Leadership University, 2026
