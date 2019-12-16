# free-agario-bots
Free open source agar.io bots for Legend mod Express

## About
℄🔥𝙻𝚎𝚐𝚎𝚗𝚍 𝙲𝚕𝚊𝚗 Discord Community for questions about bots: https://discord.gg/vqy6b5U

Legend mod: https://legendmod.ml/

Repl.it repository: https://repl.it/@legendmod/party-bots

Node.js library: https://github.com/jimboy3100/jimboy3100.github.io/tree/master/ExampleScripts/agario-bots2

## Usage
[Video tutorial for Windows](https://www.youtube.com/watch?v=xIupgFR7ZTY)

Node.js run server from PC
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
6. Install and use Legend mod Express https://legendmod.ml , visit agar.io and enable party bots on settings->helpers->party bots and click the "triumph" of main HUD area.
7. CLick "Connect" button, the status should say "Connected"
8. To stop bots click the "Stop Bots" button and wait 30 seconds for the CMD to close you will see a countdown there
9. To run the bots again just run `start.bat`, click "Connect" button and then click "Start Bots" button

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

## Author
[Nel](https://github.com/nelthedev/free-agario-bots)
[Jimboy3100](https://legendmod.ml)

## Repl.it VPS FAQ
https://repl.it/@legendmod/party-bots (watch video tutorial from above)

#### My repl.it seems loading for long time after I clicked INSTALL or after I START, what should i do?

Wait for 5-10 minutes, if nothing happens refresh your repo repl.it webpage. Do the same process until (3-4 if needed), it is installed and until you are able to start the websocket.
If issue remains, fork another repository and do the same. YOU WILL FINALLY NOTICE THAT IT WORKS.

#### I did everything correct but Legend mod notifies me that I have captcha, when I start the bots, what should I do?

Disable ad-blockers, antiviruses, firewalls. There was one (rare) case refered that captcha blocked bots, maybe rebooting router to change ip, or using a VPN could solve the issue, but I am not sure.

#### Are these bots working?

These bots are considered fully working, free, legit and finished project. They work only by using Legend mod for agar.io

#### Do you use proxies, facebook tokens for bots?

These bots don't need proxies, they use the captcha solver that Legend mod provides. Furthermore, bots do NOT use any facebook UID that could result on real player disconnection or facebook / google tokens, at all.

#### My websocket is not correct. What is the correct?

If your repo url is e.g: https://repl.it/@testeruser/bottester , then the websocket should be wss://bottester--testeruser.repl.co

#### How can I ask for extra help?

Enter https://discord.gg/vqy6b5U , share your issues with others users. Please do not directly PM me, although I will be glad to help on an unsolved issue on room "Chat". 

#### How can I donate?

Please visit https://www.paypal.com/donate/?token=cV-ycVkH9p76i7ZE7SeznzU4Am16MmP7tVpn_oBc5260qPUxEGAMGFoxaNqmZ3UTh_4Vy0 , donations for Legend mod are been used to support the servers fees, services, and my beers with my friends.

Thank you for supporting the Legend mod project.

## Donate
PayPal: [click here](https://www.paypal.com/donate/?token=cV-ycVkH9p76i7ZE7SeznzU4Am16MmP7tVpn_oBc5260qPUxEGAMGFoxaNqmZ3UTh_4Vy0)
