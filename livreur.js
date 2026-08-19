/* =========================================================
   BULLBORN — livreur.js
   Page livreur.html : connexion (Firebase Authentication),
   puis liste en direct de toutes les commandes (Firestore),
   avec des boutons pour changer le statut de chacune.
   ========================================================= */

import { db, auth, firebaseReady } from './firebase-config.js';
import {
  signInWithEmailAndPassword, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import {
  collection, query, orderBy, onSnapshot, doc, updateDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const STATUSES = [
  { key: 'confirmee', label: 'Confirmée' },
  { key: 'emballage', label: 'Emballage' },
  { key: 'livraison', label: 'En livraison' },
  { key: 'livree', label: 'Livrée' }
];

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('staffLoginForm');
  const loginMsg = document.getElementById('staffLoginMsg');
  const ordersPanel = document.getElementById('staffOrders');
  const ordersList = document.getElementById('staffOrdersList');
  const emptyMsg = document.getElementById('staffEmptyMsg');
  const logoutBtn = document.getElementById('staffLogoutBtn');

  if (!loginForm) return;

  if (!firebaseReady) {
    loginMsg.textContent = "Firebase n'est pas encore configuré (voir firebase-config.js) — l'espace livreur ne peut pas fonctionner pour l'instant.";
    loginMsg.classList.add('show', 'error');
    loginForm.querySelector('button[type="submit"]').disabled = true;
    return;
  }

  let unsubscribeOrders = null;

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginMsg.classList.remove('show', 'error');
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    submitBtn.classList.add('is-loading');
    const email = document.getElementById('staffEmail').value.trim();
    const password = document.getElementById('staffPassword').value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      loginMsg.textContent = "Connexion impossible : vérifie l'email et le mot de passe.";
      loginMsg.classList.add('show', 'error');
    } finally {
      submitBtn.classList.remove('is-loading');
    }
  });

  logoutBtn.addEventListener('click', () => signOut(auth));

  onAuthStateChanged(auth, (user) => {
    if (user) {
      loginForm.style.display = 'none';
      ordersPanel.classList.add('show');
      listenToOrders();
    } else {
      loginForm.style.display = '';
      loginForm.reset();
      ordersPanel.classList.remove('show');
      if (unsubscribeOrders) { unsubscribeOrders(); unsubscribeOrders = null; }
    }
  });

  function listenToOrders() {
    if (unsubscribeOrders) unsubscribeOrders();
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    unsubscribeOrders = onSnapshot(q,
      (snap) => renderOrders(snap.docs),
      (err) => {
        console.error('Erreur de chargement des commandes :', err);
        ordersList.innerHTML = '';
        emptyMsg.style.display = 'block';
        emptyMsg.textContent = "Impossible de charger les commandes (vérifie les règles Firestore).";
      }
    );
  }

  function renderOrders(docs) {
    if (docs.length === 0) {
      ordersList.innerHTML = '';
      emptyMsg.style.display = 'block';
      return;
    }
    emptyMsg.style.display = 'none';

    ordersList.innerHTML = docs.map(d => {
      const data = d.data();
      const itemsSummary = (data.items || [])
        .map(it => `${it.name} (T.${it.size || '-'}) x${it.qty}`)
        .join(', ');
      const statusBtns = STATUSES.map(s =>
        `<button type="button" class="staff-status-btn ${data.status === s.key ? 'active' : ''}" data-code="${d.id}" data-status="${s.key}">${s.label}</button>`
      ).join('');

      return `
        <div class="staff-order">
          <div class="staff-order-head">
            <span class="staff-order-code">${d.id}</span>
            <span class="staff-order-meta">${data.total || 0} MAD</span>
          </div>
          <div class="staff-order-meta">
            ${data.prenom || ''} ${data.nom || ''} · ${data.tel || ''}${data.email ? ' · ' + data.email : ''}<br>
            ${data.adresse || ''}<br>
            ${itemsSummary}
          </div>
          <div class="staff-status-group">${statusBtns}</div>
        </div>`;
    }).join('');

    ordersList.querySelectorAll('.staff-status-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const code = btn.dataset.code;
        const status = btn.dataset.status;
        btn.closest('.staff-status-group').querySelectorAll('.staff-status-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        try {
          await updateDoc(doc(db, 'orders', code), { status, updatedAt: serverTimestamp() });
        } catch (err) {
          console.error('Impossible de mettre à jour le statut :', err);
        }
      });
    });
  }
});
