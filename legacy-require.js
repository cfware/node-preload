'use strict';

/* This file must remain in the same directory as node-preload.js. */
const path = require('path');

function generateRequire(filename) {
	if (filename.includes(' ')) {
		return `--require ${path.basename(filename)}`;
	}

	return `--require ${filename}`;
}

function processNodePath(value) {
	const existing = value === '' ? [] : value.split(path.delimiter);
	if (existing.includes(__dirname)) {
		return value;
	}

	return existing.concat(__dirname).join(path.delimiter);
}

module.exports = {
	generateRequire,
	processNodePath
};
