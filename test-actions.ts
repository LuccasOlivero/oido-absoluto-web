import test from 'node:test';
import assert from 'node:assert';
import { login, signup } from './src/app/actions.js';

test('login requires valid player_name and password', async () => {
  const formData = new FormData();
  formData.append('player_name', '');
  formData.append('password', '');
  
  const result = await login(formData);
  // It should return an error immediately, before trying to call createClient
  assert.ok(result && result.error);
  assert.match(result.error, /requerid/i);
});

test('signup requires valid email, player_name, and password', async () => {
  const formData = new FormData();
  formData.append('email', 'not-an-email');
  formData.append('player_name', 'ab'); // Too short
  formData.append('password', '123'); // Too short
  
  const result = await signup(formData);
  assert.ok(result && result.error);
});
