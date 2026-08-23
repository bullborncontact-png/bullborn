/* =========================================================
   BULLBORN — admin.js
   -----------------------------------------------------------
   Gère : la connexion admin, les statistiques, la liste des
   commandes (avec changement de statut) et la gestion du stock.
   Toutes les données viennent du navigateur (localStorage) —
   les mêmes clés que celles utilisées par script.js sur le site.

   POUR CHANGER LE MOT DE PASSE ADMIN : modifie la valeur juste
   en dessous. Ce n'est qu'une protection légère côté navigateur,
   pas une vraie authentification sécurisée.
   ========================================================= */

const ADMIN_PASSWORD = 'bullborn2026';

const STOCK_KEY = 'bullborn_stock';
const ORDERS_KEY = 'bullborn_orders';
const AUTH_KEY = 'bullborn_admin_auth';

const PRODUCT_SIZES = {
  'Hoodie BULLBORN':        ['M', 'L', 'XL', 'XXL', 'XXXL'],
  'Débardeur BULLBORN':     ['M', 'L', 'XL', 'XXL', 'XXXL'],
  'T-shirt BULLBORN':       ['M', 'L', 'XL', 'XXL', 'XXXL'],
  'Legging BULLBORN':       ['XS', 'S', 'M', 'L', 'XL'],
  'T-shirt BULLBORN Femme': ['XS', 'S', 'M', 'L', 'XL']
};
const DEFAULT_STOCK_QTY = 20;

const STATUSES = ['En attente', 'Confirmée', 'Préparation', 'Livrée', 'Annulée'];

/* ---------- Stock : helpers (mêmes clés que script.js) ---------- */
function stockKey(name, size) { return name + '|' + size; }

