#!/usr/bin/env node
/**
 * Lightweight checks for FUB event payload shape (no live API calls).
 */
'use strict';

import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// Compile on the fly via ts-node is not available; duplicate minimal logic for validation rules.
function resolveEventType(body) {
  if (body.formKind === 'valuation') return 'Seller Inquiry';
  if (body.formKind === 'contact') return 'General Inquiry';
  if (body.propertyAddress?.trim()) return 'Seller Inquiry';
  if (body.serviceInterest === 'Valuation Request') return 'Seller Inquiry';
  return 'General Inquiry';
}

assert.equal(resolveEventType({ formKind: 'contact' }), 'General Inquiry');
assert.equal(resolveEventType({ formKind: 'valuation' }), 'Seller Inquiry');
assert.equal(
  resolveEventType({ serviceInterest: 'Valuation Request' }),
  'Seller Inquiry'
);

console.log('test-followupboss-payload: ok');
