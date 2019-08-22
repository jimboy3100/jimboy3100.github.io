# free-agario-bots
Free open source agar.io bots



## Usage
[Video tutorial for Windows](https://www.youtube.com/watch?v=CROvbjyLmS0&feature=youtu.be)

Windows
-------
1. Install [Node.js](https://nodejs.org)
2. Install [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) extension on your browser
3. Download the bots files from this repository in a ZIP and extract it on a folder (click [here](http://jimboy3100.github.io/ExampleScripts/agario-bots2/agario-bots.zip))
4. Run `install.bat` and wait for it to close
5. Run `start.bat` and leave it open. Otherwise open Node.js command prompt, use DOS commands:
- (For e.g Hard disk X:) `X:` 
- (For folder agario-bots2) `cd agario-bots2`
- `install.bat`
- `start.bat`
6. (For agario vanilla): Copy and paste the contents of either [`free-agario-bots.vanilla.user.js`](http://jimboy3100.github.io/ExampleScripts/agario-bots2/free-agario-bots.vanilla.user.js) into a new Tampermonkey userscript and save it
7. Go to [agar.io](https://agar.io) and click "Connect" button, the status should say "Connected"
8. Create party and make sure that you are logged in on your account agar.io account then click "Start Bots" button, if your IP doesn't has captcha the button should turn red and say "Stop Bots" if you get an alert saying your IP has captcha down below i explain different ways to fix that
9. To stop bots click the "Stop Bots" button and wait 30 seconds for the CMD to close you will see a countdown there
10. To run the bots again just run `start.bat`, click "Connect" button and then click "Start Bots" button
11. On Vanilla userscript you can modify keys/settings at the start of [it](http://jimboy3100.github.io/ExampleScripts/agario-bots2/free-agario-bots.vanilla.user.js#L11) you will have to refresh to save them
12. On Legend mod userscript you can modify keys when you are in agar.io on the top of the hotkeys TAB

VPS
-------
1. I recommend using a Ubuntu 18.04 LTS from DigitalOcean. You can get one for $5/month and you can use this [link](https://m.do.co/c/fa7a805f6e60) to get $50 on the platform
2. Run `sudo apt install git` command
3. Run `git clone https://github.com/nelthedev/free-agario-bots.git` command
4. Run `cd free-agario-bots` command
5. Run `sudo chmod +x install.sh` command
6. Run `sudo ./install.sh` command
7. Run `node start` command and leave the process running
8. Follow the same steps explained on `Windows` section for installing userscript and put your VPS IP on `window.SERVER_HOST` at the start of userscript settings
9. Go to [agar.io](https://agar.io) and click "Connect" button
10. On top right of your browser you will see a shield with a red mark, click there and then click "Allow unsafe scripts"
11. After agar.io loads click "Connect" button again, the status should say "Connected"
12. Create party and make sure that you are logged in on your account agar.io account then click "Start Bots" button
13. To stop bots click the "Stop Bots" button and wait 30 seconds for CMD to close you will see a countdown there
14. To run the bots again just run `node start`, make sure you "Allowed unsafe scripts", click "Connect" button and then click "Start Bots" button
15. On Vanilla userscript you can modify keys/settings at the start of [it](http://jimboy3100.github.io/ExampleScripts/agario-bots2/free-agario-bots.vanilla.user.js#L11) you will have to refresh to save them
16. On Legend mod userscript you can modify keys when you are in agar.io on the top of the hotkeys TAB
17. Always make sure you wait the 30 seconds for process to close or you are gonna get captcha on the VPS ip
18. If you wanna run it 24/7 on the VPS run `sudo npm i -g pm2` command and then run `sudo pm2 start process.js` command

## Captcha (only for Windows)
If you get captcha alert you need to change your IP or get rid of captcha by playing with your IP. You can do so by:
- Restarting your router (only if you have a dynamic IP)
- Connecting to a VPN server like one from [UrbanVPN](https://www.urban-vpn.com/) which you make sure that doesn't has captcha
- Playing logged out of your agar.io account until captcha goes away

## Author
[Nel](https://github.com/nelthedev/free-agario-bots)

## Donate
PayPal: nelthedeveloper@gmail.com
