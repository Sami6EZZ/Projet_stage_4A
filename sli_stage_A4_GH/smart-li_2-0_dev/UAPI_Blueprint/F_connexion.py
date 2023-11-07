from flask import Blueprint, jsonify,  request, current_app
import psycopg2
#from flask_oidc import OpenIDConnect
#from flask_session import Session
import jwt


route_connexion = Blueprint("F_connexion", __name__)
"""
route_connexion.config = {
    'SECRET_KEY': 'superkey',
    'OIDC_CLIENT_SECRETS': 'client_secrets.json', # à remplacer par le chemin d'accès au fichier de configuration du client 'OpenID Connect' du fournisseur d'authentification.
    'OIDC_COOKIE_SECURE': False,
    'SESSION_TYPE': 'filesystem'
}

oidc = OpenIDConnect(route_connexion)
Session(route_connexion)
"""

@route_connexion.route('/connexion_postgre', methods=['POST'])
#@oidc.require_login
def connect_postgre():
    try :
       
        # Récupération des données de connexion
        username = request.json['username']
        password = request.json['mdp']
        database = request.json['bdd']
        host = request.json['host']

        # Connexion à la base de données
        conn = psycopg2.connect(host=host, database=database, user=username, password=password)

        # Vérification de la connexion en exécutant une requête simple
        cur = conn.cursor()
        cur.execute('SELECT 1')
        resultat = cur.fetchone()
        cur.close()
        conn.close()

        if resultat:
            # Génération du jeton JWT ici
            # Récupérer l'adresse IP de l'ordinateur connecté
            adresse_ip = request.remote_addr
            payload = {"username": username, "host":host, "ip":adresse_ip}
            jeton = jwt.encode(payload, current_app.config['CLE_ID'], algorithm="HS256")
            return jsonify({"message": "Échec de la connexion","jeton": jeton}), 200
        else:
            return jsonify({}), 500

       

    except (Exception, psycopg2.Error) as e:
        print(e)
        return jsonify(), 500