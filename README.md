Développement d’une plateforme à base de Python/Flask et PostgreSQL
permettant aux ingénieurs de l’entreprise de se connecter,
d’importer/exporter/afficher et modifier des fichiers Excel ou texte, selon les
contraintes de la norme MIL-STD-1388 du Soutien Logistique Intégré. 





CONCEPTION ET DEVELOPPEMENT DE L’OUTIL DE GESTION DE DONNEES DU SOUTIEN LOGISTIQUE INTEGRE ‘‘SMART-LI’’


Nom de la société : SOM Ligeron
Adresse du site : 160 Avenue Aristide Briand, 92220 Bagneux
Maître de stage : Michel BACHELET 
Période de stage : du 03/04/2023 au 31/08/2023
 
	
 

Table des matières
1.	Introduction	4

3.	SLI/SDF	8
2.4.	Définitions	8
2.4.1.	Le Soutien Logistique Intégré	8
2.4.2.	Sureté de fonctionnement	8
2.5.	Historique du SLI	8
2.6.	problématiques du SLI	9
4.	Présentation de l'outil Smart-LI 1.0 : Fonctionnalités	9
5.	Travail réalisé pour la version Smart-LI 2.0	9
2.7.	Norme MIL-STD-1388-2B	10
2.7.1.	BDD et Création des Tables	10
2.7.2.	API et Interface Graphique	10
2.7.3.	Options 1388	11
6.	Ce qui reste à réAliser	11

 
1.	INTRODUCTION
SOM Ligeron est une entreprise spécialisée dans plusieurs domaines de l'ingénierie système, notamment l'ingénierie de maintenance. Son savoir-faire et son excellence technique lui ont permis d’être reconnu par les plus grands acteurs industriels, comme l’un des leaders de maitrise des risques, notamment la sûreté de fonctionnement, le SLI et l'ingénierie système, dans de nombreux domaines tels que l’automobile, le ferroviaire, l’aéronautique, le spatial, la défense ou encore le nucléaire. 
Dans le cadre du soutien logistique intégré, les clients et les ingénieurs de l’entreprise sont amenés à manipuler des données de masse relatives à la maintenance des systèmes. Ainsi le  besoin de développer un outil numérique innovant pour normaliser et faciliter la gestion des fichiers des études de Soutien Logistique Intégré (SLI) s’est imposé.
En 2020, l'entreprise a développé la première version de son outil de gestion des données, appelé "Smart-LI". Cette version initiale du logiciel a été développée sous le système de gestion de données local "Microsoft Access" et a connu un grand succès grâce aux différentes fonctionnalités qu’elle offre aux utilisateurs. Cependant, cette version du logiciel présente certaines limitations en termes de performances, car elle dépend de la base de données locale du logiciel Access . Ces inconvénients ont  encouragé la société à lancer un projet visant à développer une version web de l'outil, appelé "Smart-LI 2.0"  basée sur un système de gestion de base de données utilisant le langage SQL. L’objectif étant de rendre  le logiciel plus robuste, facile à utiliser et accessible aux collaborateurs et clients du groupe ORTEC.
Au sein de l'entreprise SOM Ligeron, j'ai eu l'opportunité de travailler sur le projet de développement de la version "Smart-LI 2.0", qui implique la création d'une application web hébergée sur un serveur et connectée à une base de données SQL. Ce stage est une expérience passionnante, me permettant de mettre en pratique mes compétences en développement informatique et d'acquérir une expérience technique et professionnelle précieuse.
En travaillant sur ce projet, j'approfondis mes connaissances en langages de programmation tels que Python, HTML et JavaScript, ainsi que l’utilisation de frameworks et bibliothèques puissantes comme Flask et Fetch. J'ai également l'occasion de développer mes compétences en matière de conception de bases de données et de requêtes SQL, renforçant ainsi mon expertise en gestion de base de données.
Au-delà des aspects techniques, ce stage me permet également de développer des compétences en gestion de projet : j'ai l'occasion de collaborer avec un groupe d’étudiants ingénieurs en informatique et ainsi j’apprends à travailler en équipe, à communiquer efficacement avec les parties prenantes, à gérer les délais et les priorités du projet.
Dans la suite de ce rapport, je présenterai en détail les différentes étapes du projet, les défis rencontrés et les solutions mises en place. Je partagerai également les enseignements tirés de cette expérience et les perspectives d'évolution que j'envisage dans le domaine du développement de logiciels web.
 
 
3.	 SLI/SDF
3.1.	DEFINITIONS
3.1.1.	Le Soutien Logistique Intégré
Le soutien logistique intégré (SLI) est un ensemble coordonné et itératif d'activités de gestion et d'activités techniques visant  à traiter tout ce qui concerne la conception, la disponibilité et la maintenance d’un équipement durant tout son cycle de vie. Les activités prises en compte dans le soutien logistique intégré sont généralement les plans de maintenance, le personnel et leurs compétences, le soutien à l’informatique, la documentation technique, les équipements de tests, les rechanges, les infrastructures… 
3.1.2.	Sureté de fonctionnement 
Le secteur d'études de la sûreté de fonctionnement, également connu sous le nom de fiabilité, sécurité et maintenabilité, est une discipline qui se concentre sur la garantie de la performance, de la sécurité et de la disponibilité des systèmes complexes.
3.2.	HISTORIQUE DU SLI
•	1970 : Réflexion des organismes gouvernementaux américains pour maîtriser les coûts d’utilisation des systèmes
•	1973 : Premiers standards normatifs sur le SLI
•	1981 : Prise en compte progressive des standards US sur le SLI en Europe
•	1991 : Application "maîtrisée" des processus liés au SLI






 
3.3.	PROBLEMATIQUES DU SLI 
L'une des problématiques clés du SLI est la gestion d’un grand nombre de données. Les systèmes modernes sont de plus en plus complexes, ce qui génère une quantité importante de données liées au soutien logistique , telles que les données de maintenance, de réparation, de pièces de rechange, de documentation technique, etc. 
Un outil numérique de gestion de données SLI facilitera le stockage, l'organisation, la recherche et l'analyse de ces données, permettant ainsi aux équipes de SLI de prendre des décisions éclairées et de gérer efficacement le soutien logistique.
Le SLI impose des formats spécifiques pour ces données régies par deux normes ‘’MIL-STD-1388-2B’’ et ‘’S3000L’’, ces sont des références largement utilisées dans le domaine du soutien logistique, permette la cohérence et la simplification des échanges de données avec d'autres systèmes ou partenaires qui travaillent sur le même projet. Le respect de ces deux normes est une préoccupation importante du SLI, et impose l’utilisation des types de fichiers spécifiques comme texte et XML. Afin d’assurer l’intégrité de la base de données et le respect des normes il est nécessaire d’utiliser un logiciel adéquat 
4.	PRESENTATION DE L'OUTIL SMART-LI 1.0 : FONCTIONNALITES ET LIMITES
-	3 modules de Smart-LI
-	Limites
	
 
5.	TRAVAIL REALISE POUR LA VERSION SMART-LI 2.0
5.1.	NORME MIL-STD-1388-2B
5.1.1.	BDD et Création des Tables

