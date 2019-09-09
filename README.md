# node-preload

[![Travis CI][travis-image]][travis-url]
[![Greenkeeper badge][gk-image]](https://greenkeeper.io/)
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![MIT][license-image]](LICENSE)

Request that Node.js child processes preload modules

### Install node-preload

This module requires node.js 8 or above.

```sh
npm i node-preload
```

## Usage

```js
'use strict';

const nodePreload = require('node-preload');

// Request that all Node.js child processes preload @babel/register
nodePreload.preloadAppend(require.resolve('@babel/register'));

// Request that child processes be spawned with enviroment TEST1=value1
nodePreload.propagateEnv('TEST1', 'value1');
```

### preloadAppend(filename)

Append `filename` to the list of modules to be preloaded.
If `filename` is already in the list it will be moved to the end.

### preloadInsert(filename)

Insert `filename` to the list of modules to be preloaded.
If `filename` is already in the list it will be moved to the beginning.

### preloadRemove(filename)

Remove `filename` from the list of modules to be preloaded.

### preloadGetList()

Retrieve an array listing the current filenames to be preloaded.

### propagateEnv(name, value)

Specify an environmental variable to be propagated to child processes.
If `value` is undefined this cancels the propagation of the specified variable.

### propagateGetEnv()

Retrieve an object containing the environmental variables to be propagated
to child processes.  Modifications to the returned object do not effect child
processes, `propagateEnv` must be used to perform manipulations.

## Running tests

Tests are provided by xo and ava.

```sh
npm install
npm test
```

[npm-image]: https://img.shields.io/npm/v/node-preload.svg
[npm-url]: https://npmjs.org/package/node-preload
[travis-image]: https://travis-ci.org/cfware/node-preload.svg?branch=master
[travis-url]: https://travis-ci.org/cfware/node-preload
[gk-image]: https://badges.greenkeeper.io/cfware/node-preload.svg
[downloads-image]: https://img.shields.io/npm/dm/node-preload.svg
[downloads-url]: https://npmjs.org/package/node-preload
[license-image]: https://img.shields.io/npm/l/node-preload.svg
