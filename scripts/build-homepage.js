#!/usr/bin/env node
/**
 * Writes index.html from lib/homepage-template.js (future-community lead-gen layout).
 * Run: node scripts/build-homepage.js
 */
'use strict';

const fs = require('fs');
const path = require('path');
const tpl = require('../lib/homepage-template');

const out = path.join(__dirname, '..', 'index.html');
fs.writeFileSync(out, tpl.render());
console.log('build-homepage: wrote index.html');
