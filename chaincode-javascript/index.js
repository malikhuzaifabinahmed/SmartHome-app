/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const assetTransfer = require('./lib/assetTransfer');
const identity = require('./lib/identity');


module.exports.AssetTransfer = identity;
module.exports.contracts = [identity];
