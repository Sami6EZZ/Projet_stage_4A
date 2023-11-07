from flask import Blueprint, jsonify, request
import psycopg2
import os
from UAPI_Blueprint.pattern_factory import requeteFactory_nouveauSchema
from UAPI_Blueprint.pattern_factory import ReqeteFctory_connexionSchema
from UAPI_Blueprint.json_web_token import jeton_existe


route_gen_shema_et_tables_1388 = Blueprint("F_shema_et_tables_1388", __name__)

# fonction appellée par la route de géneration des schemas pour créer les tables de la norme 1388
def generate_1388(connexion,nom_schema):

    connexion.autocommit = True       
    cursor = connexion.cursor()

    with open(os.path.join('requetes_sql','ddl1388.sql'), 'r') as f:
        sql = f.read()

    # Selection du schema
    #cursor.execute(f'SET search_path TO "{nom_schema}";')
    schema_cible = ReqeteFctory_connexionSchema.schemaCible(nom_schema)
    schema_cible.execute(cursor)

    #exécuction des requetes pour créer les tables 1388
    cursor.execute(sql)

    # commit changes
    print("génération des tables pour la norme 1388 avec succès !")

    # close cursor and connection objects
    cursor.close()
    connexion.close()

@route_gen_shema_et_tables_1388.route('/generateur_schema_&_tables_1388', methods=['POST'])
@jeton_existe
def generateur_schema_tables_1388():
        
        # Récupération des données d'authentification envoyées via une requête POST
        nom_utilisateur = request.json['username']
        mdp = request.json['mdp']
        bdd = request.json['bdd']
        localhost = request.json['host']
        nom_schema = request.json['projet']
        

        # Connection à la base de données
        global connexion
        connexion = psycopg2.connect(host=localhost, database=bdd, user=nom_utilisateur, password=mdp)
        # Création du schéma
        connexion.autocommit = True       
        cursor = connexion.cursor()
        creer_schema = requeteFactory_nouveauSchema.requete_nouveau_schema(nom_schema,nom_utilisateur) 
        creer_schema.execute(cursor)
        autorisation = requeteFactory_nouveauSchema.requete_autorisations(nom_schema,nom_utilisateur)
        autorisation.execute(cursor)

        ##cursor.execute(f'CREATE SCHEMA "{nom_schema}" AUTHORIZATION "{nom_utilisateur}";')
        # Accorder tous les privilèges sur le schéma à l'utilisateur
        ##cursor.execute(f'GRANT ALL PRIVILEGES ON SCHEMA "{nom_schema}" TO "{nom_utilisateur}";')
        # Accorder tous les privilèges sur toutes les tables dans le schéma à l'utilisateur
        ##cursor.execute(f'GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA "{nom_schema}" TO "{nom_utilisateur}";')
        # Accorder tous les privilèges par défaut sur les tables créées ultérieurement dans le schéma
        ##cursor.execute(f'ALTER DEFAULT PRIVILEGES IN SCHEMA "{nom_schema}" GRANT ALL PRIVILEGES ON TABLES TO "{nom_utilisateur}";')

       
        # Fermeture du curseur et de la connexion
        cursor.close()
        #conn.close()
        # Création des tables dans le schèma
        generate_1388( connexion, nom_schema)
        return jsonify({'message': f'Le projet "{nom_schema}" a été créé avec succès !'})
    