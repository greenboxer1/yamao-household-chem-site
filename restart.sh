#!/bin/bash
set -e
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm use 20

echo '------------------------Stop web server------------------------'
pm2 stop server

echo '------------------------Copy repo------------------------'
git pull origin main

echo '------------------------Build frontend------------------------'
cd ~/yamao-household-chem-site/household-chem-site/frontend
vite build

echo '------------------------Start web server------------------------'
cd ~/yamao-household-chem-site/household-chem-site/backend
pm2 start server