'use strict';

/* This file must remain in the same directory as node-preload.js. */

/* This file commits the same evil as `spawn-wrap`.  The main
 * difference is this does not create separate scripts in to
 * be run in place of `node` or `npm`, so all potential issues
 * with shell escaping are eliminated. */

const path = require('path');
const {ChildProcess} = require('child_process');

/* istanbul ignore next: version specific branching */
const requireType = Number(process.versions.node.split('.')[0]) < 12 ? 'legacy' : 'modern';
const {generateRequire, processNodePath, needsPathEnv} = require(`./node-preload-${requireType}-require.js`);

function loadPropagated() {
	try {
		const envText = process.env.NODE_POLYFILL_PROPAGATE_ENV;
		delete process.env.NODE_POLYFILL_PROPAGATE_ENV;

		const envs = JSON.parse(envText);
		return envs.reduce((env, name) => {
			if (name in process.env) {
				env[name] = process.env[name];
			}

			return env;
		}, {});
	} catch (error) {
		return {};
	}
}

function loadPreloadList() {
	const env = process.env.NODE_POLYFILL_PRELOAD;
	delete process.env.NODE_POLYFILL_PRELOAD;
	if (!env) {
		return [];
	}

	return env.split(path.delimiter);
}

const nodeOptionRequireSelf = generateRequire(require.resolve('./node-preload.js'));
const preloadList = loadPreloadList();
const propagate = loadPropagated();

function processNodeOptions(value) {
	if (value.includes(nodeOptionRequireSelf)) {
		return value;
	}

	if (value !== '') {
		value = ' ' + value;
	}

	return `${nodeOptionRequireSelf}${value}`;
}

function processEnvPairs(options) {
	const {envPairs} = options;
	const env = {};

	envPairs.forEach(nvp => {
		const [name, ...value] = nvp.split('=');
		env[name] = value.join('=');
	});

	env.NODE_OPTIONS = processNodeOptions(env.NODE_OPTIONS || '');
	env.NODE_POLYFILL_PRELOAD = preloadList.join(path.delimiter);

	/* istanbul ignore next */
	if (needsPathEnv) {
		env.NODE_PATH = processNodePath(env.NODE_PATH || '');
	}

	env.NODE_POLYFILL_PROPAGATE_ENV = JSON.stringify(Object.keys(propagate));
	Object.entries(propagate).forEach(([name, value]) => {
		env[name] = value;
	});

	options.envPairs = Object.entries(env).map(nvp => nvp.join('='));
}

function preloadRemove(filename) {
	const prevIndex = preloadList.indexOf(filename);
	if (prevIndex !== -1) {
		preloadList.splice(prevIndex, 1);
	}
}

function preloadInsert(filename) {
	preloadRemove(filename);
	preloadList.unshift(filename);
}

function preloadAppend(filename) {
	preloadRemove(filename);
	preloadList.push(filename);
}

function preloadGetList() {
	return [...preloadList];
}

function wrappedSpawnFunction(fn) {
	return wrappedSpawn;

	function wrappedSpawn(options) {
		processEnvPairs(options);

		return fn.call(this, options);
	}
}

/* eslint-disable-next-line node/no-deprecated-api */
const spawnSyncBinding = process.binding('spawn_sync');
const originalSync = spawnSyncBinding.spawn;
const originalAsync = ChildProcess.prototype.spawn;

spawnSyncBinding.spawn = wrappedSpawnFunction(spawnSyncBinding.spawn);
ChildProcess.prototype.spawn = wrappedSpawnFunction(ChildProcess.prototype.spawn);

function executePreload() {
	preloadList.forEach(file => {
		require(file);
	});
}

function unpatch() {
	spawnSyncBinding.spawn = originalSync;
	ChildProcess.prototype.spawn = originalAsync;
	delete require.cache[__filename];
	if ((process.env.NODE_OPTIONS || '').includes(nodeOptionRequireSelf)) {
		process.env.NODE_OPTIONS = process.env.NODE_OPTIONS.replace(nodeOptionRequireSelf, '').trim();
		if (process.env.NODE_OPTIONS === '') {
			delete process.env.NODE_OPTIONS;
		}
	}
}

module.exports = {
	preloadRemove,
	preloadInsert,
	preloadAppend,
	preloadGetList,
	/* BUGBUG: process.env is writable but I'm not sure that wanted here */
	get propagateEnv() {
		return propagate;
	},
	unpatch,
	executePreload
};
