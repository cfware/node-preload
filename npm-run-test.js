#!/usr/bin/env node
'use strict';

const os = require('os');
const t = require('libtap');
const glob = require('glob');

t.jobs = os.cpus().length;

for (const file of glob.sync('test/**/*.js')) {
	t.spawn(process.execPath, [file], file);
}
