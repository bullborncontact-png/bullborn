BULLBORN — Guide rapide (VS Code)
=================================

1. OUVRIR LE PROJET
--------------------
- Dézippe le dossier "bullborn" où tu veux sur ton ordinateur.
- Ouvre VS Code -> Fichier -> Ouvrir le dossier... -> sélectionne "bullborn".
- Double-clique sur index.html, puis clique droit -> "Open with Live Server"
  (installe l'extension gratuite "Live Server" si tu ne l'as pas) pour voir
  le site se mettre à jour en direct pendant que tu modifies le code.
  Sinon, tu peux juste double-cliquer sur index.html pour l'ouvrir dans ton
  navigateur.

Structure des fichiers :
  bullborn/
    index.html      -> page Accueil
    shop.html        -> page Shop (les 3 produits)
    contact.html      -> page Contact (formulaire)
    style.css         -> toutes les couleurs, polices, mises en page
    script.js         -> menu mobile, panier, formulaire
    images/
      logo.png         -> ton logo (déjà en place)
      placeholder.svg   -> image affichée tant qu'une vraie photo n'existe pas
      (ajoute ici : hoodie.jpg, debardeur.jpg, tshirt.jpg)


2. MODIFIER LES PRODUITS, PRIX ET IMAGES
-----------------------------------------
Tout se passe dans shop.html, dans les blocs <article class="product-card">.

Le Shop a maintenant des onglets "Tout / Homme / Femme" tout en haut de la
grille de produits. Chaque produit a un attribut data-category="homme" ou
data-category="femme" sur sa balise <article> — c'est ça qui décide dans
quel onglet il apparaît. Pour changer la catégorie d'un produit, change
juste cette valeur.

Les 2 produits femme sont déjà en place (Legging BULLBORN et T-shirt
BULLBORN Femme) avec des images de remplacement (images/legging-femme.jpg
et images/tshirt-femme.jpg) qui n'existent pas encore — le visuel "IMAGE
PRODUIT À AJOUTER" s'affiche à leur place tant que tu n'as pas ajouté ces
photos dans /images (mêmes noms de fichier).

Depuis la page d'accueil, les cartes "Femme" et "Homme" (section "Choisis
ton camp") renvoient maintenant directement vers le Shop déjà filtré sur
la bonne catégorie.

Pour un produit, tu peux changer :
  - Le nom      -> à l'intérieur de <h3>...</h3>
  - La description -> à l'intérieur de <p class="product-desc">...</p>
  - Le prix affiché -> à l'intérieur de <p class="product-price">...</p>
  - Le prix utilisé par le panier -> attribut data-price="450" du bouton
  - Le nom utilisé par le panier -> attribut data-name="Hoodie BULLBORN"
  - L'image -> attribut src="images/hoodie.jpg" de la balise <img>

Pour AJOUTER une image produit :
  1. Mets ta photo dans le dossier /images (idéalement carrée, ex: 800x800px).
  2. Renomme-la simplement, ex: hoodie.jpg, debardeur.jpg, tshirt.jpg
     (ce sont déjà les noms utilisés dans shop.html).
  3. Tant qu'une image n'existe pas, un visuel "IMAGE PRODUIT À AJOUTER"
     s'affiche automatiquement à sa place — rien ne casse.

Pour AJOUTER un 4e produit : copie/colle un bloc <article class="product-card">
entier (avec ses balises de fin </article>) et modifie son contenu.


3. MODIFIER LES TEXTES
------------------------
- Slogan de la page d'accueil -> dans index.html, texte dans
  <p class="hero-tagline">...</p>
- Titre principal -> <h1>BULLBORN</h1> dans index.html
- Présentation de la marque -> paragraphes dans <div class="brand-copy">
- Textes du pied de page -> répétés en bas de chaque fichier .html,
  dans <footer class="site-footer">


