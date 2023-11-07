from flask import Blueprint, jsonify, request
import psycopg2
from UAPI_Blueprint.json_web_token import jeton_existe


route_affichage_tables = Blueprint("F_affichage_tables",__name__)
def get_colonnes_numeric(schema, table, conn):
    # Connection à la base de données
    cursor = conn.cursor()

    # Récupération des colonnes numériques de la table
    cursor.execute(f'''
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = '{schema}'
        AND table_name = '{table}'
        AND data_type IN ('smallint', 'integer', 'bigint', 'numeric', 'real', 'double precision')
    ''')
    colonnes_numeric = [column[0] for column in cursor.fetchall()]

    # Fermeture du curseur et de la connexion à la base de données
    cursor.close()
    #conn.close()

    return colonnes_numeric



@route_affichage_tables.route('/get_table_total_pages', methods=['POST'])
def get_table_total_pages():
    # Récupération des données d'authentification et du nom du schéma et de la table envoyées via une requête POST
    username = request.json['username']
    mdp = request.json['mdp']
    bdd = request.json['bdd']
    localhost = request.json['host']
    nom_schema = request.json['nom_projet']
    nom_table = request.json['nom_table']

    # Connection à la base de données
    conn = psycopg2.connect(host=localhost, database=bdd, user=username, password=mdp)
    cursor = conn.cursor()
    cursor.execute(f'SET search_path TO "{nom_schema}";')

    # Récupération du nombre total de lignes dans la table
    cursor.execute(f'SELECT COUNT(*) FROM "{nom_table}"')
    lignes_totales = cursor.fetchone()[0]

    # Calcul du nombre total de pages (quotient de la division entière + 1 pour le reste)
    ligne_par_page = 1000
    total_pages = (lignes_totales // ligne_par_page) + 1
    

    # Fermeture du curseur et de la connexion à la base de données
    cursor.close()

    # Renvoi du nombre total de pages en JSON
    return jsonify({'totalPages': total_pages})





@route_affichage_tables.route('/get_table_data', methods=['POST'])
def get_table_data():
    # Récupération des données d'authentification et du nom du schéma et de la table envoyées via une requête POST
    username = request.json['username']
    mdp = request.json['mdp']
    bdd = request.json['bdd']
    localhost = request.json['host']
    nom_schema = request.json['nom_projet']
    nom_table = request.json['nom_table']
    numero_pagination = int(request.json['numero_pagination'])
    #print(username,mdp,bdd,localhost,nom_schema,nom_table)

    # Connection à la base de données
    conn = psycopg2.connect(host=localhost, database=bdd, user=username, password=mdp)
    cursor = conn.cursor()
    cursor.execute(f'SET search_path TO "{nom_schema}";')

    # Récupération du nombre total de lignes dans la table
    cursor.execute(f'SELECT COUNT(*) FROM "{nom_table}";')
    total_lignes = cursor.fetchone()[0]
    
    # Récupération des noms des colonnes de la table dans l'ordre de la base de données
    cursor.execute(f"SELECT column_name FROM information_schema.columns WHERE table_schema='{nom_schema}' AND table_name='{nom_table}' ORDER BY ordinal_position;")
    colonnes = [colonne[0] for colonne in cursor.fetchall()]
    
    # Calcul du nombre total de pages (quotient de la division entière)
    ligne_par_page = 1000
    total_pages = total_lignes // ligne_par_page

    # Calcul de l'offset pour la page demandée
    offset = (numero_pagination - 1) * ligne_par_page

    # Récupération des données de la table pour la page demandée
    cursor.execute(f'SELECT {", ".join(colonnes)} FROM "{nom_table}" LIMIT {ligne_par_page} OFFSET {offset};')
    # LA méthode fetchall() retourne les données sous forme d'une liste de tuples.   ex : [(v01,v02,v03), (v11,v12,v13), (v12,v22,v32), ...]
    table_data = cursor.fetchall()

    # Fermeture du curseur et de la connexion à la base de données
    cursor.close()
    #conn.close()

    # Déclaration du dictionnaire qui contiendra tous les informations à afficher
    table = {
        'colonnes': colonnes,
        'data': []
    }

    # Convertir les données de la table en une liste de dictionnaires
    for ligne in table_data:
        ligne_data = {}
        for i, colonne in enumerate(colonnes):
            ligne_data[colonne] = ligne[i]
        table['data'].append(ligne_data)
    """'data': [
        {'colonne1': valeur11, 'colonne2': valeur12, 'colonne3': valeur13}, # Dictionnaire pour ligne1
        {'colonne1': valeur21, 'colonne2': valeur22, 'colonne3': valeur23}, # Dictionnaire pour ligne2
        {'colonne1': valeur31, 'colonne2': valeur32, 'colonne3': valeur33}  # Dictionnaire pour ligne3
    ]
    }"""
    
    # Récupération des colonnes numériques de la table
    colonnes_numeric = get_colonnes_numeric(nom_schema, nom_table, conn)  # Remplacez cette fonction par la logique appropriée pour récupérer les colonnes numériques

    # Ajouter les colonnes numériques à l'objet table
    table['colonnesNumeric'] = colonnes_numeric

    
    # Renvoi des données au code HTML et JavaScript
    return jsonify(table)