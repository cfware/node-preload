'use strict';

const singletonNodePreload = Symbol.for('node-preload');
const singleton = global[singletonNodePreload] || require('./node-preload-singleton.js');

module.exports = {
	...singleton,
	unload
};

const {unpatch} = module.exports;
delete module.exports.unpatch;

if (!global[singletonNodePreload]) {
	Object.defineProperty(global, singletonNodePreload, {
		value: module.exports,
		configurable: true
	});
}

function unload() {
	unpatch();

	delete global[singletonNodePreload];
	delete require.cache[__filename];
}
