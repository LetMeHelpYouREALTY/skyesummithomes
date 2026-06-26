'use strict';

const fs = require('fs');
const path = require('path');

function isHomepageManaged(root, filePath) {
  const rel = path.relative(root, filePath).replace(/\\/g, '/');
  if (rel !== 'index.html') return false;
  try {
    return fs.readFileSync(filePath, 'utf8').includes('<!-- HOMEPAGE_MANAGED -->');
  } catch {
    return false;
  }
}

module.exports = { isHomepageManaged };
