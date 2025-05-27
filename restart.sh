git pull origin main

export NVM_DIR="$HOME/.nvm"
export NODE_VERSION="v20.18.0"
export PATH="$NVM_DIR/versions/node/$NODE_VERSION/bin:$PATH"
echo "Using Node: $(which node)"
echo "Node version: $(node -v)"
echo "Using PM2: $(which pm2)"

cd household-chem-site/backend

pm2 restart server.js
