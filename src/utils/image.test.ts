import test from 'node:test';
import assert from 'node:assert';
import { getMimeType } from './image.js';

test('getMimeType with jpeg', () => {
  const dataUrl = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...';
  assert.strictEqual(getMimeType(dataUrl), 'image/jpeg');
});

test('getMimeType with png', () => {
  const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAE...';
  assert.strictEqual(getMimeType(dataUrl), 'image/png');
});

test('getMimeType fallback', () => {
  const dataUrl = 'not-a-valid-data-url';
  assert.strictEqual(getMimeType(dataUrl), 'image/png');
});