function getStock() {
  try {
    return JSON.parse(localStorage.getItem(STOCK_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function saveStock(stock) {
  localStorage.setItem(STOCK_KEY, JSON.stringify(stock));
}

function ensureStockDefaults() {
  const stock = getStock();
  let changed = false;
  Object.keys(PRODUCT_SIZES).forEach(name => {
    PRODUCT_SIZES[name].forEach(size => {
      const k = stockKey(name, size);
      if (!(k in stock)) {
        stock[k] = DEFAULT_STOCK_QTY;
        changed = true;
      }
    });
  });
  if (changed) saveStock(stock);
  return stock;
}

/* ---------- Commandes ---------- */
function getOrders() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

document.addEventListener('DOMContentLoaded', () => {

  const loginSection = document.getElementById('adminLogin');
  const adminWrap = document.getElementById('adminWrap');
  const loginForm = document.getElementById('adminLoginForm');
  const loginError = document.getElementById('adminLoginError');
  const logoutBtn = document.getElementById('adminLogoutBtn');

  function showDashboard() {
    loginSection.hidden = true;
    adminWrap.hidden = false;
    renderAll();
  }

  function showLogin() {
    adminWrap.hidden = true;
    loginSection.hidden = false;
  }

  if (sessionStorage.getItem(AUTH_KEY) === 'true') {
    showDashboard();
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = document.getElementById('adminPassword').value;
    if (value === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      loginError.classList.remove('show');
      loginForm.reset();
      showDashboard();
    } else {
      loginError.classList.add('show');
    }
  });

  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem(AUTH_KEY);
    showLogin();
  });

  /* ---------- Onglets ---------- */
  const tabs = document.querySelectorAll('.admin-tab');
  const panelOrders = document.getElementById('panelOrders');
  const panelStock = document.getElementById('panelStock');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      panelOrders.hidden = target !== 'orders';
      panelStock.hidden = target !== 'stock';
    });
  });

  /* ---------- Rendu global ---------- */
  function renderAll() {
    renderStats();
    renderOrders();
    renderStock();
  }

  /* ---------- Statistiques ---------- */
  function renderStats() {
    const orders = getOrders();
    const totalOrders = orders.length;
    const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const pending = orders.filter(o => o.status === 'En attente').length;

    const salesByProduct = {};
    orders.forEach(o => {
      (o.items || []).forEach(item => {
        salesByProduct[item.name] = (salesByProduct[item.name] || 0) + item.qty;
      });
    });
    let bestSeller = '—';
    let bestQty = 0;
    Object.entries(salesByProduct).forEach(([name, qty]) => {
      if (qty > bestQty) { bestQty = qty; bestSeller = name; }
    });

    document.getElementById('statTotalOrders').textContent = totalOrders;
    document.getElementById('statRevenue').textContent = revenue + ' MAD';
    document.getElementById('statPending').textContent = pending;
    document.getElementById('statBestSeller').textContent = bestSeller === '—' ? '—' : `${bestSeller} (${bestQty})`;
  }

  /* ---------- Commandes ---------- */
  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return iso;
    }
  }

  function renderOrders() {
    const orders = getOrders();
    const tbody = document.getElementById('ordersTableBody');
    const empty = document.getElementById('ordersEmpty');
    tbody.innerHTML = '';

    if (orders.length === 0) {
      empty.style.display = 'block';
      return;
    }
    empty.style.display = 'none';

    orders.forEach(order => {
      const tr = document.createElement('tr');

      const itemsList = (order.items || []).map(i => `<li>${i.name} — Taille ${i.size || '-'} × ${i.qty}</li>`).join('');

      tr.innerHTML = `
        <td>${formatDate(order.date)}</td>
        <td>
          <div class="admin-client-name">${order.client ? order.client.prenom + ' ' + order.client.nom : '-'}</div>
          <div class="admin-client-address">${order.client ? order.client.adresse : ''}</div>
        </td>
        <td>${order.client ? order.client.tel : '-'}</td>
        <td><ul class="admin-items-list">${itemsList}</ul></td>
        <td>${order.total} MAD</td>
        <td></td>
        <td><button type="button" class="admin-delete-btn" data-order-id="${order.id}">Supprimer</button></td>
      `;

      const statusCell = tr.children[5];
      const select = document.createElement('select');
      select.className = 'admin-status-select';
      STATUSES.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s;
        opt.textContent = s;
        if (s === order.status) opt.selected = true;
        select.appendChild(opt);
      });
      select.addEventListener('change', () => {
        const all = getOrders();
        const target = all.find(o => o.id === order.id);
        if (target) {
          target.status = select.value;
          saveOrders(all);
          renderStats();
        }
      });
      statusCell.appendChild(select);

      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('[data-order-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!confirm('Supprimer cette commande ?')) return;
        const id = Number(btn.dataset.orderId);
        const remaining = getOrders().filter(o => o.id !== id);
        saveOrders(remaining);
        renderOrders();
        renderStats();
      });
    });
  }

  /* ---------- Stock ---------- */
  function renderStock() {
    const stock = ensureStockDefaults();
    const tbody = document.getElementById('stockTableBody');
    tbody.innerHTML = '';

    Object.keys(PRODUCT_SIZES).forEach(name => {
      PRODUCT_SIZES[name].forEach((size, index) => {
        const k = stockKey(name, size);
        const qty = stock[k];
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${index === 0 ? name : ''}</td>
          <td>${size}</td>
          <td>
            <input type="number" min="0" class="admin-stock-qty${qty === 0 ? ' zero' : ''}" value="${qty}" data-key="${k}">
            <span class="admin-saved-tag">Enregistré</span>
          </td>
        `;
        tbody.appendChild(tr);
      });
    });

    tbody.querySelectorAll('.admin-stock-qty').forEach(input => {
      input.addEventListener('change', () => {
        const value = Math.max(0, parseInt(input.value, 10) || 0);
        input.value = value;
        const current = getStock();
        current[input.dataset.key] = value;
        saveStock(current);
        input.classList.toggle('zero', value === 0);

        const tag = input.nextElementSibling;
        if (tag) {
          tag.classList.add('show');
          clearTimeout(tag._t);
          tag._t = setTimeout(() => tag.classList.remove('show'), 1500);
        }
        renderStats();
      });
    });
  }

});
