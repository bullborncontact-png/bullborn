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

  function addToCart(name, price) {
    const cart = getCart();
    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name, price, qty: 1 });
    }
    saveCart(cart);
    showAddedMessage();
  }

  function removeFromCart(name) {
    let cart = getCart();
    cart = cart.filter(item => item.name !== name);
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
            <div class="cart-item-qty">Quantité : ${item.qty} · ${item.price} MAD</div>
            <button class="cart-item-remove" data-remove="${item.name}">Retirer</button>
          </div>
          <div>${item.price * item.qty} MAD</div>
        </div>`;
    }).join('');

    totalEl.textContent = total + ' MAD';

    itemsEl.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', () => removeFromCart(btn.dataset.remove));
    });
  }

  function showAddedMessage() {
    const msg = document.getElementById('addedMsg');
    if (!msg) return;
    msg.classList.add('show');
    clearTimeout(showAddedMessage._t);
    showAddedMessage._t = setTimeout(() => msg.classList.remove('show'), 1800);
  }

  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      addToCart(name, price);
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

      const prenom = document.getElementById('coPrenom').value.trim();
      const nom = document.getElementById('coNom').value.trim();
      const tel = document.getElementById('coTel').value.trim();
      const adresse = document.getElementById('coAdresse').value.trim();

      let total = 0;
      const recap = cart.map(item => {
        total += item.price * item.qty;
        return `- ${item.name} x${item.qty} (${item.price * item.qty} MAD)`;
      }).join('\n');

      const message =
        `Nouvelle commande BULLBORN\n\n` +
        `Client : ${prenom} ${nom}\n` +
        `Téléphone : ${tel}\n` +
        `Adresse : ${adresse}\n\n` +
        `Articles :\n${recap}\n\n` +
        `Total : ${total} MAD`;

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');

      localStorage.removeItem(CART_KEY);
      renderCart();
      checkoutForm.reset();
      closeCheckout();
    });
  }

  /* ---------- Formulaire de contact ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const successEl = document.getElementById('formSuccess');
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

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
        if (submitBtn) submitBtn.disabled = false;
      });
    });
  }

});
