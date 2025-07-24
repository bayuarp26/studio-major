#!/bin/bash

# Clean up unused files
echo "Cleaning up unused files..."

# Remove unused components
rm -f "src/components/Header-old.tsx" 2>/dev/null
rm -f "src/components/LinkedInEmbed.tsx" 2>/dev/null  
rm -f "src/components/ProjectList.tsx" 2>/dev/null

# Remove unused lib files
rm -f "src/lib/simple-posts.ts" 2>/dev/null

# Remove temporary scripts
rm -f "test-email.js" 2>/dev/null
rm -f "generate-secret.js" 2>/dev/null

echo "Cleanup completed!"

# Check for TypeScript errors
echo "Checking for TypeScript errors..."
npx tsc --noEmit

echo "Done!"
