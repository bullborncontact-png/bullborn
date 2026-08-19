/* =========================================================
   BULLBORN — firebase-config.js
   -----------------------------------------------------------
   Remplace les valeurs ci-dessous par CELLES DE TON PROJET
   Firebase (gratuit, ~5 minutes à créer). Marche à suivre
   complète : README.txt, section 8.
   Tant que ce n'est pas rempli, le site fonctionne normalement
   mais le suivi de commande reste inactif (pas d'erreur, pas
   de blocage des commandes).
   ========================================================= */
const firebaseConfig = {
  apiKey: "AIzaSyB37IY26RQLCwYFB4U_biSI7FslS1GuWSA",
  authDomain: "bullborn-f7192.firebaseapp.com",
  databaseURL: "https://bullborn-f7192-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bullborn-f7192",
  storageBucket: "bullborn-f7192.firebasestorage.app",
  messagingSenderId: "610156006264",
  appId: "1:610156006264:web:88a18de4a6802be60f168d",
  measurementId: "G-VYZEEWQWV3"
};

try {
  firebase.initializeApp(firebaseConfig);
  window.db = firebase.firestore();
} catch (e) {
  console.warn('BULLBORN: Firebase non configuré — le suivi de commande est désactivé.', e);
  window.db = null;
}
