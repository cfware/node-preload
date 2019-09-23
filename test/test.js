'use strict';

const {test} = require('tap');

const nodePreload = require('../node-preload');

const singletonNodePreload = Symbol.for('node-preload');

test('exports', async t => {
	t.is(typeof nodePreload, 'object');
	t.deepEqual(Object.keys(nodePreload).sort(), [
		'preloadAppend',
		'preloadGetList',
		'preloadInsert',
		'preloadRemove',
		'propagateEnv',
		'unload'
	]);
});

test('unload and load', async t => {
	let currentSingleton = global[singletonNodePreload];
	t.ok(currentSingleton);

	nodePreload.preloadAppend(__filename);
	t.ok(nodePreload.preloadGetList().includes(__filename));

	nodePreload.unload();
	const newModule = require('../node-preload');
	/* The reload contains the same methods but in a separate object. */
	t.deepEqual(nodePreload, newModule);
	t.notEqual(nodePreload, newModule);
	t.notEqual(currentSingleton, global[singletonNodePreload]);
	currentSingleton = global[singletonNodePreload];

	/* These are blank by default.  This can't be checked before unload as tap
	 * may decide to have nyc avoid `spawn-wrap` in the future. */
	t.deepEqual(newModule.preloadGetList(), []);
	t.deepEqual(newModule.propagateEnv, {});

	const paths = {
		preload: require.resolve('../node-preload.js'),
		singleton: require.resolve('../node-preload-singleton.js')
	};
	delete require.cache[paths.preload];
	delete require.cache[paths.singleton];

	const noSingleton = require('../node-preload');
	t.notEqual(noSingleton, newModule);
	t.equal(global[singletonNodePreload], currentSingleton);

	t.ok(paths.preload in require.cache);
	t.notOk(paths.singleton in require.cache);
});
