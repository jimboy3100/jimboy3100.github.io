const fs = require('fs');
const files = [
  'C:/Github_repos/jimboy3100.github.io/ogario/ogario.v4.js',
  'C:/Github_repos/jimboy3100.github.io/LMexpress/LMexpress.js',
  'C:/Github_repos/jimboy3100.github.io/LMexpress/lm_extended_ui.js',
  'C:/Github_repos/jimboy3100.github.io/LMexpress/skinsAndDeals.js',
  'C:/Github_repos/jimboy3100.github.io/LMexpress/LMexpress.user.js',
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
fs.writeFileSync('C:/Github_repos/garbadge/AllFiles', output, 'utf8');
console.log('Concatenated files to AllFiles');
