'use strict';

const {spawnSync} = require('child_process');
const {test} = require('tap');

const nodeMajor = Number(process.versions.node.split('.')[0]);
const {generateRequire} = nodeMajor < 12 ? require('../legacy-require.js') : require('../modern-require.js');

require('../node-preload').unload();
const nodePreload = require('../node-preload');

function runSpawn(t, type, env) {
	const {status, stdout, stderr} = spawnSync(
		process.argv[0],
		[require.resolve('../fixtures/spawn.js'), '1', type],
		{cwd: __dirname, encoding: 'utf8', env}
	);
	t.is(stderr, '');
	t.is(status, 0);
	t.is(stdout, 'Pass\n');
}

test('spawn', async t => {
	const nodeOptionRequireSelf = generateRequire(require.resolve('../node-preload.js'));
	nodePreload.preloadAppend(require.resolve('../fixtures/file1.js'));
	nodePreload.preloadAppend(require.resolve('../fixtures/file2.js'));
	nodePreload.propagateEnv.TEST1 = 'value1';
	nodePreload.propagateEnv.TEST2 = 'value2';

	runSpawn(t, 'spawn:');
	runSpawn(t, 'spawn:', {NODE_OPTIONS: nodeOptionRequireSelf});
	runSpawn(t, 'spawn:file3', {NODE_OPTIONS: '--require ../fixtures/file3.js'});
	runSpawn(t, 'spawnSync:');
	runSpawn(t, 'spawnSync:', {NODE_OPTIONS: nodeOptionRequireSelf});
	runSpawn(t, 'spawnSync:file3', {NODE_OPTIONS: '--require ../fixtures/file3.js'});
});
