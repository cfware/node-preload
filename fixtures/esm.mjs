import path from 'path';

process.exit(path.basename(import.meta.url) === 'esm.mjs' ? 0 : 1);
