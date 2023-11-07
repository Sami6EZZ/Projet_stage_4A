from flask import Blueprint, jsonify, request
import psycopg2
from UAPI_Blueprint.json_web_token import jeton_existe


route_liste_shemas = Blueprint("F_liste_projets", __name__)

@route_liste_shemas.route("/liste_schemas", methods=["POST"])
@jeton_existe
def liste_schemas_utilisateur():
    # Récupération des données d'authentification envoyées via une requête POST
    nom_utilisateur = request.json['username']
    mdp = request.json['mdp']
    bdd = request.json['bdd']
    localhost = request.json['host']
    
    try:
        # Connexion à la base de données en utilisant les données d'authentification
        conn = psycopg2.connect(host=localhost, database=bdd, user=nom_utilisateur, password=mdp)
        conn.autocommit = True
        cur = conn.cursor()

        # Récupération des noms des schémas existants dans la base de données de l'utilisateur
        cur = conn.cursor()
        cur.execute("SELECT schema_name FROM information_schema.schemata WHERE schema_name NOT IN ('pg_catalog', 'information_schema', 'public');")
        resultat = cur.fetchall()
        liste_schemas = [r[0] for r in resultat]

        # Fermeture du curseur et de la connexion
        cur.close()
        conn.close()

        return jsonify({'schemas': liste_schemas}), 200

    except Exception as e:
        print(e)
        return jsonify({'message': 'Erreur lors de la récupération des noms des projets.'}), 500
    

