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
nodePreload.propagateEnv.TEST1 = 'value1';
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

### propagateEnv

Similar to `process.env` but controls environmental variables to be propagated
to child processes.

## Running tests

Tests are provided by xo and ava.

```sh
npm install
npm test
```

## `node-preload` for enterprise

Available as part of the Tidelift Subscription.

The maintainers of `node-preload` and thousands of other packages are working with Tidelift to deliver commercial support and maintenance for the open source dependencies you use to build your applications. Save time, reduce risk, and improve code health, while paying the maintainers of the exact dependencies you use. [Learn more.](https://tidelift.com/subscription/pkg/npm-node-preload?utm_source=npm-node-preload&utm_medium=referral&utm_campaign=enterprise&utm_term=repo)

[npm-image]: https://img.shields.io/npm/v/node-preload.svg
[npm-url]: https://npmjs.org/package/node-preload
[travis-image]: https://travis-ci.org/cfware/node-preload.svg?branch=master
[travis-url]: https://travis-ci.org/cfware/node-preload
[gk-image]: https://badges.greenkeeper.io/cfware/node-preload.svg
[downloads-image]: https://img.shields.io/npm/dm/node-preload.svg
[downloads-url]: https://npmjs.org/package/node-preload
[license-image]: https://img.shields.io/npm/l/node-preload.svg
