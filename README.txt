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


8. LE SUIVI DE COMMANDE (code + statut + GPS livreur)
--------------------------------------------------------
Le site a maintenant 3 nouvelles pages :

  suivi.html   -> le client entre son code (ex: BB-4F7K2Q) et voit
                  où en est sa commande, avec une carte GPS en
                  direct pendant l'étape "En livraison"
  livreur.html -> page interne (protégée par mot de passe) : le
                  livreur entre le code de la commande, clique
                  "Démarrer la livraison" -> son téléphone envoie
                  sa position en direct pendant qu'il roule, puis
                  "Marquer comme livrée" à l'arrivée
  admin.html   -> page interne (protégée par mot de passe) : liste
                  toutes les commandes, permet de faire passer une
                  commande "Reçue" -> "En préparation"

Le parcours d'une commande : Reçue -> En préparation (toi, sur
admin.html) -> En livraison + GPS (le livreur, sur livreur.html) ->
Livrée (le livreur, sur livreur.html).

Quand un client valide sa commande sur le site, un code de suivi
est généré automatiquement et affiché à l'écran (+ inclus dans le
message WhatsApp que tu reçois). Le client garde ce code pour
suivre sa commande sur suivi.html.

ACTIVER LE SUIVI (obligatoire, sinon ces 3 pages restent inactives) :
Tout passe par UN SEUL fichier à remplir : firebase-config.js.
Ouvre ce fichier, les instructions complètes (créer un compte
Firebase gratuit, récupérer la config, la coller) sont écrites en
commentaire tout en haut. Ça prend environ 5 minutes, aucune carte
bancaire nécessaire (plan gratuit "Spark").

MOTS DE PASSE ÉQUIPE (livreur.html et admin.html) :
Par défaut :
  - livreur.html -> bullborn2026
  - admin.html   -> bullbornadmin2026
Pour les changer, ouvre le fichier et cherche la ligne
"const DRIVER_PASSWORD" (dans livreur.html) ou
"const ADMIN_PASSWORD" (dans admin.html), et remplace la valeur.
Attention : c'est un mot de passe simple côté navigateur, pas une
vraie sécurité (il est visible dans le code source de la page) —
ça évite juste qu'un client tombe dessus par hasard. Pour une vraie
protection de ces 2 pages, il faudrait ajouter l'authentification
Firebase (peut être ajouté plus tard si besoin).

LE LIVREUR DOIT AUTORISER LA GÉOLOCALISATION :
Sur livreur.html, au clic sur "Démarrer la livraison", le
navigateur du téléphone du livreur va demander l'autorisation
d'accéder à sa position — il faut accepter. Ça ne fonctionne que
sur une connexion sécurisée (https://), donc une fois le site
mis en ligne (pas juste ouvert en local sur ton ordinateur).


C'est tout ! Le site fonctionne directement en ouvrant index.html,
aucune installation n'est nécessaire (le suivi de commande demande
en plus les 5 minutes de configuration Firebase décrites ci-dessus).
