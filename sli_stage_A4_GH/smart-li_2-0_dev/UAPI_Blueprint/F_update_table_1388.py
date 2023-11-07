from flask import Blueprint, jsonify, request
import psycopg2
import json
import os
from UAPI_Blueprint.json_web_token import jeton_existe



route_update_table_1388 = Blueprint("F_update_table_1388",__name__)
# Function pour récuperer le dictionnaire contenant les clés primaires depuis le fichier JSON 
def dictionnaire_cles_primaires_json(fichier_json):
    with open(fichier_json, 'r') as dictionnaire_json:
        return json.load(dictionnaire_json)


@route_update_table_1388.route('/update_table2', methods=['POST'])
def update_table_data_2():
    

# récupération du dictionnaire des clés primaires de chaque table
    table_cles_primaires = dictionnaire_cles_primaires_json(os.path.join('UAPI_Blueprint', 'cles_primaires_table_1388.json'))
    

    data = request.get_json()
    username = data['username']
    mdp = data['mdp']
    bdd = data['bdd']
    host = data['host']
    nom_projet = data['nom_projet']
    nom_table = data['nom_table']
    lignes_modifiee = data['lignes_modifiees']
    noms_colonnes = data['nomsColonnes']
    valeurs_PK_initiales = data['valeurs_PK_initiales']
    print(valeurs_PK_initiales)
    

    #print(data)

    # Connexion à la base de données et mise à jour des lignes modifiées
    try:
        connection = psycopg2.connect(user=username, password=mdp, database=bdd, host=host)
        cursor = connection.cursor()
        cursor.execute(f'SET search_path TO "{nom_projet}"')

        resultats = []  # Variable pour stocker les résultats des requêtes SELECT
        num_iterations = 0  # Variable pour stocker le nombre d'itérations
        primary_keys_name_list = table_cles_primaires.get(nom_table, [])
        nombre_colonnes_cles = len(primary_keys_name_list)

        for ligne in lignes_modifiee:
            valeurs_primary_key = [ligne[noms_colonnes.index(key)] for key in table_cles_primaires[nom_table]]
            print(valeurs_primary_key)
            set_clause = ', '.join([f"{noms_colonnes[i]} = %s" for i in range(len(noms_colonnes))])
            # Récupérer les valeurs initiales correspondantes
            valeur_initiale = valeurs_PK_initiales[num_iterations][:nombre_colonnes_cles]
            print(valeur_initiale)
            where_clause = ' AND '.join([f"{table_cles_primaires[nom_table][i]} = %s" for i in range(len(table_cles_primaires[nom_table]))])
            query = f"UPDATE {nom_table} SET {set_clause} WHERE {where_clause}"
            valeurs = ligne + valeur_initiale
            print(query, valeurs)

            cursor.execute(query, valeurs)

            # Exécuter une requête SELECT après chaque mise à jour pour récupérer les résultats
            select_query = f"SELECT * FROM {nom_table} WHERE {where_clause}"
            cursor.execute(select_query, valeurs_primary_key)
            resultat = cursor.fetchone()
            resultats.append(resultat)
            num_iterations += 1

        connection.commit()
        cursor.close()
        connection.close()
        #print(results)

        return jsonify({'success': True, 'results': resultats}),200
    except (Exception, psycopg2.Error) as erreur:
        print("Erreur lors de la mise à jour de la table :", erreur)
        return jsonify({'success': False, 'erreur': str(erreur)})

