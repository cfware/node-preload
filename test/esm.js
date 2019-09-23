'use strict';

const {spawnSync} = require('child_process');
const {test} = require('tap');

require('../node-preload').unload();
const nodePreload = require('../node-preload');

function runSpawn(t, args, env) {
	const {status, stdout, stderr} = spawnSync(
		process.argv[0],
		args.concat(require.resolve('../fixtures/esm.mjs')),
		{cwd: __dirname, encoding: 'utf8', env}
	);
	t.is(stderr, '');
	t.is(status, 0);
	t.is(stdout, '');
}

test('spawn', async t => {
	const esm = require.resolve('esm');
	nodePreload.preloadAppend(esm);

	runSpawn(t, []);
	runSpawn(t, [], {});

	/* Preload something other than esm then use `-r esm` on the command-line. */
	nodePreload.preloadRemove(esm);
	nodePreload.preloadAppend(require.resolve('../fixtures/file1.js'));

	runSpawn(t, ['-r', 'esm']);
	runSpawn(t, ['-r', 'esm'], {});
});
