git pull origin main
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm use 20
cd household-chem-site/backend
pm2 restart server.js