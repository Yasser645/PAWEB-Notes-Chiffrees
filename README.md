
# Projet PAWEB - Gestionnaire de notes chiffrées

## 1. Présentation

Ce projet est une application en ligne de commande (CLI)
développée avec Node.js.

Elle permet de gérer des notes personnelles et de les
protéger avec l'algorithme de chiffrement AES-256-GCM.

Les notes sont enregistrées dans un fichier local nommé
notes.enc. Aucune API Web n'est utilisée.

## 2. Outils utilisés

- JavaScript
- Node.js
- Visual Studio Code
- Module fs : gestion des fichiers
- Module crypto : chiffrement et déchiffrement
- Module readline : saisie dans le terminal

## 3. Structure du projet

Projet PAWEB/
- app.js : programme principal
- notes.enc : fichier contenant les notes chiffrées
- README.md : explication du projet

Le fichier notes.enc est créé automatiquement lors
du premier enregistrement.

## 4. Exécution

Ouvrir le terminal dans le dossier du projet.

Vérifier que Node.js est installé :

    node -v

Afficher les commandes disponibles :

    node app.js help

## 5. Commandes disponibles

Ajouter une note :

    node app.js add

Afficher les notes :

    node app.js list

Rechercher une note :

    node app.js search

Consulter une note :

    node app.js read 1

Supprimer une note :

    node app.js delete 1

Le nombre 1 représente l'identifiant de la note.

## 6. Sécurité des données

Le programme utilise AES-256-GCM pour chiffrer les notes.

Lors de l'enregistrement, les données sont chiffrées
avant d'être écrites dans notes.enc.

Pour consulter les notes, l'utilisateur doit saisir
le même mot de passe.

Si le mot de passe est incorrect, le programme
refuse le déchiffrement.

## 7. Conclusion

Ce projet nous a permis d'apprendre à utiliser Node.js,
à manipuler les fichiers et à protéger des données
avec un algorithme de chiffrement.

## Réalisé par

Yasser MOUSSAOUI et Youcef KHADIR

L3 ISIL - Groupe 6

Module : PAWEB

Année universitaire : 2026/2027
