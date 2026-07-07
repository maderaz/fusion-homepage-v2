#!/usr/bin/env bash
set -euo pipefail

NODE_VERSION="22.14.0"

# Load nvm
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
else
  echo "Error: nvm not found. Install it from https://github.com/nvm-sh/nvm"
  exit 1
fi

# Install and use required Node version
nvm install "$NODE_VERSION"
nvm use "$NODE_VERSION"

# Install dependencies
npm run setup

# Lint
npm run lint

# Test
npm test

# Build
npm run build

# Start preview server
npm run preview
