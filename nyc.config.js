'use strict';

module.exports = {
	all: true,
	checkCoverage: process.platform !== 'win32',
	functions: 100,
	lines: 100,
	statements: 100,
	branches: 100,
	include: ['*.js', 'preload-path/*.js']
};
