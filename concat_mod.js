const fs = require('fs');
const path = require('path');

const garbadgeDir = 'C:/Github_repos/garbadge';
if (!fs.existsSync(garbadgeDir)) {
  fs.mkdirSync(garbadgeDir, { recursive: true });
}

// --- 1. Client Code ---
const clientFiles = [
  'C:/Github_repos/jimboy3100.github.io/ogario/ogario.v4.js',
  'C:/Github_repos/jimboy3100.github.io/LMexpress/LMexpress.js',
  'C:/Github_repos/jimboy3100.github.io/LMexpress/lm_extended_ui.js',
  'C:/Github_repos/jimboy3100.github.io/LMexpress/skinsAndDeals.js',
  'C:/Github_repos/jimboy3100.github.io/LMexpress/LMexpress.user.js',
  'C:/Github_repos/jimboy3100.github.io/extras/legendhelper.js',
  'C:/Github_repos/jimboy3100.github.io/play.html'
];

let clientOutput = '';
for (const file of clientFiles) {
  if (fs.existsSync(file)) {
    clientOutput += '\n/* --- ' + file + ' --- */\n';
    clientOutput += fs.readFileSync(file, 'utf8');
  } else {
    console.log('File not found: ' + file);
  }
}

fs.writeFileSync(path.join(garbadgeDir, 'AllFiles'), clientOutput, 'utf8');
fs.writeFileSync(path.join(garbadgeDir, 'AllFiles.txt'), clientOutput, 'utf8');
fs.writeFileSync(path.join(garbadgeDir, 'LegendMod.txt'), clientOutput, 'utf8');
fs.writeFileSync(path.join(garbadgeDir, 'LegendModNew.txt'), clientOutput, 'utf8');
console.log('Generated Client Code bundles (AllFiles, LegendMod.txt, etc.)');

// --- 1b. UserScript Client Bundle (client.js, c.txt) ---
const userScriptPath = 'C:/Github_repos/jimboy3100.github.io/LMexpress/LMexpress.user.js';
if (fs.existsSync(userScriptPath)) {
  const userScriptOutput = fs.readFileSync(userScriptPath, 'utf8');
  fs.writeFileSync(path.join(garbadgeDir, 'client.js'), userScriptOutput, 'utf8');
  fs.writeFileSync(path.join(garbadgeDir, 'c.txt'), userScriptOutput, 'utf8');
  console.log('Generated UserScript Client bundles (client.js, c.txt)');
}

// --- 2. C Server Code (LegendWorld) ---
const serverSrcDir = 'C:/Github_repos/LegendWorld/src';
let serverOutput = '';
if (fs.existsSync(serverSrcDir)) {
  const serverFiles = fs.readdirSync(serverSrcDir)
    .filter(file => file.endsWith('.c') || file.endsWith('.h'))
    .sort();

  for (const file of serverFiles) {
    const fullPath = path.join(serverSrcDir, file);
    serverOutput += '\n/* --- ' + fullPath + ' --- */\n';
    serverOutput += fs.readFileSync(fullPath, 'utf8');
  }
}

fs.writeFileSync(path.join(garbadgeDir, 'cServer.txt'), serverOutput, 'utf8');
fs.writeFileSync(path.join(garbadgeDir, 'cServerNew.txt'), serverOutput, 'utf8');
fs.writeFileSync(path.join(garbadgeDir, 'LegendWorld.txt'), serverOutput, 'utf8');
fs.writeFileSync(path.join(garbadgeDir, 'LegendWorldNew.txt'), serverOutput, 'utf8');
fs.writeFileSync(path.join(garbadgeDir, 'ServerCode.txt'), serverOutput, 'utf8');
fs.writeFileSync(path.join(garbadgeDir, 'ServerCodeNew.txt'), serverOutput, 'utf8');
console.log('Generated C Server Code bundles (ServerCode.txt, cServer.txt, LegendWorld.txt, etc.)');

// --- 3. Render Code (ogario.v4.js -> render.js, rend.txt, rendering.txt) ---
const ogarioPath = 'C:/Github_repos/jimboy3100.github.io/ogario/ogario.v4.js';
if (fs.existsSync(ogarioPath)) {
  const renderOutput = fs.readFileSync(ogarioPath, 'utf8');
  fs.writeFileSync(path.join(garbadgeDir, 'render.js'), renderOutput, 'utf8');
  fs.writeFileSync(path.join(garbadgeDir, 'rend.txt'), renderOutput, 'utf8');
  fs.writeFileSync(path.join(garbadgeDir, 'rendering.txt'), renderOutput, 'utf8');
  console.log('Generated Render Code bundles (render.js, rend.txt, rendering.txt)');
}

// --- 4. Discord Bot Code ---
const botSrcDir = 'C:/Github_repos/discord-bot-server/src';
let botOutput = '';
if (fs.existsSync(botSrcDir)) {
  const readmePath = 'C:/Github_repos/discord-bot-server/README.md';
  if (fs.existsSync(readmePath)) {
    botOutput += '\n/* --- ' + readmePath + ' --- */\n';
    botOutput += fs.readFileSync(readmePath, 'utf8');
  }

  const botFiles = fs.readdirSync(botSrcDir)
    .filter(file => file.endsWith('.js'))
    .sort();

  for (const file of botFiles) {
    const fullPath = path.join(botSrcDir, file);
    botOutput += '\n/* --- ' + fullPath + ' --- */\n';
    botOutput += fs.readFileSync(fullPath, 'utf8');
  }
}

fs.writeFileSync(path.join(garbadgeDir, 'DiscordBot.txt'), botOutput, 'utf8');
fs.writeFileSync(path.join(garbadgeDir, 'DiscordBotNew.txt'), botOutput, 'utf8');
fs.writeFileSync(path.join(garbadgeDir, 'DiscordBotServer.txt'), botOutput, 'utf8');
fs.writeFileSync(path.join(garbadgeDir, 'DiscordBotServerNew.txt'), botOutput, 'utf8');
console.log('Generated Discord Bot Code bundles (DiscordBot.txt, DiscordBotServer.txt, etc.)');
