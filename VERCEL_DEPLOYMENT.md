# CalSol Vercel Deployment Guide

## Environment Variables Setup

### Frontend Environment Variables (.env.local)

Create a `.env.local` file in your `calendefi-new` directory:

```bash
# Solana Configuration
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
VITE_SOLANA_NETWORK=devnet

# Backend API URL (update this to your Vercel backend URL)
VITE_API_BASE_URL=https://your-backend-app.vercel.app

# Google OAuth (if using Google Sign-in)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### Backend Environment Variables (.env)

Create a `.env` file in your `backend` directory:

```bash
# Server Configuration
PORT=3001
NODE_ENV=production

# Google Calendar API
GOOGLE_CALENDAR_CREDENTIALS_PATH=./service-account-key.json
GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL=calendefi-agent@coders-connect-450316.iam.gserviceaccount.com

# Solana Configuration
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_NETWORK=devnet

# CORS Configuration
FRONTEND_URL=https://your-frontend-app.vercel.app
```

## Vercel Deployment Steps

### 1. Frontend Deployment (calendefi-new)

1. **Connect to Vercel:**
   ```bash
   cd calendefi-new
   npx vercel
   ```

2. **Set Environment Variables in Vercel Dashboard:**
   - Go to your project settings
   - Add these environment variables:
     - `VITE_SOLANA_RPC_URL` = `https://api.devnet.solana.com`
     - `VITE_SOLANA_NETWORK` = `devnet`
     - `VITE_API_BASE_URL` = `https://your-backend-app.vercel.app`

### 2. Backend Deployment (backend)

1. **Create vercel.json in backend directory:**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/server.js"
       }
     ],
     "env": {
       "NODE_ENV": "production"
     }
   }
   ```

2. **Deploy backend:**
   ```bash
   cd backend
   npx vercel
   ```

3. **Set Environment Variables in Vercel Dashboard:**
   - `PORT` = `3001`
   - `NODE_ENV` = `production`
   - `SOLANA_RPC_URL` = `https://api.devnet.solana.com`
   - `SOLANA_NETWORK` = `devnet`
   - `FRONTEND_URL` = `https://your-frontend-app.vercel.app`

### 3. Service Account Key Setup

**IMPORTANT:** You need to add your Google Service Account key to Vercel:

1. **Convert your service-account-key.json to base64:**
   ```bash
   base64 -i backend/service-account-key.json
   ```

2. **Add as Environment Variable in Vercel:**
   - Variable name: `GOOGLE_SERVICE_ACCOUNT_KEY`
   - Value: The base64 encoded string from step 1

3. **Update backend/server.js to use the environment variable:**
   ```javascript
   // Add this at the top of server.js
   const fs = require('fs');
   const path = require('path');

   // Create service account key from environment variable
   if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
     const serviceAccountKey = Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_KEY, 'base64').toString('utf-8');
     fs.writeFileSync(path.join(__dirname, 'service-account-key.json'), serviceAccountKey);
   }
   ```

## Complete Environment Variables List

### Frontend (Vercel Dashboard)
```
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
VITE_SOLANA_NETWORK=devnet
VITE_API_BASE_URL=https://your-backend-app.vercel.app
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### Backend (Vercel Dashboard)
```
PORT=3001
NODE_ENV=production
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_NETWORK=devnet
FRONTEND_URL=https://your-frontend-app.vercel.app
GOOGLE_SERVICE_ACCOUNT_KEY=base64_encoded_service_account_key
GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL=calendefi-agent@coders-connect-450316.iam.gserviceaccount.com
```

## Quick Setup Commands

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy Frontend
cd calendefi-new
vercel --prod

# 3. Deploy Backend
cd ../backend
vercel --prod

# 4. Update environment variables in Vercel dashboard
# 5. Redeploy both apps
```

## Testing Deployment

1. **Check Frontend:** Visit your frontend Vercel URL
2. **Check Backend:** Visit `https://your-backend-app.vercel.app/api/health`
3. **Test Calendar Integration:** Try onboarding a calendar
4. **Test Transactions:** Create a test SOL transaction

## Troubleshooting

- **CORS Issues:** Make sure `FRONTEND_URL` matches your actual frontend URL
- **Service Account Issues:** Verify the base64 encoding is correct
- **API Connection:** Check that `VITE_API_BASE_URL` points to your backend
- **Build Errors:** Check Vercel build logs for missing dependencies
