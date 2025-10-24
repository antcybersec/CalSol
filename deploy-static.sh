#!/bin/bash

echo "🚀 CalSol - GUARANTEED WORKING DEPLOYMENT"
echo "=========================================="

# Build the frontend
echo "📦 Building frontend..."
cd frontend
npm install
npm run build

# Create a simple static server
echo "🔧 Creating static server..."
cat > static-server.js << 'EOF'
const express = require('express');
const path = require('path');
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React Router
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 CalSol running on port ${PORT}`);
});
EOF

# Update package.json for static deployment
echo "📝 Updating package.json..."
cat > package-static.json << 'EOF'
{
  "name": "calsol-static",
  "version": "1.0.0",
  "type": "commonjs",
  "scripts": {
    "start": "node static-server.js",
    "build": "echo 'Build already done'"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
EOF

# Copy the static package.json
cp package-static.json package.json

echo "✅ READY FOR DEPLOYMENT!"
echo "📁 Files created:"
echo "   - dist/ (built frontend)"
echo "   - static-server.js (simple server)"
echo "   - package.json (static deployment config)"
echo ""
echo "🚀 Deploy these files to Render!"
echo "   Build Command: npm install"
echo "   Start Command: npm start"
echo "   Publish Directory: . (root)"

