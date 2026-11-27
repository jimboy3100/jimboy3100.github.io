/* Loads the real skin registry and resolver (ogario/skinregistry.js, ogario/skinresolver.js) into a
 * vm context whose window is the context itself, and returns the source of ogario.v4.js's
 * _lmSkinRes accessor, for tests that run engine functions which ask the resolver.
 *   const skinRes = require('./lib/skinres-env')(ctx, src);   // src: ogario.v4.js (LF)
 *   vm.runInContext(skinRes.accessor + ..., ctx);
 * Pass { resolver: false } to leave the resolver out (the engine's stand-in is used). */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..', '..', '..');
module.exports = function (ctx, src, opts) {
    opts = opts || {};
    if (opts.resolver !== false) {
        vm.runInContext(fs.readFileSync(path.join(ROOT, 'ogario', 'skinregistry.js'), 'utf8'), ctx);
        vm.runInContext(fs.readFileSync(path.join(ROOT, 'ogario', 'skinresolver.js'), 'utf8'), ctx);
    }
    let accessor = '';
    if (src) {
        const i = src.indexOf('\nfunction _lmSkinRes(');
        if (i >= 0) {
            let d = 0;
            for (let k = src.indexOf('{', i); k < src.length; k++) {
                if (src[k] === '{') d++;
                else if (src[k] === '}' && !--d) { accessor = 'var _lmSkinResStub = null;\n' + src.slice(i + 1, k + 1) + '\n'; break; }
            }
        }
    }
    return { accessor: accessor, resolver: ctx.LMSkinResolver };
};
