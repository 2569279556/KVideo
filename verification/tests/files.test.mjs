import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { lineCount, readJson, relative, walk, writeJson } from '../src/core/files.mjs';

test('file helpers inventory and serialize deterministic fixtures', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'kvideo-verify-'));
  fs.mkdirSync(path.join(root, 'nested'));
  fs.writeFileSync(path.join(root, 'nested', 'file.txt'), 'one\ntwo\n');
  const json = path.join(root, 'result.json');
  writeJson(json, { ok: true });
  assert.equal(lineCount(path.join(root, 'nested', 'file.txt')), 3);
  assert.equal(relative(root, path.join(root, 'nested', 'file.txt')), 'nested/file.txt');
  assert.deepEqual(readJson(json), { ok: true });
  assert.equal(walk(root, (file) => file.endsWith('.txt')).length, 1);
  fs.rmSync(root, { recursive: true, force: true });
});
