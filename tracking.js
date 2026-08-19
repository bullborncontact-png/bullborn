/* =========================================================
   BULLBORN — tracking.js
   -----------------------------------------------------------
   Moteur du suivi de commande, branché sur Firebase Firestore
   (voir firebase-config.js). Le code généré à la commande ne
   change plus jamais : c'est TOI qui mets à jour son statut
   depuis admin-suivi.html, et ça se reflète automatiquement,
   en direct, sur la page suivi.html du client.
   Tu n'as normalement rien à modifier dans ce fichier.
   ========================================================= */

(function (global) {

  // Les 4 étapes du suivi. Pour changer les textes affichés,
  // modifie juste les "label" ci-dessous.
  const STEPS = [
    { key: 'confirmee',  label: 'Commande confirmée' },
    { key: 'emballage',  label: 'En préparation' },
    { key: 'livraison',  label: 'En livraison' },
    { key: 'livree',     label: 'Livrée' }
  ];

  function generateCode() {
    // Caractères sans ambiguïté à l'oral/à l'écrit (pas de 0/O, 1/I/L...)
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
  }

  function hasDb() {
    return !!global.db;
  }

  // Crée une commande dans Firestore et retourne son code (ou null si
  // Firebase n'est pas configuré / hors-ligne — la commande WhatsApp
  // part quand même, seul le suivi ne sera pas disponible).
  async function createOrder(note) {
    if (!hasDb()) return null;
    const code = generateCode();
    try {
      await global.db.collection('orders').doc(code).set({
        status: 0,
        mapsLink: '',
        note: note || '',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      return code;
    } catch (e) {
      console.warn('BULLBORN: création du suivi impossible.', e);
      return null;
    }
  }

  // Écoute en direct le statut d'une commande.
  // callback reçoit soit les données {status, mapsLink, note}, soit
  // null (code inconnu), soit undefined (Firebase pas configuré).
  function watchOrder(code, callback) {
    if (!hasDb()) { callback(undefined); return function unsubscribe() {}; }
    const clean = (code || '').trim().toUpperCase();
    if (!clean) { callback(null); return function unsubscribe() {}; }
    return global.db.collection('orders').doc(clean).onSnapshot(
      (doc) => callback(doc.exists ? doc.data() : null),
      () => callback(null)
    );
  }

  // Écoute en direct la liste des commandes récentes (admin-suivi.html)
  function watchOrders(callback) {
    if (!hasDb()) { callback(undefined); return function unsubscribe() {}; }
    return global.db.collection('orders').orderBy('createdAt', 'desc').limit(50).onSnapshot(
      (snap) => {
        const orders = [];
        snap.forEach((doc) => orders.push(Object.assign({ code: doc.id }, doc.data())));
        callback(orders);
      },
      () => callback(null)
    );
  }

  // Met à jour le statut / lien de position d'une commande existante.
  function updateOrder(code, status, mapsLink) {
    if (!hasDb()) return Promise.reject(new Error('Firebase non configuré'));
    return global.db.collection('orders').doc(code).update({
      status: status,
      mapsLink: mapsLink || ''
    });
  }

  global.BullbornTracking = { STEPS, createOrder, watchOrder, watchOrders, updateOrder };

})(window);
