'use strict';
if (!('node-preload-test' in global)) {
	global['node-preload-test'] = [];
}

global['node-preload-test'].push(__filename);
