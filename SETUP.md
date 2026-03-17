# KidsTube – Setup Guide

## 1. Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and create a new project
2. Enable **Authentication** → Sign-in methods → **Google**
3. Create a **Firestore** database (start in production mode)
4. Apply the security rules from `firestore.rules`

### Get Firebase Client Config
In Firebase console → Project Settings → Your apps → Add Web App
Copy the config values into `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### Get Firebase Admin Credentials
In Firebase console → Project Settings → Service accounts → **Generate new private key**
Download the JSON and extract the fields:
```
FIREBASE_ADMIN_PROJECT_ID=   (project_id from JSON)
FIREBASE_ADMIN_CLIENT_EMAIL= (client_email from JSON)
FIREBASE_ADMIN_PRIVATE_KEY=  (private_key from JSON — include the full -----BEGIN... block)
```

## 2. YouTube Data API

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Select your Firebase project (same Google Cloud project)
3. APIs & Services → Enable **YouTube Data API v3**
4. APIs & Services → Credentials → Create **API Key**
5. Restrict the key to your domain (optional but recommended for production)

```
YOUTUBE_API_KEY=
```

## 3. Local Development

```bash
cp .env.local.example .env.local
# Fill in the values above
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 4. Deploy to Vercel

1. Push to GitHub
2. Import project at [vercel.com/new](https://vercel.com/new)
3. Add all `.env.local` values as Environment Variables in Vercel project settings
4. Deploy

## How It Works

- **Parent view** (`/parent`): Sign in with Google, add YouTube channels by URL or @handle, copy the watch link for your kid
- **Kid view** (`/watch?uid=YOUR_UID`): No login needed. Shows only videos from approved channels, sorted by newest first. Clicking opens a video player with no recommendations or links back to YouTube

## YouTube API Quota

The free tier gives 10,000 units/day. Video fetches cost 100 units per channel but are cached for 1 hour in Firestore. A family with 10 channels will use ~1,000 units on a cold start, well within the free tier.
