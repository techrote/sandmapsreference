'use strict';
// Lane-local stage finalizer: assemble this map's own deterministic builder.
// This file is only a transport convenience; the resulting build.cjs is source.
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const crypto = require('node:crypto');
const dir = __dirname;
const parts = [1, 2, 3].map(i => fs.readFileSync(path.join(dir, '.builder-part-' + i + '.b64'), 'utf8').trim());
const zipped = Buffer.from(parts.join(''), 'base64');
const source = zlib.gunzipSync(zipped).toString('utf8');
if (source.length < 5000 || !source.includes('2048') || !source.includes('1024')) throw new Error('Unexpected builder content');
const dst = path.join(dir, 'build.cjs');
fs.writeFileSync(dst, source);
console.log(JSON.stringify({builder: dst, bytes: Buffer.byteLength(source), sha256: crypto.createHash('sha256').update(source).digest('hex')}));
