#!/bin/bash
set -e

echo "Starting build process..."

# Navigate to backend directory
cd backend

# Restore NuGet packages
echo "Restoring packages..."
dotnet restore

# Build the application
echo "Building application..."
dotnet build -c Release

# Publish the application
echo "Publishing application..."
dotnet publish -c Release -o ./publish

echo "Build completed successfully!"