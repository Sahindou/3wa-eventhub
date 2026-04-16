# Travail à réaliser

Vous allez commencer à développer la partie frontend de eventhub et vous présenterez quelques features en soutenance.

Vous allez mettre en place les interfaces graphiques suivantes :

- Le formulaire de connexion
- Le formulaire d'inscription
- La page profil

Vous mettrez en place tous les tests unitaires qui vous semblent opportun pour ces pages sachant que :

1) Le formulaire d'inscription ne peut être soumis tant que tous les champs ne sont pas remplis.

2) Le mot de passe choisi par l'utilisateur doit respecter certains critères :

    La longueur doit être de 12
    Au moins une majuscule
    Au moins une minuscule
    Au moins un chiffre
    Au moins un caractère spécial

3) La page profil doit permettre un update des données.

Présentation de la Feature "Gestion des Utilisateurs" - EventHub

Durée totale : 15 minutes
Slide 1 : Page de titre (30 sec)

Slide 2 : Objectifs de la feature (1 min)

Contenu :

    Rappel du contexte
    Objectifs de la feature Gestion des Utilisateurs :
        Inscription d'un nouvel utilisateur
        Connexion d'un utilisateur existant
        Formulaire de profil
    Technologies utilisées : React, TypeScript

Slide 3 : Architecture du projet (1 min 30)

Contenu :

    Schéma de l'architecture en couches
    Organisation Frontend : components/, hooks/, services/
    Justification des choix architecturaux

Slide 4 : Application des principes SOLID (1 min 30)

Contenu :

    Pour chaque principe appliqué, donner un exemple concret :
    Montrer 1 extrait de code pertinent

Slide 5 : Frontend - Composants React (1 min 30)

Contenu :

    Composant d'inscription : formulaire avec validation
    Composant de connexion : formulaire et redirection
    Gestion des états (loading, error, success)
    Captures d'écran de l'interface

Slide 6 : Frontend - Custom Hooks (Presenters) (1 min)

Contenu :

    Séparation logique métier / UI
    Exemple de custom hook
    Explications des avantages 
    Extrait de code

Slide 7 : Tests unitaires (1 min)

Contenu :

    Tests Frontend : tests des composants
    Explication de plusieurs tests
    Résultat des tests (capture d'écran ✅)

Slide 8 : Démonstration en direct (3 min)

Contenu :

    Lancer l'application en local
    Démonstration live :
        Affichage du formulaire de connexion + interaction
        Affichage d'un message d'erreur
        Affichage du formulaire de création de compte + interaction (exemple : bouton actif que quand le formulaire est bien rempli)

Slide 9 : Difficultés et solutions (1 min)

Contenu :

    2 problèmes rencontrés et solutions appliquées
    Apprentissages clés de la semaine

Slide 10 : Conclusion (30 sec )

---
