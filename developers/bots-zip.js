/* Builds ExampleScripts/agario-bots2/agario-bots.zip, the download of the Node.js bot server, from the
 * files of that folder as the repository holds them (no node_modules: install.bat installs them).
 * node developers/bots-zip.js */
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const { writeZip } = require('./extension-zip.js');
const root = path.join(__dirname, '..');
const botsRel = 'ExampleScripts/agario-bots2';
const botsDir = path.join(root, botsRel);

/* everything the server needs to run, plus its instructions and licence */
const FILES = ['botcore.js', 'server.js', 'server-fast.js', 'buffers.js', 'reader.js', 'writer.js', 'algorithm.js',
    'entity.js', 'logger.js', 'process.js', 'config.json', 'package.json', 'package-lock.json',
    'start.bat', 'install.bat', 'install.sh', 'README.md', 'LICENSE'];

const git = (args) => execFileSync('git', ['-C', root].concat(args), { maxBuffer: 64 * 1024 * 1024 });

/* line endings each file has in the repository (a Windows checkout turns LF files into CRLF) */
let eolCache = null;
function repoEol() {
    if (eolCache) return eolCache;
    eolCache = {};
    try {
        for (const line of git(['ls-files', '--eol', '--', botsRel]).toString().split('\n')) {
            const m = /^i\/(\S+)\s.*\t(.+)$/.exec(line);
            if (m) eolCache[m[2].slice(botsRel.length + 1)] = m[1];
        }
    } catch (e) { /* no git: the files are taken as they are */ }
    return eolCache;
}

/* a file's bytes as the repository holds them: the working file, with CRLF made LF again where git stores LF */
function fileBytes(name) {
    const data = fs.readFileSync(path.join(botsDir, name)), eol = repoEol()[name];
    if (eol === 'crlf' || eol === 'mixed' || eol === '-text' || (eol === undefined && !Object.keys(eolCache).length)) return data;
    return Buffer.from(data.toString('latin1').replace(/\r\n/g, '\n'), 'latin1');
}

function build() {
    let mtime = new Date();
    try {
        const t = +git(['log', '-1', '--format=%ct', '--'].concat(FILES.map((f) => botsRel + '/' + f))).toString().trim();
        if (t) mtime = new Date(t * 1000);
    } catch (e) { /* no git: now */ }
    const entries = FILES.map((name) => ({ name, data: fileBytes(name), mtime }));
    writeZip(path.join(botsDir, 'agario-bots.zip'), entries);
    console.log(entries.length + ' files -> ' + botsRel + '/agario-bots.zip');
}

module.exports = { FILES, fileBytes };
if (require.main === module) build();
