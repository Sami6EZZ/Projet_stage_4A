from flask import Blueprint, jsonify, request
import psycopg2
from UAPI_Blueprint.json_web_token import jeton_existe




route_supprimer_projet = Blueprint("F_supprimer_projet", __name__)



@route_supprimer_projet.route('/supprimer_projet', methods=['POST'])
@jeton_existe
def suppr_projet():
    try:
        print('a')
        # Récupération des données d'authentification envoyées via une requête POST
        nom_utilisateur = request.json['username']
        mdp = request.json['mdp']
        bdd = request.json['bdd']
        localhost = request.json['host']
        nom_schema = request.json['nom_projet']
        
        # Connexion à la base de données
        conn = psycopg2.connect(host=localhost, database=bdd, user=nom_utilisateur, password=mdp)
        cur = conn.cursor()
        
        # Exécution de la requête SQL pour supprimer le schéma en cascade
        print('c')
        query = f'DROP SCHEMA "{nom_schema}" CASCADE;'
        cur.execute(query)
        conn.commit()
        print('cc')
        # Fermeture de la connexion à la base de données
        cur.close()
        conn.close()
        
        return "Schéma supprimé avec succès",200
    except Exception as e:
        print(e)
        return  500

