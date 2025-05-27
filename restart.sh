git pull origin main

export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

nvm use 20

echo "Using Node: $(which node)"
echo "Node version: $(node -v)"
echo "Using PM2: $(which pm2)"

cd household-chem-site/backend
pm2 restart server.js