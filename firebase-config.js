/* =========================================================
   BULLBORN  firebase-config.js
   -----------------------------------------------------------
   Ce fichier connecte le site à ta base de données Firebase
   (gratuite) pour enregistrer les commandes et pouvoir les
   suivre depuis admin.html.

   COMMENT LE REMPLIR (5 minutes, gratuit) :
   1. Va sur https://console.firebase.google.com
   2. Clique "Ajouter un projet" -> donne-lui un nom (ex: bullborn)
      -> tu peux désactiver Google Analytics, pas nécessaire.
   3. Une fois le projet créé, dans le menu de gauche va sur
      "Realtime Database" -> "Créer une base de données"
      -> choisis une région -> démarre en "mode test"
      (ça permet au site de lire/écrire sans backend).
   4. Toujours dans le menu de gauche, clique sur la roue
      dentée (Paramètres du projet) -> tout en bas dans
      "Vos applications", clique l'icône Web "</>" -> donne
      un nom -> "Enregistrer l'application".
   5. Firebase t'affiche un bloc de config comme celui-ci :
        const firebaseConfig = {
          apiKey: "...",
          authDomain: "...",
          databaseURL: "...",
          projectId: "...",
          ...
        };
   6. Copie CES VALEURS et colle-les ci-dessous, à la place
      des valeurs "A_REMPLIR".

   IMPORTANT — Sécurité de la base de données :
   Le "mode test" laisse la base ouverte en lecture/écriture à
   tout le monde pendant 30 jours, puis elle se bloque. Avant
   que ça arrive (ou dès maintenant), va dans Realtime Database
   -> onglet "Règles" et remplace par :
     {
       "rules": {
         "commandes": {
           ".read": true,
           ".write": true
         }
       }
     }
   C'est volontairement simple (pas de vrai compte admin) pour
   rester gratuit et sans backend  largement suffisant pour
   une boutique qui demarre. Le mot de passe de admin.html
   protege l'acces a la page, mais pas la base elle-meme.
   ========================================================= */

const firebaseConfig = {
  apiKey: "AIzaSyB37IY26RQLCwYFB4U_biSI7FslS1GuWSA",
  authDomain: "bullborn-f7192.firebaseapp.com",
  databaseURL: "https://bullborn-f7192-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bullborn-f7192",
  storageBucket: "bullborn-f7192.firebasestorage.app",
  messagingSenderId: "610156006264",
  appId: "1:610156006264:web:01a13091d3b719100f168d",
  measurementId: "G-2TBS7JZFTC"
};