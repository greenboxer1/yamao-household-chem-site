#!/bin/bash
cd household-chem-site/frontend
npm i
npm run build
cd ../backend
npm i
pm2 start server.js