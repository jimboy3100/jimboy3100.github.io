const fs = require('fs');
const files = [
  'C:/Github_repos/jimboy3100.github.io/ogario/ogario.v4.js',
  'C:/Github_repos/jimboy3100.github.io/LMexpress/LMexpress.js',
  'C:/Github_repos/jimboy3100.github.io/LMexpress/lm_extended_ui.js',
  'C:/Github_repos/jimboy3100.github.io/LMexpress/skinsAndDeals.js',
  'C:/Github_repos/jimboy3100.github.io/LMexpress/LMexpress.user.js',
  'C:/Github_repos/jimboy3100.github.io/extras/legendhelper.js',
  'C:/Github_repos/jimboy3100.github.io/play.html'
];
let output = '';
for (const file of files) {
  if (fs.existsSync(file)) {
    output += '\n/* --- ' + file + ' --- */\n';
    output += fs.readFileSync(file, 'utf8');
  } else {
    console.log('File not found: ' + file);
  }
}

if (!fs.existsSync('C:/Github_repos/garbadge')) {
  fs.mkdirSync('C:/Github_repos/garbadge', { recursive: true });
}

fs.writeFileSync('C:/Github_repos/garbadge/AllFiles', output, 'utf8');
fs.writeFileSync('C:/Github_repos/garbadge/AllFiles.txt', output, 'utf8');
fs.writeFileSync('C:/Github_repos/garbadge/AllFilesNew.txt', output, 'utf8');
fs.writeFileSync('C:/Github_repos/garbadge/LegendMod.txt', output, 'utf8');
fs.writeFileSync('C:/Github_repos/garbadge/LegendModNew.txt', output, 'utf8');

console.log('Successfully generated all garbadge files: AllFiles, AllFiles.txt, AllFilesNew.txt, LegendMod.txt, LegendModNew.txt');
