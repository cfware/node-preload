#!/usr/bin/env node
'use strict';

const assert = require('assert');
const cp = require('child_process');

const file1 = require.resolve('./file1.js');
const file2 = require.resolve('./file2.js');
const file3 = require.resolve('./file3.js');

const singletonNodePreload = Symbol.for('node-preload');
const singleton = global[singletonNodePreload];
const [node, bin, arg, arg2] = process.argv;

const [type, moreEnv] = arg2.split(':');

function spawn(bin, args, options) {
	if (type === 'spawnSync') {
		return Promise.resolve(cp.spawnSync(bin, args, {...options, encoding: 'utf8'}));
	}

	const proc = cp.spawn(bin, args, options);
	const stdout = [];
	const stderr = [];

	proc.stdout.on('data', data => stdout.push(data));
	proc.stderr.on('data', data => stderr.push(data));

	return new Promise(resolve => {
		proc.on('close', status => resolve({
			status,
			stdout: stdout.join(''),
			stderr: stderr.join('')
		}));
	});
}

async function main() {
	if (arg === '1') {
		assert.deepStrictEqual(singleton.preloadGetList(), [file1, file2]);
		assert.deepStrictEqual(
			global['node-preload-test'],
			[file1, file2].concat(moreEnv === 'file3' ? [file3] : [])
		);

		singleton.preloadRemove(file1);
		assert.strictEqual(process.env.TEST1, 'value1');
		assert.strictEqual(process.env.TEST2, 'value2');
		delete singleton.propagateEnv.TEST2;

		const {status, stdout, stderr} = await spawn(node, [bin, '2', type], {env: {a: 'a1', b: 'with "quoted".'}});
		assert.strictEqual(stderr, '');
		assert.strictEqual(stdout, 'process 2\n');
		assert.strictEqual(status, 0);

		process.stdout.write('Pass\n');

		return;
	}

	if (arg === '2') {
		assert.deepStrictEqual(singleton.preloadGetList(), [file2]);
		assert.deepStrictEqual(global['node-preload-test'], [file2]);

		assert.strictEqual(process.env.TEST1, 'value1');
		assert.ok(!('TEST2' in process.env));

		const nodePreload = require('../node-preload');
		nodePreload.unload();

		const {status, stdout, stderr} = await spawn(node, [bin, '3', type], {env: {}});
		assert.strictEqual(stderr, '');
		assert.strictEqual(stdout, 'process 3\n');
		assert.strictEqual(status, 0);

		process.stdout.write('process 2\n');
		return;
	}

	if (arg === '3') {
		assert.strictEqual(singleton, undefined);
		assert.strictEqual(global['node-preload-test'], undefined);
		assert.ok(!('TEST1' in process.env));
		assert.ok(!('TEST2' in process.env));

		process.stdout.write('process 3\n');
		return;
	}

	throw new Error('Unexpected call!');
}

main().catch(error => {
	console.error(error.message);
	process.exit(1);
});
