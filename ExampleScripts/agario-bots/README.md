# free-agario-bots
Free open source agar.io bots

[Join our Discord](https://discord.gg/SDMNEcJ)

## Usage
[Video tutorial for Windows](https://www.youtube.com/watch?v=TkihvNIpiTw)


Windows
-------
1. Install [Node.js](https://nodejs.org)
2. Install [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) extension on your browser
3. Download the bots files from this repository as a ZIP and extract them on a folder
4. Run `install.bat` and wait for it to close by itself
5. Run `server.bat` and leave it open
6. Copy and paste the contents of either [`free-agario-bots.vanilla.user.js`](https://github.com/xN3BULA/free-agario-bots/raw/master/free-agario-bots.vanilla.user.js) or [`free-agario-bots.ogario.user.js`](https://github.com/xN3BULA/free-agario-bots/raw/master/free-agario-bots.ogario.user.js) into a new Tampermonkey userscript and save it
7. Go to [agar.io](https://agar.io) with 1 of the 2 userscripts enabled and click "Connect" button, the status should say "Connected" in green
8. Create party and make sure that you are logged in on your agar.io account then click "Start Bots" button, if your IP doesn't has captcha the button should turn red and say "Stop Bots" if you get an alert saying your IP has captcha scroll down to the part where i explain different ways to fix that
9. To stop bots click the "Stop Bots" button and wait 30 seconds for the process to close you will see a countdown there
10. To run the bots again just run `start.bat`, click "Connect" button and then click "Start Bots" button if you did everything right bots should start again
11. Always make sure you wait the 30 seconds for process to close or you are gonna get captcha on your ip

VPS
-------
1. I recommend using a Ubuntu 18.04 LTS from DigitalOcean. You can get one for $5/month and you can use this [link](https://m.do.co/c/fa7a805f6e60) to get $50 on the platform
2. Run `sudo apt install git` command
3. Run `git clone https://github.com/xN3BULA/free-agario-bots.git` command
4. Run `cd free-agario-bots` command
5. Run `sudo chmod +x install.sh` command
6. Run `sudo ./install.sh` command
7. Run `node server` command and leave the process running
8. Follow the same steps explained on `Windows` section for installing userscript in Tampermonkey and put your VPS IP on SERVER HOST input in the OPTIONS panel
9. Go to [agar.io](https://agar.io) and click "Connect" button
10. On top right of your browser you will see a shield with a red mark, click there and then click "Load unsafe scripts"
11. After agar.io loads click "Connect" button again, the status should say "Connected" in green
12. Create party and make sure that you are logged in on your account agar.io account then click "Start Bots" button, if the VPS IP doesn't has captcha the button should turn red and say "Stop Bots" if you get an alert saying the IP has captcha you will need to change the VPS IP somehow to one without captcha
13. To stop bots click the "Stop Bots" button and wait 30 seconds for process to close you will see a countdown there
14. To run the bots again just run `node server`, make sure you "Load unsafe scripts", click "Connect" button and then click "Start Bots" button if you did everything right bots should start again
15. Always make sure you wait the 30 seconds for process to close or you are gonna get captcha on the VPS ip
16. If you wanna run it 24/7 on the VPS run `sudo npm i -g pm2` command and then run `sudo pm2 start process.js` command


## Captcha (only for Windows)
If you get captcha alert you need to change your IP or get rid of captcha by playing with your IP. You can do so by:
- Restarting your router (only if you have a dynamic IP)
- Connecting to a VPN server like one from [ProtonVPN](https://protonvpn.com) which you make sure that doesn't has captcha
- Playing logged out of your agar.io account until captcha goes away

## Donate
PayPal: nelthedeveloper@gmail.com (original creator) 

PayPal: sonnybuchan12@gmail.com