5.1.1.1.	Choix du SGBD : 
Avant le début de mon stage, le groupe d'étudiants ingénieurs a décidé d'utiliser le SGBD "PostgreSQL" plutôt que "MySQL" car il utilise des techniques telles que le parallélisme des requêtes, l'optimisation des requêtes, etc. pour optimiser le temps d'exécution des requêtes SQL. De plus, PostgreSQL est conçu pour gérer des charges de travail élevées et des volumes de données importants.,   ceSes caractéristiques en font qui en fait le meilleur choix pour un tel projet de gestion de données massives comme "Smart-LI".

5.1.1.2.	Création des tables et des contraintes de la norme 1388 :
La norme MIL-STD-1388 2B, définie un ensemble de 104 tables interconnectées entre elles à l’aide de clés primaires et de clés étrangères. Pour créer ces tables avec toutes les contraintes nécessaires, nous avons utilisé un code Python générant un fichier SQL contenant toutes les requêtes requises pour la création de cette base de données. Ce code Python lit les données à partir de deux sources : un fichier Excel contenant les colonnes de chaque table et leurs contraintes, et un fichier texte contenant les liens entre les différentes tables. Le programme utilise la bibliothèque ‘’Pandas’’ pour lire le fichier Excel et convertir les données en un DataFrame ou une structure de données tabulaire. Puis, le code parcouru cette structure de données pour générer les requêtes de création des tables. Ensuite, le programme lit le fichier texte ligne par ligne et organise les informations dans des dictionnaires imbriqués afin de générer les requêtes SQL pour définir les clés étrangères de chaque table. Finalement, enregistre les requêtes dans le fichier SQL.

5.1.2.	API et Interface Graphique
Pour assurer la continuité du développement du logiciel, et pour garantir son déploiement du sur le serveur web de d’entreprise, j’ai privilégié l’utilisation d’un code de programmation standard. Donc, j’ai utilisé HTML/CSS pour le front-end de l’interface graphique et JavaScript pour le back-end. J’ai employé Python pour le développement des fonctions de l’API et le framework Flask pour assurer la communication entre l’IHM et l’API du logiciel.




