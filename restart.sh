#!/bin/bash
set -e
pm2 stop server
git pull origin main
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm use 20
cd ~/yamao-household-chem-site/household-chem-site/frontend
vite build
cd ~/yamao-household-chem-site/household-chem-site/backend
pm2 start server