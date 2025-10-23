#!/bin/bash

# CalSol Vercel Deployment Script

echo "🚀 Starting CalSol deployment to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Deploy Frontend
echo "📱 Deploying Frontend..."
cd calendefi-new
vercel --prod --yes
FRONTEND_URL=$(vercel ls | grep calendefi-new | head -1 | awk '{print $2}')
echo "✅ Frontend deployed at: $FRONTEND_URL"

# Deploy Backend
echo "🔧 Deploying Backend..."
cd ../backend
vercel --prod --yes
BACKEND_URL=$(vercel ls | grep backend | head -1 | awk '{print $2}')
echo "✅ Backend deployed at: $BACKEND_URL"

echo ""
echo "🎉 Deployment Complete!"
echo "Frontend: $FRONTEND_URL"
echo "Backend: $BACKEND_URL"
echo ""
echo "📝 Next Steps:"
echo "1. Update environment variables in Vercel dashboard"
echo "2. Add GOOGLE_SERVICE_ACCOUNT_KEY (base64 encoded)"
echo "3. Update VITE_API_BASE_URL to point to backend"
echo "4. Redeploy both apps"
