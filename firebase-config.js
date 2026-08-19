/* =========================================================
   BULLBORN — firebase-config.js
   -----------------------------------------------------------
   Ce fichier connecte le site à ton projet Firebase (gratuit),
   qui sert de base de données partagée entre :
     - le site (création de commande au checkout)
     - suivi.html (le client suit sa commande avec son code)
     - livreur.html (le staff met à jour le statut)

   👉 COMMENT OBTENIR TES VALEURS (5 min, gratuit) :
     1. Va sur https://console.firebase.google.com
     2. "Ajouter un projet" -> donne-lui un nom (ex: bullborn) -> crée-le
     3. Dans le menu de gauche : "Compilation" -> "Firestore Database"
        -> "Créer une base de données" -> mode production -> choisis
        une région proche (ex: europe-west1) -> Activer
     4. Toujours dans le menu de gauche : "Compilation" -> "Authentication"
        -> onglet "Sign-in method" -> active "E-mail/Mot de passe"
        -> onglet "Users" -> "Ajouter un utilisateur" : crée le compte
        que le livreur/staff utilisera pour se connecter sur livreur.html
     5. Clique sur la roue crantée en haut à gauche -> "Paramètres du
        projet" -> descends jusqu'à "Vos applications" -> clique sur
        l'icône "</>" (Web) -> donne un nom -> "Enregistrer l'application"
        Firebase t'affiche un objet firebaseConfig : copie chaque valeur
        ci-dessous, à la place de "REMPLACE_MOI".
     6. Dans Firestore -> onglet "Règles", colle le contenu du fichier
        firestore.rules.txt fourni avec ce projet, puis "Publier".

   Tant que ce fichier n'est pas rempli, le suivi de commande ne
   fonctionnera pas, mais le reste du site (panier, WhatsApp, contact)
   continue de marcher normalement.
   ========================================================= */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "REMPLACE_MOI",
  authDomain: "REMPLACE_MOI.firebaseapp.com",
  projectId: "REMPLACE_MOI",
  storageBucket: "REMPLACE_MOI.appspot.com",
  messagingSenderId: "REMPLACE_MOI",
  appId: "REMPLACE_MOI"
};

export const firebaseReady = !Object.values(firebaseConfig).some(v => v.startsWith("REMPLACE_MOI"));

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
