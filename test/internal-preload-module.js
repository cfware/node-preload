'use strict';

const {test} = require('tape');

// Test the branch when `internal-preload-module` is not loaded through `--require`
const internalPreloadModule = require('../internal-preload-module.js');

test('when not loaded via `--require`', t => {
	t.equal(internalPreloadModule.id, require.resolve('../internal-preload-module.js'));
	t.end();
});
