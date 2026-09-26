import { test } from 'node:test';
import assert from 'node:assert/strict';
import { initialState, changeQuantity, placeOrder, closeOrder, cartTotal } from '../src/lib/demo.ts';
test('calculates totals in cents and removes empty cart lines', () => {
  let state = changeQuantity(initialState(), 'ramen', 2);
  assert.equal(cartTotal(state), 33000);
  state = changeQuantity(state, 'ramen', -2);
  assert.equal(state.cart.length, 0);
});
test('rejects unavailable stock without changing the state', () => {
  const state = initialState();
  assert.throws(() => changeQuantity(state, 'tuna', 1), /existencias/);
  assert.throws(() => changeQuantity(state, 'mochi', 3), /existencias/);
  assert.equal(state.cart.length, 0);
});
test('creates an order and restores stock exactly once when cancelled', () => {
  let state = placeOrder(changeQuantity(initialState(), 'mochi', 2));
  assert.equal(state.products.find(p => p.id === 'mochi').stock, 0);
  assert.equal(state.cart.length, 0);
  const id = state.orders[0].id;
  state = closeOrder(state, id, 'cancelled');
  state = closeOrder(state, id, 'cancelled');
  assert.equal(state.products.find(p => p.id === 'mochi').stock, 2);
});
test('paid orders cannot be cancelled and empty orders cannot be created', () => {
  assert.throws(() => placeOrder(initialState()), /Añade/);
  let state = placeOrder(changeQuantity(initialState(), 'ramen', 1));
  state = closeOrder(state, state.orders[0].id, 'paid');
  assert.throws(() => closeOrder(state, state.orders[0].id, 'cancelled'), /cerrada/);
});
