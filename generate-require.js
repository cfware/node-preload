'use strict';

/* istanbul ignore next: version specific branching */
const requireType = Number(process.versions.node.split('.')[0]) < 12 ? 'legacy' : 'modern';

module.exports = require(`./generate-require-${requireType}.js`);
