'use strict';

const {spawnSync} = require('child_process');
const {test} = require('tape');

const preloadList = require('..');

function runSpawn(t, args, env) {
	const {status, stdout, stderr} = spawnSync(
		process.argv[0],
		args.concat(require.resolve('../fixtures/esm.js')),
		{cwd: __dirname, encoding: 'utf8', env}
	);
	t.equal(stderr, '');
	t.equal(status, 0);
	t.equal(stdout, '');
}

test('spawn', t => {
	// XXX troubleshoot why this fails on Windows under nyc 15.0.0
	if (process.platform !== 'win32') {
		const esm = require.resolve('esm');
		preloadList.push(esm);

		runSpawn(t, []);
		runSpawn(t, [], {});
	}

	t.end();
});
