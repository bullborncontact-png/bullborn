/* =========================================================
   BULLBORN — Configuration Firebase (suivi de commande GPS)
   -----------------------------------------------------------
   C'est le SEUL fichier à modifier pour activer le suivi de
   commande en direct. Sans ça, le reste du site fonctionne
   normalement, mais le suivi/livreur/admin resteront inactifs.

   COMMENT L'OBTENIR (gratuit, 5 minutes) :
   1. Va sur https://console.firebase.google.com
   2. Connecte-toi avec un compte Google, clique "Ajouter un projet"
      -> donne-lui un nom (ex: bullborn) -> crée-le (plan gratuit
      "Spark", pas besoin de carte bancaire).
   3. Dans le menu de gauche : Build -> Realtime Database
      -> "Créer une base de données" -> choisis une région proche
      (ex: europe-west1) -> démarre en "Mode test" (accès ouvert
      30 jours ; voir la note sécurité plus bas).
   4. Retourne à l'accueil du projet (icône maison) -> clique
      l'icône Web "</>" -> donne un surnom à l'appli -> "Enregistrer
      l'application". Firebase affiche un bloc "firebaseConfig" :
      copie CHAQUE valeur ci-dessous à la place de "REMPLACE_MOI".
   5. Enregistre ce fichier et remets-le dans le dossier bullborn/,
      à côté de index.html.

   SÉCURITÉ (important) :
   Le "Mode test" de Firebase autorise tout le monde à lire/écrire
   dans la base pendant 30 jours -> pratique pour tester tout de
   suite, mais à resserrer avant un vrai lancement public. Dans
   Realtime Database -> onglet "Règles", remplace par quelque
   chose comme :
     {
       "rules": {
         "orders": {
           ".read": true,
           ".write": true
         }
       }
     }
   Pour une vraie protection (empêcher n'importe qui de modifier
   les statuts), il faudrait ajouter l'authentification Firebase
   pour livreur.html et admin.html — dis-le moi si tu veux qu'on
   ajoute cette étape ensuite.
   ========================================================= */

const firebaseConfig = {
  apiKey: "REMPLACE_MOI",
  authDomain: "REMPLACE_MOI.firebaseapp.com",
  databaseURL: "https://REMPLACE_MOI-default-rtdb.firebaseio.com",
  projectId: "REMPLACE_MOI",
  storageBucket: "REMPLACE_MOI.appspot.com",
  messagingSenderId: "REMPLACE_MOI",
  appId: "REMPLACE_MOI"
};

if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "REMPLACE_MOI") {
  console.warn(
    "BULLBORN: Firebase n'est pas encore configuré (firebase-config.js). " +
    "Le suivi de commande / livreur / admin ne fonctionneront pas tant " +
    "que la config n'est pas remplie. Voir les instructions en haut de ce fichier."
  );
} else if (typeof firebase !== "undefined") {
  firebase.initializeApp(firebaseConfig);
}
