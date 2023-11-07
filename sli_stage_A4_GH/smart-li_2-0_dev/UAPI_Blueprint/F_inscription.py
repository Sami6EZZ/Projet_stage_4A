from flask import Blueprint, jsonify,  request
import psycopg2
import os
from dotenv import load_dotenv


route_inscription = Blueprint("F_inscription", __name__)

# Charger les variables d'environnement depuis le fichier .env spécifié
load_dotenv('./donnees_bdd.env')

@route_inscription.route("/inscription_postgre", methods=["POST"])
def inscription_postgre():
    # Récupération des données envoyées par la requête POST
    nom_utilisateur = request.json['nom_utilisateur']
    nom_bdd = request.json['nom_bdd']
    mot_de_passe = request.json['mot_de_passe']
    print(nom_utilisateur,nom_bdd, mot_de_passe)

    host_id=os.getenv("HOST_ID")
    bdd_id=os.getenv("DATABASE_ID")
    utilisateur_id=os.getenv("USER_ID")
    mdp_id=os.getenv("PASSWORD_ID")
    print(host_id,bdd_id,utilisateur_id,mdp_id)

    try:
        # Connexion à la base de données postgres pour créer la nouvelle base de données
        conn = psycopg2.connect(host=host_id, database=bdd_id, user=utilisateur_id, password=mdp_id)
        conn.autocommit = True
        cur = conn.cursor()

        cur.execute(f'CREATE DATABASE "{nom_bdd}";')

        conn.commit()
        cur.close()
        conn.close()
    
        # Connexion à la nouvelle base de données pour créer un utilisateur avec un mot de passe 
        conn = psycopg2.connect(host=host_id, database=nom_bdd , user=utilisateur_id, password=mdp_id)
        conn.autocommit = True
        cur = conn.cursor()
        cur.execute(f'CREATE USER "{nom_utilisateur}" WITH PASSWORD \'{mot_de_passe}\';')
        cur.execute(f'GRANT ALL PRIVILEGES ON DATABASE "{nom_bdd}" TO "{nom_utilisateur}";')
        cur.execute(f'ALTER USER "{nom_utilisateur}" CREATEDB;')

        conn.commit()
        cur.close()

        conn.close()
   
        # Connexion à la base de données en tant que nouvel utilisateur
        conn = psycopg2.connect(host=host_id, database=nom_bdd , user=nom_utilisateur , password=mot_de_passe)
        conn.close()
        return jsonify({'message':f'"{nom_utilisateur}"'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Erreur lors de la création de l\'utilisateur.', 'error': str(e)}), 500