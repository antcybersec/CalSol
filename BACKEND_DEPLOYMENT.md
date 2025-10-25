# Backend Deployment Guide

## Deploy Backend to Vercel

### Step 1: Prepare Environment Variables

You need to set these environment variables in Vercel:

1. **GOOGLE_SERVICE_ACCOUNT_KEY**: Your service account key as base64 encoded string
2. **SOLANA_RPC_URL**: `https://api.devnet.solana.com` (optional)
3. **PORT**: `3001` (optional)

### Step 2: Convert Service Account Key to Base64

Run this command to get your base64 encoded key:
```bash
cd backend
base64 -i service-account-key.json
```

### Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Create a new project
3. Connect your GitHub repository
4. Set the **Root Directory** to `backend`
5. Add environment variables:
   - `GOOGLE_SERVICE_ACCOUNT_KEY`: (paste the base64 string from step 2)
   - `SOLANA_RPC_URL`: `https://api.devnet.solana.com`
6. Deploy!

### Step 4: Update Frontend API URL

Once deployed, update your frontend to use the new backend URL.

## Alternative: Deploy to Render

1. Go to [render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables
6. Deploy!

## Smart Contract Deployment

Your Solana programs are in the `programs/` folder. To deploy them:

1. Install Anchor CLI: `npm install -g @coral-xyz/anchor-cli`
2. Build: `anchor build`
3. Deploy: `anchor deploy --provider.cluster devnet`


