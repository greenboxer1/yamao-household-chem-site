#!/bin/bash
set -e
git pull origin main
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm use 20
cd ~/yamao-household-chem-site/household-chem-site/frontend
npm run build
cd household-chem-site/backend
pm2 restart server.js