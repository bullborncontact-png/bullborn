/* =========================================================
   BULLBORN — script.js
   Ce fichier gère : le menu mobile, le panier (stocké dans
   le navigateur avec localStorage, donc il reste rempli
   quand on change de page), et le formulaire de contact.
   Tu n'as normalement rien à modifier ici.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Menu mobile ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  /* ---------- Stock (utilisé par la page Shop + le panneau Admin) ----------
     Chaque produit/taille a une quantité en stock, stockée dans le
     navigateur (localStorage). L'admin peut modifier ces quantités
     depuis admin.html. Si un produit n'a jamais été initialisé, il
     démarre avec un stock par défaut de 20 par taille. */
  const STOCK_KEY = 'bullborn_stock';
  const PRODUCT_SIZES = {
    'Hoodie BULLBORN':          ['M', 'L', 'XL', 'XXL', 'XXXL'],
    'Débardeur BULLBORN':       ['M', 'L', 'XL', 'XXL', 'XXXL'],
    'T-shirt BULLBORN':         ['M', 'L', 'XL', 'XXL', 'XXXL'],
    'Legging BULLBORN':         ['XS', 'S', 'M', 'L', 'XL'],
    'T-shirt BULLBORN Femme':   ['XS', 'S', 'M', 'L', 'XL']
  };
  const DEFAULT_STOCK_QTY = 20;

  function stockKey(name, size) { return name + '|' + size; }

  function getStockRaw() {
    try {
      return JSON.parse(localStorage.getItem(STOCK_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveStockRaw(stock) {
    localStorage.setItem(STOCK_KEY, JSON.stringify(stock));
  }

  function ensureStockDefaults() {
    const stock = getStockRaw();
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
    if (changed) saveStockRaw(stock);
    return stock;
  }

  function getStockQty(name, size) {
    const stock = ensureStockDefaults();
    const v = stock[stockKey(name, size)];
    return typeof v === 'number' ? v : DEFAULT_STOCK_QTY;
  }

  function decrementStock(name, size, qty) {
    const stock = ensureStockDefaults();
    const k = stockKey(name, size);
    stock[k] = Math.max(0, (typeof stock[k] === 'number' ? stock[k] : DEFAULT_STOCK_QTY) - qty);
    saveStockRaw(stock);
  }

  ensureStockDefaults();

  /* ---------- Commandes (utilisé par le panneau Admin) ----------
     Chaque commande passée est enregistrée dans le navigateur en plus
     de l'envoi WhatsApp, pour que admin.html puisse afficher les
     statistiques et gérer le statut de chaque commande. */
  const ORDERS_KEY = 'bullborn_orders';

  function getOrders() {
    try {
      return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveOrder(order) {
    const orders = getOrders();
    orders.unshift(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }

  /* ---------- Panier ---------- */
  const CART_KEY = 'bullborn_cart';

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCart();
  }

  function addToCart(name, price, size) {
    const cart = getCart();
    const existing = cart.find(item => item.name === name && item.size === size);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name, price, size, qty: 1 });
    }
    saveCart(cart);
    showAddedMessage();
    bumpCartCount();
  }

  function removeFromCart(name, size) {
    let cart = getCart();
    cart = cart.filter(item => !(item.name === name && item.size === size));
    saveCart(cart);
  }

  function renderCart() {
    const cart = getCart();
    const countEl = document.getElementById('cartCount');
    const itemsEl = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');

    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    if (countEl) countEl.textContent = totalQty;

    if (!itemsEl || !totalEl) return; // pas de panneau panier sur cette page

    if (cart.length === 0) {
      itemsEl.innerHTML = '<p class="cart-empty">Votre panier est vide.</p>';
      totalEl.textContent = '0 MAD';
      return;
    }

    let total = 0;
    itemsEl.innerHTML = cart.map(item => {
      total += item.price * item.qty;
      return `
        <div class="cart-item">
          <div>
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-qty">Taille ${item.size || '-'} · Quantité : ${item.qty} · ${item.price} MAD</div>
            <button class="cart-item-remove" data-remove-name="${item.name}" data-remove-size="${item.size || ''}">Retirer</button>
          </div>
          <div>${item.price * item.qty} MAD</div>
        </div>`;
    }).join('');

    totalEl.textContent = total + ' MAD';

    itemsEl.querySelectorAll('[data-remove-name]').forEach(btn => {
      btn.addEventListener('click', () => removeFromCart(btn.dataset.removeName, btn.dataset.removeSize));
    });
  }

  function showAddedMessage() {
    const msg = document.getElementById('addedMsg');
    if (!msg) return;
    msg.classList.add('show');
    clearTimeout(showAddedMessage._t);
    showAddedMessage._t = setTimeout(() => msg.classList.remove('show'), 1800);
  }

  function bumpCartCount() {
    const countEl = document.getElementById('cartCount');
    if (!countEl) return;
    countEl.classList.remove('bump');
    void countEl.offsetWidth; // relance l'animation même si elle vient de tourner
    countEl.classList.add('bump');
  }

  /* ---------- Filtre Homme / Femme (page Shop) ----------
     Les onglets ont un attribut data-filter ("all", "homme"
     ou "femme") et chaque produit un attribut data-category
     sur son <article class="product-card">. On peut aussi
     arriver directement filtré depuis l'accueil avec
     shop.html?cat=femme ou shop.html?cat=homme. */
  const shopTabs = document.querySelectorAll('.shop-tab');
  const productCards = document.querySelectorAll('.product-card[data-category]');

  function applyShopFilter(filter) {
    productCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
    });
    shopTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.filter === filter);
    });
  }

  if (shopTabs.length) {
    shopTabs.forEach(tab => {
      tab.addEventListener('click', () => applyShopFilter(tab.dataset.filter));
    });

    const urlCat = new URLSearchParams(window.location.search).get('cat');
    if (urlCat === 'homme' || urlCat === 'femme') {
      applyShopFilter(urlCat);
    }
  }

  /* ---------- Sélection de taille (page Shop) ----------
     Grise et désactive les tailles en rupture de stock (quantité à 0
     dans le panneau Admin). Un clic sur une taille en rupture affiche
     un message au lieu de la sélectionner. */
  document.querySelectorAll('.product-card').forEach(card => {
    const sizeBtns = card.querySelectorAll('.size-option');
    const addBtn = card.querySelector('.add-to-cart');
    const productName = addBtn ? addBtn.dataset.name : null;
    const warn = card.querySelector('.size-warning');

    if (productName) {
      sizeBtns.forEach(b => {
        if (getStockQty(productName, b.dataset.size) <= 0) {
          b.classList.add('out-of-stock');
          b.disabled = true;
        }
      });
    }

    sizeBtns.forEach(sizeBtn => {
      sizeBtn.addEventListener('click', () => {
        if (sizeBtn.classList.contains('out-of-stock')) {
          if (warn) {
            warn.textContent = 'Cette taille est en rupture de stock.';
            warn.classList.add('show');
          }
          return;
        }
        sizeBtns.forEach(b => b.classList.remove('selected'));
        sizeBtn.classList.add('selected');
        card.dataset.selectedSize = sizeBtn.dataset.size;
        if (warn) {
          warn.textContent = "Choisis une taille avant d'ajouter au panier.";
          warn.classList.remove('show');
        }
      });
    });
  });

  document.querySelectorAll('.add-to-cart').forEach(btn => {
    // Restructure le bouton : le texte d'origine passe dans .btn-label,
    // et on ajoute un ripple + un état "Ajouté" qui se superpose dessus.
    const originalLabel = btn.textContent.trim();
    btn.textContent = '';

    const label = document.createElement('span');
    label.className = 'btn-label';
    label.textContent = originalLabel;

    const ripple = document.createElement('span');
    ripple.className = 'btn-ripple';

    const check = document.createElement('span');
    check.className = 'btn-check';
    check.textContent = '✓ Ajouté';

    btn.appendChild(label);
    btn.appendChild(ripple);
    btn.appendChild(check);

    btn.addEventListener('click', () => {
      const card = btn.closest('.product-card');
      const size = card ? card.dataset.selectedSize : null;
      const warn = card ? card.querySelector('.size-warning') : null;

      if (!size) {
        if (warn) warn.classList.add('show');
        return;
      }

      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);

      const alreadyInCart = getCart().find(i => i.name === name && i.size === size);
      const qtyInCart = alreadyInCart ? alreadyInCart.qty : 0;
      if (qtyInCart + 1 > getStockQty(name, size)) {
        if (warn) {
          warn.textContent = 'Stock insuffisant pour cette taille.';
          warn.classList.add('show');
        }
        return;
      }

      addToCart(name, price, size);

      btn.classList.remove('added');
      void btn.offsetWidth;
      btn.classList.add('added');
      clearTimeout(btn._addedTimeout);
      btn._addedTimeout = setTimeout(() => btn.classList.remove('added'), 1100);
    });
  });

  const cartOpenBtn = document.getElementById('cartOpenBtn');
  const cartPanel = document.getElementById('cartPanel');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartCloseBtn = document.getElementById('cartCloseBtn');

  function openCart() {
    cartPanel && cartPanel.classList.add('open');
    cartOverlay && cartOverlay.classList.add('show');
  }
  function closeCart() {
    cartPanel && cartPanel.classList.remove('open');
    cartOverlay && cartOverlay.classList.remove('show');
  }

  if (cartOpenBtn) cartOpenBtn.addEventListener('click', openCart);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  renderCart();

  /* ---------- Commande (modal Passer la commande) ----------
     Au clic sur "Passer la commande", un formulaire s'ouvre
     (prénom, nom, téléphone, adresse). À la validation, un
     message récapitulatif de la commande + les infos client
     sont envoyés vers WhatsApp de la marque (+212 766808334).
     Pour changer le numéro qui reçoit les commandes, modifie
     la valeur juste en dessous : ---------------------------- */
  const WHATSAPP_NUMBER = '212766808334';

  const checkoutBtn = document.getElementById('checkoutBtn');
  const checkoutOverlay = document.getElementById('checkoutOverlay');
  const checkoutModal = document.getElementById('checkoutModal');
  const checkoutCloseBtn = document.getElementById('checkoutCloseBtn');
  const checkoutForm = document.getElementById('checkoutForm');

  function openCheckout() {
    if (getCart().length === 0) return; // rien à commander
    closeCart();
    checkoutModal && checkoutModal.classList.add('open');
    checkoutOverlay && checkoutOverlay.classList.add('show');
  }
  function closeCheckout() {
    checkoutModal && checkoutModal.classList.remove('open');
    checkoutOverlay && checkoutOverlay.classList.remove('show');
  }

  if (checkoutBtn) checkoutBtn.addEventListener('click', openCheckout);
  if (checkoutCloseBtn) checkoutCloseBtn.addEventListener('click', closeCheckout);
  if (checkoutOverlay) checkoutOverlay.addEventListener('click', closeCheckout);

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const cart = getCart();
      if (cart.length === 0) return;

      const submitBtn = checkoutForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.classList.add('is-loading');

      const prenom = document.getElementById('coPrenom').value.trim();
      const nom = document.getElementById('coNom').value.trim();
      const tel = document.getElementById('coTel').value.trim();
      const adresse = document.getElementById('coAdresse').value.trim();

      let total = 0;
      const recap = cart.map(item => {
        total += item.price * item.qty;
        return `- ${item.name} (Taille ${item.size || '-'}) x${item.qty} (${item.price * item.qty} MAD)`;
      }).join('\n');

      const message =
        `Nouvelle commande BULLBORN\n\n` +
        `Client : ${prenom} ${nom}\n` +
        `Téléphone : ${tel}\n` +
        `Adresse : ${adresse}\n\n` +
        `Articles :\n${recap}\n\n` +
        `Total : ${total} MAD`;

      // Enregistre la commande pour le panneau Admin (statistiques,
      // suivi de statut) et retire les quantités vendues du stock.
      saveOrder({
        id: Date.now(),
        date: new Date().toISOString(),
        client: { prenom, nom, tel, adresse },
        items: cart.map(item => ({ name: item.name, size: item.size, price: item.price, qty: item.qty })),
        total,
        status: 'En attente'
      });
      cart.forEach(item => decrementStock(item.name, item.size, item.qty));

      // Petit délai pour laisser voir l'animation de chargement avant
      // l'ouverture de WhatsApp et la fermeture du modal.
      setTimeout(() => {
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');

        localStorage.removeItem(CART_KEY);
        renderCart();
        checkoutForm.reset();
        if (submitBtn) submitBtn.classList.remove('is-loading');
        closeCheckout();
      }, 450);
    });
  }

  /* ---------- Formulaire de contact ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const successEl = document.getElementById('formSuccess');
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('is-loading');
      }

      // Envoi réel du message vers bullborncontact@gmail.com via FormSubmit
      // (service gratuit, aucune inscription nécessaire). La toute première
      // fois, Gmail reçoit un email de confirmation à cliquer pour activer
      // la réception — ensuite tous les messages arrivent normalement.
      fetch('https://formsubmit.co/ajax/bullborncontact@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          Nom: document.getElementById('name').value,
          Email: document.getElementById('email').value,
          Message: document.getElementById('message').value,
          _subject: 'Nouveau message — BULLBORN Contact'
        })
      })
      .then(res => res.json())
      .then(() => {
        if (successEl) successEl.classList.add('show');
        contactForm.reset();
      })
      .catch(() => {
        alert("Une erreur est survenue lors de l'envoi. Merci de réessayer ou de nous écrire directement à bullborncontact@gmail.com.");
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('is-loading');
        }
      });
    });
  }

});
