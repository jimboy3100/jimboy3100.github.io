#!/bin/bash

# Credits: Turbo - ターボ#2665 (https://github.com/TurboCheetah)

GREEN='\e[92m'
NC='\e[0m'

echo -e "${GREEN}[INFO] Updating apt packages${NC}"
sudo apt update

echo -e "${GREEN}[INFO] Opening port${NC}"
echo "y" | sudo ufw enable
sudo ufw allow OpenSSH
sudo ufw allow 8083

echo -e "${GREEN}[INFO] Installing Node.js${NC}"
curl -sL https://deb.nodesource.com/setup_11.x | sudo -E bash -
sudo apt install -y nodejs

echo -e "${GREEN}[INFO] Installing required NPM modules${NC}"
npm i

echo -e "${GREEN}[INFO] Installation complete!${NC}"