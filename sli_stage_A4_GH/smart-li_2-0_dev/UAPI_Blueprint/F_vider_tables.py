from flask import Blueprint, jsonify, request
import psycopg2
from UAPI_Blueprint.json_web_token import jeton_existe



route_vider_tables = Blueprint("F_vider_tables", __name__)

@route_vider_tables.route('/vider_tables', methods=['POST'])
@jeton_existe
def vider_tables():
    try:
        # Récupération des données d'authentification envoyées via une requête POST
        nom_utilisateur = request.json['username']
        mdp = request.json['mdp']
        bdd = request.json['bdd']
        localhost = request.json['host']
        nom_schema = request.json['nom_projet']
        

        # Connection à la base de données
        global connexion
        connexion = psycopg2.connect(host=localhost, database=bdd, user=nom_utilisateur, password=mdp)
        # Création du schéma
        cur = connexion.cursor()

        # Récupération de la liste des tables dans le schéma spécifié
        cur.execute(f"SELECT table_name FROM information_schema.tables WHERE table_schema = '{nom_schema}';")
        tables = cur.fetchall()

        # Vidage des tables
        for table in tables:
            nom_table = table[0]
            truncate_query = f'TRUNCATE TABLE "{nom_schema}"."{nom_table}" CASCADE;'
            cur.execute(truncate_query)
            connexion.commit()


        # Fermeture de la connexion à la base de données
        cur.close()
        connexion.close()

        return jsonify({'message': 'Les tables ont été vidées avec succès.'})

    except psycopg2.Error as e:
        print(e)
        return jsonify({'message': 'Erreur lors de la suppression des données \n' + str(e)})
