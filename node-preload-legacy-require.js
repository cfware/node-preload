'use strict';

/* This file must remain in the same directory as node-preload.js. */
const path = require('path');

function generateRequire(filename) {
	if (filename.includes(' ')) {
		return `--require ${path.basename(filename)}`;
	}

	return `--require ${filename}`;
}

function processNodePath(value, dir) {
	const existing = value === '' ? [] : value.split(path.delimiter);
	if (existing.includes(dir)) {
		return value;
	}

	return existing.concat(dir).join(path.delimiter);
}

module.exports = {
	generateRequire,
	processNodePath,
	needsPathEnv: dir => dir.includes(' ')
};
