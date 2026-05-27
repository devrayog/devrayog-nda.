# Devrayog NDA AI

## Setup Instructions

### 1. Install dependencies
```bash
npm install
```

### 2. Run database schema
- Go to your Supabase project → SQL Editor
- Copy contents of `schema.sql` and run it
- This creates all tables, RLS policies, triggers, and seed data

### 3. Create admin account
- Go to Supabase → Authentication → Users → Add user
- Email: devrayog@gmail.com, Password: 1234567890
- Then run in SQL Editor:
  ```sql
  UPDATE profiles SET is_admin = true WHERE email = 'devrayog@gmail.com';
  ```

### 4. Configure AI
- Login as admin → /admin/settings
- Select AI provider (Groq recommended - free)
- Paste your Groq API key from console.groq.com
- Click Test Connection

### 5. Run locally
```bash
npm run dev
```

### 6. Deploy to Vercel
```bash
npm run build
# Then drag dist/ folder to vercel.com or connect GitHub repo
```

## Key URLs
- `/` - Landing page
- `/signup` - Waitlist join
- `/get-inside` - Account creation (invite only)
- `/login` - Login
- `/dashboard` - Student dashboard
- `/admin` - Admin panel (admin only)

## Tech Stack
- React + TypeScript + Vite
- Tailwind CSS
- Supabase (auth + database + realtime)
- Groq/OpenAI/Gemini (AI - configurable from admin)

## Admin Credentials
- Email: devrayog@gmail.com
- Password: 1234567890 (change after first login)
