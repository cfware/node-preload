'use strict';

const singletonNodePreload = Symbol.for('node-preload');
const singleton = global[singletonNodePreload] || require('./node-preload-singleton.js');

function clone(obj) {
	const copy = Object.create(Object.getPrototypeOf(obj));

	for (const key of Object.getOwnPropertyNames(obj)) {
		Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj, key));
	}

	return copy;
}

module.exports = clone(singleton);
module.exports.unload = unload;

const {unpatch, executePreload} = module.exports;
delete module.exports.unpatch;
delete module.exports.executePreload;

if (!global[singletonNodePreload]) {
	Object.defineProperty(global, singletonNodePreload, {
		value: module.exports,
		configurable: true
	});

	/* This is executed after setting the global singleton to deal with
	 * situations where a preloaded module needs to `require('node-preload')` */
	executePreload();
}

function unload() {
	unpatch();

	delete global[singletonNodePreload];
	delete require.cache[__filename];
}
