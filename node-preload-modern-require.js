'use strict';

function generateRequire(filename) {
	return `--require "${filename.replace(/"/g, '\\"')}"`;
}

module.exports = {
	generateRequire,
	// The export explicitly exists but is undefined as it will never be called
	processNodePath: undefined,
	needsPathEnv: false
};
