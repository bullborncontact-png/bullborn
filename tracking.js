/* =========================================================
   BULLBORN — tracking.js
   -----------------------------------------------------------
   Moteur du système de suivi de commande.
   Comme le site n'a pas de base de données, le statut d'une
   commande (étape + lien Google Maps) est encodé directement
   DANS le code que tu envoies au client — pas besoin de
   serveur. C'est toi qui génères ce code sur admin-suivi.html,
   et le client le colle (ou clique le lien) sur suivi.html.
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

  function toBase64Url(str) {
    const b64 = btoa(unescape(encodeURIComponent(str)));
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function fromBase64Url(code) {
    let b64 = code.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    return decodeURIComponent(escape(atob(b64)));
  }

  // data = { status: 0-3, mapsLink: 'https://...' (optionnel) }
  function encodeTracking(data) {
    const payload = {
      v: 1,
      s: data.status,
      m: data.mapsLink || ''
    };
    return toBase64Url(JSON.stringify(payload));
  }

  // Retourne { status, mapsLink } ou null si le code est invalide.
  function decodeTracking(code) {
    try {
      const clean = (code || '').trim();
      if (!clean) return null;
      const json = fromBase64Url(clean);
      const data = JSON.parse(json);
      if (typeof data.s !== 'number' || data.s < 0 || data.s > STEPS.length - 1) return null;
      return { status: data.s, mapsLink: data.m || '' };
    } catch (e) {
      return null;
    }
  }

  global.BullbornTracking = { STEPS, encodeTracking, decodeTracking };

})(window);
