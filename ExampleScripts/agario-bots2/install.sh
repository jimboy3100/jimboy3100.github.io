#!/bin/bash

# Credits: Turbo - ターボ#2665 (https://github.com/TurboCheetah)

NC='\e[0m'
GREEN='\e[92m'

echo -e "${GREEN}[INFO] Opening port 1337${NC}"
sudo ufw enable
sudo ufw allow OpenSSH
sudo ufw allow 1337

echo -e "${GREEN}[INFO] Updating apt repositories${NC}"
sudo apt update

echo -e "${GREEN}INFO] Installing required packages${NC}"
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt install nodejs npm git

echo -e "${GREEN}[INFO] Cloning git repository${NC}"
git clone https://github.com/nelthedev/free-agario-bots.git

cd free-agario-bots

echo -e "${GREEN}[INFO] Installing required packages for bots${NC}"
npm i

echo -e "${GREEN}Installation complete! Run [node server.js] to start the bots${NC}"