4. MODIFIER LES COULEURS
--------------------------
Ouvre style.css, tout en haut du fichier, dans le bloc ":root { ... }".
Change simplement les codes couleur (ex: --black: #0a0a0a;) — la couleur
se met à jour partout sur le site automatiquement, sur les 3 pages.


5. MODIFIER LES INFOS DE CONTACT
-----------------------------------
Dans contact.html, cherche le bloc <div class="contact-info"> :
change l'email, le téléphone, l'adresse et les horaires directement
dans le texte. Les mêmes infos apparaissent aussi dans le pied de page
de chaque page (<footer>), à modifier au même endroit sur chaque fichier.


6. LE FORMULAIRE DE CONTACT
------------------------------
Pour l'instant, cliquer sur "Envoyer" affiche juste un message de
confirmation à l'écran — aucun email n'est réellement envoyé.
Pour recevoir vraiment les messages par email sans backend, le plus
simple est un service gratuit comme Formspree (https://formspree.io) :
  1. Crée un compte et récupère ton URL de formulaire.
  2. Dans contact.html, remplace :
       <form id="contactForm" novalidate>
     par :
       <form id="contactForm" action="https://formspree.io/f/TON_ID" method="POST">
  3. Dans script.js, retire (ou commente) la ligne "e.preventDefault();"
     dans la fonction du formulaire pour laisser l'envoi se faire normalement.


7. LE PANIER
--------------
Le panier est simple et fonctionne sans base de données : il est stocké
dans le navigateur (localStorage), donc il reste rempli si tu changes de
page ou recharges le site. Il ne gère pas encore un vrai paiement — pour
une vraie boutique en ligne, il faudra le connecter à une solution comme
Shopify, Snipcart, Stripe Checkout, ou un backend personnalisé.


8. SUIVI DE COMMANDE (nouveau)
---------------------------------
Le site a une page "Suivi" (suivi.html) où le client tape son code pour
voir où en est sa commande : Commande confirmée / En préparation / En
livraison / Livrée — avec, si tu le fournis, un bouton vers une position
en direct sur Google Maps.

FONCTIONNEMENT : à chaque commande passée sur le site, un code à 6
caractères est créé automatiquement et affiché au client (+ envoyé dans
le message WhatsApp que tu reçois). Ce code ne change JAMAIS. Toi, tu vas
sur admin-suivi.html, tu vois la commande apparaître dans une liste, et tu
changes juste son étape — ça se met à jour tout de suite, en direct, sur
la page du client (il n'a rien à refaire).

Comme le site n'a pas de serveur à lui, ce suivi "en direct" a besoin d'un
petit service gratuit qui stocke juste ça (le code + l'étape + le lien de
position — jamais le nom complet, le téléphone ou l'adresse, qui restent
uniquement dans le message WhatsApp comme avant). Ce service s'appelle
Firebase (Google), et il est gratuit pour une boutique de cette taille.

MISE EN PLACE (une seule fois, ~5-10 min) :
  1. Va sur https://console.firebase.google.com et connecte-toi avec un
     compte Google. Clique "Ajouter un projet", donne-lui un nom (ex :
     bullborn), continue (tu peux désactiver Google Analytics, pas
     nécessaire), puis "Créer le projet".
  2. Dans le menu de gauche : "Firestore Database" -> "Créer une base de
     données" -> choisis une région proche (ex : eur3 / europe-west) ->
     démarre en "Mode test".
  3. Onglet "Règles" de Firestore, remplace tout le contenu par :

       rules_version = '2';
       service cloud.firestore {
         match /databases/{database}/documents {
           match /orders/{code} {
             allow read, write: if true;
           }
         }
       }

     puis clique "Publier". (Ces règles restent ouvertes pour rester
     simples à gérer sans compte client — c'est pour ça qu'on ne stocke
     jamais le téléphone ou l'adresse dans Firebase, seulement le code,
     l'étape et un éventuel lien de position.)
  4. Roue crantée (haut gauche) -> "Paramètres du projet" -> descends à
     "Vos applications" -> clique l'icône "</>" (Web) -> donne-lui un nom
     (ex : bullborn-web) -> "Enregistrer l'application". Un bloc de code
     s'affiche avec "firebaseConfig = { ... }".
  5. Ouvre le fichier firebase-config.js du site, et remplace les valeurs
     (apiKey, authDomain, projectId, etc.) par celles affichées à l'étape
     précédente. Enregistre.
  6. Recharge le site (Live Server) — c'est prêt. Passe une commande
     test pour vérifier que le code s'affiche bien, et qu'il apparaît
     dans admin-suivi.html.

UTILISATION AU QUOTIDIEN :
  - Ouvre admin-suivi.html (jamais dans le menu du site, ne la partage à
    personne) : tu y vois toutes les commandes récentes.
  - Change l'étape dans le menu déroulant, colle éventuellement un lien
    de position en direct (Google Maps -> appui long sur ta position ->
    "Partager" -> "Partager la position en direct" -> copier le lien),
    puis clique "Enregistrer".
  - Le client voit la mise à jour automatiquement sur sa page Suivi,
    toujours avec le même code.

Pour changer les textes des 4 étapes, ouvre tracking.js et modifie les
"label" tout en haut du fichier (le reste ne doit pas être touché).


C'est tout ! Le site fonctionne directement en ouvrant index.html,
aucune installation n'est nécessaire.
