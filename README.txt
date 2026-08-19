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
    index.html          -> page Accueil
    shop.html           -> page Shop (les produits)
    contact.html        -> page Contact (formulaire)
    suivi.html           -> page Suivi de commande (côté client)
    livreur.html          -> page interne pour mettre à jour les commandes
    style.css             -> toutes les couleurs, polices, mises en page
    script.js               -> menu mobile, panier, formulaire, création du code de suivi
    suivi.js                 -> logique de la page suivi.html
    livreur.js                -> logique de la page livreur.html (connexion + statuts)
    firebase-config.js         -> connexion à ta base de données Firebase (voir section 8)
    firestore.rules.txt         -> règles de sécurité à coller dans Firebase
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
----------------------------------
Le site a maintenant un vrai suivi de commande :

  - Quand un client valide sa commande (modal "Passer la commande"),
    il reçoit un CODE (ex: BB-7K4QXR) affiché à l'écran, avec un
    bouton "Suivre ma commande".
  - Le client peut revenir à tout moment sur suivi.html, entrer son
    code, et voir où en est sa commande : Confirmée -> Emballage ->
    En livraison -> Livrée. La page se met à jour toute seule, sans
    recharger, dès que le statut change.
  - Toi (ou la personne qui gère les livraisons) te connectes sur
    livreur.html avec un email/mot de passe, tu vois la liste de
    toutes les commandes, et tu cliques sur l'étape correspondante
    pour la faire avancer.

  ⚠️ ÉTAPE OBLIGATOIRE avant que ça fonctionne :
  Ce suivi utilise Firebase (service gratuit de Google) comme base
  de données partagée entre le site, le client et le livreur. Sans
  ça, le panier/WhatsApp continuent de marcher normalement, mais le
  suivi de commande restera vide.

  Marche à suivre (5-10 min, gratuit) :
    1. Va sur https://console.firebase.google.com et crée un projet.
    2. Active "Firestore Database" (mode production, région proche).
    3. Active "Authentication" -> méthode "E-mail/Mot de passe" ->
       crée un utilisateur (l'email/mot de passe que la personne qui
       gère les livraisons utilisera pour se connecter à livreur.html).
    4. Dans "Paramètres du projet" -> "Vos applications" -> ajoute une
       application Web -> copie les valeurs affichées (apiKey,
       authDomain, etc.) dans le fichier firebase-config.js, à la
       place de "REMPLACE_MOI".
    5. Dans Firestore -> onglet "Règles" -> colle le contenu du
       fichier firestore.rules.txt (fourni) -> Publier.

  Toutes les explications détaillées sont aussi en commentaire tout
  en haut du fichier firebase-config.js.

  À SAVOIR : la page livreur.html n'est protégée que par la
  connexion (email/mot de passe) — évite de partager son lien
  publiquement, même si elle n'apparaît dans aucun menu public.

  PROCHAINE ÉTAPE (pas encore incluse) : le suivi GPS en direct du
  livreur pendant la livraison. La structure actuelle (Firebase) est
  prête à l'accueillir plus tard — il suffira d'ajouter la position
  du livreur au document de la commande et de l'afficher sur une
  carte dans suivi.html.


C'est tout ! Le site fonctionne directement en ouvrant index.html,
aucune installation n'est nécessaire (à part la configuration
Firebase ci-dessus, pour le suivi de commande).
