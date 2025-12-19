// Simple in-memory cart (persists per session)
const cart = JSON.parse(sessionStorage.getItem('leafyCart') || '{}');

function saveCart() {
  sessionStorage.setItem('leafyCart', JSON.stringify(cart));
}

function addToCart(product) {
  if (cart[product.id]) {
    cart[product.id].qty += 1;
  } else {
    cart[product.id] = {...product, qty: 1};
  }
  saveCart();
  updateHeaderCount();
}

function updateHeaderCount() {
  const count = Object.values(cart).reduce((s, p) => s + p.qty, 0);
  document.querySelectorAll('#cart-count').forEach(el => el.textContent = count);
}

function renderCart() {
  const tbody = document.querySelector('#cart-table tbody');
  if (!tbody) return; // not on cart page
  tbody.innerHTML = '';

  let totalItems = 0, totalCost = 0;

  Object.values(cart).forEach(p => {
    const sub = p.qty * p.price;
    totalItems += p.qty;
    totalCost += sub;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><img src="${p.img}" alt="${p.name}" class="thumb">${p.name}</td>
      <td>$${p.price}</td>
      <td>
        <button class="inc" data-id="${p.id}">+</button>
        ${p.qty}
        <button class="dec" data-id="${p.id}">-</button>
      </td>
      <td>$${sub.toFixed(2)}</td>
      <td><button class="del" data-id="${p.id}">Delete</button></td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById('total-items').textContent = totalItems;
  document.getElementById('total-cost').textContent = totalCost.toFixed(2);

  // attach event handlers
  tbody.addEventListener('click', e => {
    const id = e.target.dataset.id;
    if (!id) return;
    if (e.target.classList.contains('inc')) changeQty(id, 1);
    if (e.target.classList.contains('dec')) changeQty(id, -1);
    if (e.target.classList.contains('del')) { deleteItem(id); }
  });

  updateHeaderCount();
}

function changeQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) delete cart[id];
  saveCart();
  renderCart();
}

function deleteItem(id) {
  delete cart[id];
  saveCart();
  renderCart();
}

// run header update on every page
updateHeaderCount();