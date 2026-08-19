/* =========================================================
   BULLBORN — suivi.js
   Page suivi.html : le client entre son code de commande,
   on va chercher la commande dans Firebase et on l'affiche
   avec les 4 étapes. La page reste connectée en direct
   (onSnapshot) : si le statut change côté livreur.html, ça
   se met à jour ici automatiquement, sans recharger la page.
   ========================================================= */

import { db, firebaseReady } from './firebase-config.js';
import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const STATUS_LABELS = {
  confirmee: 'Commande confirmée',
  emballage: 'En cours d\'emballage',
  livraison: 'En cours de livraison',
  livree: 'Livrée'
};
const STATUS_ORDER = ['confirmee', 'emballage', 'livraison', 'livree'];

document.addEventListener('DOMContentLoaded', () => {
  const trackForm = document.getElementById('trackForm');
  const trackCode = document.getElementById('trackCode');
  const trackMsg = document.getElementById('trackMsg');
  const orderResult = document.getElementById('orderResult');
  const resCode = document.getElementById('resCode');
  const resStatusLabel = document.getElementById('resStatusLabel');
  const resStepper = document.getElementById('resStepper');
  const resItems = document.getElementById('resItems');
  const resTotal = document.getElementById('resTotal');

  if (!trackForm) return;

  let unsubscribe = null;

  function showMsg(text, isError) {
    if (!trackMsg) return;
    trackMsg.textContent = text;
    trackMsg.classList.add('show');
    trackMsg.classList.toggle('error', !!isError);
  }
  function hideMsg() {
    trackMsg && trackMsg.classList.remove('show');
  }

  function renderOrder(code, data) {
    orderResult.classList.add('show');
    resCode.textContent = code;
    resStatusLabel.textContent = STATUS_LABELS[data.status] || data.status;

    const currentIndex = STATUS_ORDER.indexOf(data.status);
    resStepper.querySelectorAll('.step').forEach(stepEl => {
      const idx = STATUS_ORDER.indexOf(stepEl.dataset.status);
      stepEl.classList.toggle('done', idx < currentIndex);
      stepEl.classList.toggle('current', idx === currentIndex);
    });

    const items = data.items || [];
    resItems.innerHTML = items.map(it =>
      `<div class="order-line"><span>${it.name} (Taille ${it.size || '-'}) x${it.qty}</span><strong>${it.price * it.qty} MAD</strong></div>`
    ).join('');
    resTotal.innerHTML = `<span>Total</span><span>${data.total || 0} MAD</span>`;
  }

  function trackOrder(codeRaw) {
    const code = codeRaw.trim().toUpperCase();
    if (!code) return;

    if (!firebaseReady) {
      showMsg('Le suivi de commande n\'est pas encore configuré sur ce site. Contacte-nous directement pour connaître l\'état de ta commande.', true);
      return;
    }

    hideMsg();
    orderResult.classList.remove('show');

    if (unsubscribe) { unsubscribe(); unsubscribe = null; }

    unsubscribe = onSnapshot(doc(db, 'orders', code),
      (snap) => {
        if (!snap.exists()) {
          showMsg('Aucune commande trouvée avec ce code. Vérifie qu\'il est bien orthographié (ex: BB-7K4QXR).', true);
          orderResult.classList.remove('show');
          return;
        }
        hideMsg();
        renderOrder(code, snap.data());
      },
      (err) => {
        console.error('Erreur de suivi :', err);
        showMsg('Impossible de récupérer ta commande pour le moment. Réessaie dans un instant.', true);
      }
    );
  }

  trackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    trackOrder(trackCode.value);
  });

  // Arrive directement avec ?code=BB-XXXXXX (lien depuis la confirmation
  // de commande) -> pré-remplit et lance la recherche automatiquement.
  const urlCode = new URLSearchParams(window.location.search).get('code');
  if (urlCode) {
    trackCode.value = urlCode;
    trackOrder(urlCode);
  }
});