5.1.2.1.	API
Dans le but de créer une application web dynamique et interactive où les données peuvent être récupérées et mises à jour en temps réel sans avoir à recharger complètement la page, j’ai opté pour l'utilisation conjointe du module Fetch côté IHM et du framework Flask côté serveur. Cela a permis de créer une communication fluide entre le navigateur web et le serveur du logiciel. Les fonctions JavaScript peuvent envoyer des requêtes via Fetch vers les routes Flask, en incluant des données et des informations spécifiques au format JSON dans la requête HTTPS. Les fonctions Python de Flask peuvent ensuite traiter ces requêtes, effectuer les opérations appropriées et renvoyer les résultats attendus au format JSON également. Ainsi, l'utilisation de Python a facilité la gestion de la base de données PostgreSQL grâce à la bibliothèque 'psycopg2'. Car j'ai pu établir facilement une connexion à ma base de données PostgreSQL depuis le code Python. J'ai pu exécuter des requêtes SQL complexes, insérer, mettre à jour et supprimer des données, créer et gérer les profils utilisateurs, ainsi que récupérer des informations sur les caractéristiques des tables et obtenir les résultats de l’exécution des requêtes SQL de manière fiable et rapide. 

5.1.2.2.	Interface Graphique
Jusqu’à maintenant, 5 pages constituent l’interface graphique de l’outil Smart-LI 2.0 :
1)	Page de connexion/inscription
Cette page est conçue pour permettre à l’utilisateur à la fois de créer un nouveau compte utilisateur et de se connecter au logiciel. 

En positionnant le bloc de connexion/inscription de manière relative au centre de la moitié droite de l'écran, avec une largeur fixe de 380px, et en ajustant la position horizontale des formulaires de connexion et d'inscription, j'ai pu contrôler l'affichage des champs de saisie en appliquant une translation horizontale à leur position. De plus, j'ai utilisé la propriété CSS "overflow: hidden" pour cacher tout contenu dépassant la limite du bloc dédié, assurant ainsi un affichage propre et esthétique.

2)	Page d’affichage des projets enregistrés
Cette page permet à l’utilisateur d’afficher tous les projets enregistrés dans son répertoire. Elle permet également soit de créer un nouveau projet en cliquant sur le bouton plus, qui affichera une boite de dialogue pour entrer le nom du nouveau projet, soit de supprimer un projet en clique sur la croix qui s’affiche lorsqu’on survol le nom d’un projet.
Le bloc de chaque projet ressemble à un bouton qui emmène directement vers la page des options dédié au projet sélectionner.
 
La balise HTML contenant les nom des projets est initialement vide, et lorsqu’on charge la page, une fonction Javascript utilise la méthode ‘’Fetch’’ pour envoyer une requête à l’API du logiciel pour récupérer les nom des projets sous forme d’une liste JSON. Ensuite, pour chaque nom dans la liste,  la fonction JavaScript créer un élément ‘’bouton’’ contenant le nom du projet et l’associe avec une autre fonction qui sera exécuter en cas du clic sur le bouton. Finalement, elle l’ajoute dans la balise HTML.
Le style associé à conteneur HTML est définie avec une disposition flex, permettant aux boutons d'être placés horizontalement et de s'enrouler sur plusieurs lignes si nécessaire. Cela grâce aux trois commandes CSS suivantes :    display: flex 	flex-wrap: wrap	justify-content: flex-start;  
"justify-content: flex-start;" placera les éléments fils sur le côté gauche du conteneur, en laissant de l'espace vide à droite s'il y a de l'espace supplémentaire.
3)	Page pour le choix du module
Cette page permet à l’utilisateur de choisir la norme du projet 
 
Chaque image est reliée avec une fonction Javascript différente qui créer les tables de la base de données selon la norme choisie.
Jusqu’à maintenant, seul le module 1388 est opérationnel.
 
4)	Page des options de la norme 1388
Cette page contient quatre options du module 1388
 





5)	Page pour l’affichage et la modification de la BDD

5.1.3.	Options 1388

5.1.3.1.	IMPORT/EXPORT du DUMP
5.1.3.2.	AFFICHAGE/MODIFICATION des données

6.	CE QUI RESTE A REALISER 
Module 1388 :
-	Ajouter la fonctionnalité de génération des fichiers de vérification de cohérence et de formalisme pour les données de la norme 1388.
Module S3000L : 
-	Développer une base de données S3000L configurable.
-	Importer et exporter des données au format S3000L (Excel et XML).
Serveur : 
-	Héberger le logiciel et la base de données sur le serveur du groupe ORTEC.
-	Lier le logiciel avec le système de gestion d’utilisateur du serveur.
