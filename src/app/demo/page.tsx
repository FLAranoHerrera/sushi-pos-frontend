"use client";

import { useState } from 'react';
import Link from 'next/link';
import { initialState, changeQuantity, cartTotal, placeOrder, closeOrder } from '@/lib/demo';
import type { DemoState } from '@/lib/demo';
import './demo.css';
const money = (cents: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(cents / 100);
const statuses = { pending: 'Pendiente', paid: 'Cobro simulado', cancelled: 'Cancelada' };

export default function DemoPage() {
  const [state, setState] = useState(initialState);
  const [category, setCategory] = useState('Todos');
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [failNext, setFailNext] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const act = (operation: (current: DemoState) => DemoState, message: string) => {
    try { setState(operation(state)); setError(''); setNotice(message); }
    catch (error) { setError(error instanceof Error ? error.message : 'No se pudo completar la acción.'); setNotice(''); }
  };
  const submit = async () => {
    if (busy) return;
    setBusy(true); setError(''); setNotice('');
    // Simulated waiting/error states: this demo never sends a network request.
    await new Promise(resolve => setTimeout(resolve, 650));
    if (failNext) { setError('No pudimos crear la orden simulada. Tu selección se conserva; vuelve a intentarlo.'); setFailNext(false); }
    else act(placeOrder, 'Orden creada. El inventario se actualizó y puedes simular el cobro o cancelarla.');
    setBusy(false);
  };
  const products = state.products.filter(p => (category === 'Todos' || p.category === category) && p.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  return <main className="pos-demo">
    <header className="demo-header"><div><p className="demo-eyebrow">FRANCISCO ARANO / DEMO FULL STACK</p><h1>Sushi POS<span>Una orden, de principio a fin.</span></h1></div><Link href="/login">Ir al acceso del proyecto ↗</Link></header>
    <div className="demo-banner"><strong>Explora sin registrarte.</strong> Datos ficticios y cobros simulados. Todo ocurre en este navegador; al recargar se reinicia la demo.</div>
    <div className="demo-guide"><span>01 · Elige productos</span><span>02 · Crea una orden</span><span>03 · Simula el cobro o cancela</span></div>
    <section className="demo-summary" aria-label="Resumen de la sesión">
      <div><span>Órdenes</span><strong>{state.orders.length}</strong></div>
      <div><span>Pendientes</span><strong>{state.orders.filter(o => o.status === 'pending').length}</strong></div>
      <div><span>Cobros simulados</span><strong>{money(state.orders.filter(o => o.status === 'paid').reduce((total, o) => total + o.total, 0))}</strong></div>
    </section>
    {error && <p role="alert" className="demo-error">{error}</p>}
    <p role="status" aria-live="polite" className="demo-notice">{busy ? 'Creando orden simulada…' : notice}</p>
    <div className="demo-columns">
      <section aria-labelledby="menu-title"><h2 id="menu-title">Carta del día</h2><label className="demo-search">Buscar producto<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Por ejemplo, ramen" /></label>
        <div className="demo-categories" aria-label="Filtrar por categoría">{['Todos', 'Cocina', 'Sushi', 'Bebidas', 'Postres'].map(c => <button key={c} aria-pressed={category === c} onClick={() => setCategory(c)}>{c}</button>)}</div>
        <div className="demo-products">{products.map(product => <article key={product.id} className="demo-product"><span className="demo-emoji" aria-hidden="true">{product.emoji}</span><p className="demo-eyebrow">{product.category}</p><h3>{product.name}</h3><p>{money(product.price)} <span className="demo-stock">{product.stock ? `${product.stock} disponibles` : 'Agotado'}</span></p><button className="demo-primary" disabled={busy || product.stock === 0} onClick={() => act(s => changeQuantity(s, product.id, 1), `${product.name} añadido.`)} aria-label={`Añadir ${product.name}`}>{product.stock ? 'Añadir a la orden' : 'Sin existencias'}</button></article>)}</div>
        {!products.length && <p className="demo-empty">No hay productos que coincidan. Prueba otra búsqueda o categoría.</p>}
      </section>
      <aside className="demo-cart" aria-labelledby="cart-title"><h2 id="cart-title">Tu orden</h2><p className="demo-muted">Mesa de demostración · precios en MXN</p>
        {!state.cart.length && <p className="demo-empty">Tu orden está vacía. Elige un producto de la carta para comenzar.</p>}
        <ul>{state.cart.map(line => { const product = state.products.find(p => p.id === line.productId)!; return <li key={line.productId}><strong>{product.name}</strong><div className="demo-quantity"><button disabled={busy} aria-label={`Quitar uno de ${product.name}`} onClick={() => act(s => changeQuantity(s, product.id, -1), 'Cantidad actualizada.')}>−</button><span aria-label={`Cantidad de ${product.name}`}>{line.quantity}</span><button disabled={busy} aria-label={`Añadir uno de ${product.name}`} onClick={() => act(s => changeQuantity(s, product.id, 1), 'Cantidad actualizada.')}>+</button><span>{money(product.price * line.quantity)}</span></div></li>; })}</ul>
        <div className="demo-total"><span>Total</span><strong>{money(cartTotal(state))}</strong></div>
        <button className="demo-primary" onClick={submit} disabled={busy || !state.cart.length}>{busy ? 'Creando…' : 'Crear orden simulada'}</button>
        <label className="demo-failure"><input type="checkbox" checked={failNext} disabled={busy} onChange={e => setFailNext(e.target.checked)} /> Probar un error recuperable en el próximo intento</label>
      </aside>
    </div>
    <section className="demo-orders" aria-labelledby="orders-title"><h2 id="orders-title">Órdenes de esta sesión</h2>{!state.orders.length && <p className="demo-empty">Aquí aparecerán las órdenes que crees.</p>}
      {state.orders.map(order => <article key={order.id}><div><h3>Orden #{order.id}</h3><p>{order.items.map(item => `${item.quantity} × ${item.name}`).join(' · ')}</p></div><strong>{money(order.total)}</strong><span className={`demo-badge ${order.status}`}>{statuses[order.status]}</span>{order.status === 'pending' && <div className="demo-order-actions"><button disabled={busy} className="demo-primary" onClick={() => act(s => closeOrder(s, order.id, 'paid'), 'Cobro simulado. No se realizó ningún cargo.')}>Simular cobro #{order.id}</button><button disabled={busy} onClick={() => act(s => closeOrder(s, order.id, 'cancelled'), 'Orden cancelada. Las existencias se devolvieron una sola vez.')}>Cancelar #{order.id}</button></div>}</article>)}
    </section>
    <footer className="demo-footer"><div><strong>¿Qué muestra esta demo?</strong><p>Selección de productos, búsqueda, inventario, validaciones, carga, recuperación de errores y estados de órdenes. Es una simulación frontend; el backend y sus pruebas se pueden revisar por separado.</p><a href="https://github.com/FLAranoHerrera/sushi-pos-frontend">Código frontend ↗</a> · <a href="https://github.com/FLAranoHerrera/sushi-pos-backend">Código backend ↗</a></div>
      <div>{resetConfirm ? <><p>Se borrarán solo los datos ficticios de esta sesión.</p><button disabled={busy} onClick={() => { setState(initialState()); setResetConfirm(false); setError(''); setNotice('Demo reiniciada.'); setFailNext(false); }}>Confirmar reinicio</button><button onClick={() => setResetConfirm(false)}>Conservar sesión</button></> : <button disabled={busy} onClick={() => setResetConfirm(true)}>Reiniciar demo</button>}</div>
    </footer>
  </main>;
}
