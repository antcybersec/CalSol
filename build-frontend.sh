#!/bin/bash
set -e

echo "Building CalSol frontend..."

# Navigate to frontend directory
cd frontend

# Clean install to avoid native binding issues
echo "Cleaning node_modules and package-lock.json..."
rm -rf node_modules package-lock.json

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the project
echo "Building project..."
npm run build

echo "Build completed successfully!"

