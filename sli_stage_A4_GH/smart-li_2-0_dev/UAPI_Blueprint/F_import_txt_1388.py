from flask import Blueprint, jsonify, request, current_app
import os
import psycopg2
import pandas as pd
from collections import defaultdict
import sys
from UAPI_Blueprint.json_web_token import jeton_existe



route_import_txt_1388 = Blueprint("F_import_txt_1388",__name__)


# Fnctions pour l'importation des fichier .txt
# fonction read1388 pour récupérer le fichier Excel ''Module 1388 - DED Liste complete Version Smart-LI 1388''
def read1388(path):
    #utilisation de la bibliothèque Pandas pour lire le fichier Excel et stocker les données dans un DataFrame appelé df1388.
    df1388 = pd.read_excel(path, converters={'Leng': int, 'Décim': int})
    #Les lignes avec des valeurs manquantes dans la colonne "CODE" sont supprimées du DataFrame.
    df1388 = df1388[df1388["CODE"].notna()]
    #Les valeurs manquantes dans la colonne "Décim" sont remplacées par 0.
    df1388.loc[df1388['Décim'].isna(), 'Décim'] = 0
    #Les valeurs "XL" dans la colonne "Type" sont remplacées par "X", et les valeurs "Just" dans la colonne "Type" sont remplacées par "L".
    df1388.loc[df1388["Type"] == "XL", ["Type", "Just"]] = ['X', 'L']
    return df1388

def srcdumptxt() -> defaultdict['tble', dict['colonne', ('len_colonne','decim_colonne','type_colonne')]] :
    df1388 = read1388(os.path.join('in','Module 1388 - DED Liste complete Version Smart-LI.xlsx'))
    ans = defaultdict(dict)
    #Le dictionnaire a la structure suivante :
    #defaultdict['tble', dict['chmp', ('chmp_len', 'chmp_decim', 'chmp_type')]]
    #où 'tble' est le nom de la table, 'chmp' est le nom du champ (colonne), et ('chmp_len', 'chmp_decim', 'chmp_type') est un tuple contenant la longueur, le nombre de décimales et le type du champ.
    for tbl_name, tbl_group in df1388.groupby("Table", sort=False):
        ans[tbl_name] = dict(zip(tbl_group["CODE"], tbl_group.apply(lambda row: (row["Leng"], row["Décim"], row["Type"]), axis=1)))
    return ans



@route_import_txt_1388.route('/import_txt_1388', methods=['POST'])
@jeton_existe
def F_read_txt_1388():

    # Récupération des données d'authentification envoyées via une requête POST
    username = request.json['username']
    mdp = request.json['mdp']
    bdd = request.json['bdd']
    localhost = request.json['host']
    nom_schema = request.json['nom_projet']
    # Connection à la base de données
    global connexion
    connexion = psycopg2.connect(host=localhost, database=bdd, user=username, password=mdp)
    cursor=connexion.cursor()
    cursor.execute(f'SET search_path TO "{nom_schema}";')

    dict_1 = srcdumptxt()
    queries = []
    nom_table=""
    file = current_app.config['IMPORTED_FILE_PATH']  # Récupérer le chemin d'accès du fichier importé à partir de la variable globale
    # Formulation des requêtes SQL pour l'insertion des données dans les tables
    with open(file, 'r') as f:
        for line in f:
            #nom de la table
            table = line[1:3]
            nom_table=table
            end = 4
            all_chmp = []
            all_value = []
            for colonne, (len_colonne, decim_colonne, type_colonne) in dict_1[str(table)].items():
                #La méthode strip() est utilisée pour supprimer les espaces inutiles autour de la valeur.
                value = line[end:end+len_colonne].strip()
                end = end + len_colonne
                all_chmp.append(colonne)
                match type_colonne:
                    case 'N':
                        if (value == ""):
                            all_chmp.remove(colonne)
                        else:
                            all_value.append(str(float(value)/10**decim_colonne))
                    case 'D':
                        if (value == ""):
                            all_chmp.remove(colonne)
                        else:
                            all_value.append(str(value))
                    case 'X' | 'A':
                            value = value.replace("'", "''")  # Échapper les apostrophes dans la valeur
                            all_value.append(f"'{value}'")  # Ajouter des guillemets autour de la valeur
            insert_query = f"INSERT INTO {table} ({','.join(all_chmp)}) VALUES ({','.join(all_value)});"
            queries.append(insert_query)

    # dictionnaire pour stocker les requêtes erronées par table
    liste_erreur = {}
    # exécution des requêtes 
    try:
        # vérification des contraintes de clé étrangère pour toutes les tables à la fin de l'exécution des requetes (au momoent du commit)
        cursor.execute("SET CONSTRAINTS ALL DEFERRED") 
        for requete in queries:
            ligne =1
            try:
                cursor.execute(requete)
            except Exception as e:
                #affichage des messages d'erreur + les requetes éronnées
                print(e," => ",requete,'\n')
                #envoie des requetes érronées sous forme d'un dictionnaire pour les afficher dans le front.
                if nom_table not in liste_erreur:
                     liste_erreur[nom_table] = []
                liste_erreur[nom_table].append({'erreur': str(e), 'requete': requete,  'ligne': ligne})

                 # En cas d'erreur, on annule les modifications de la transaction et on passe à la requete suivante
                connexion.rollback()
            ligne+=1
        # Validation des requetes
        connexion.commit()
    except Exception as e:
        print(e)
        return jsonify({'message': 'Erreur lors de l\'importation du fichier', 'liste_erreur': liste_erreur}), 500

    finally:
        # Close the cursor and the connection
        cursor.close()
        connexion.close()
        # Supprimer le fichier enregistré dans l'application
        os.remove(file)
        return jsonify({'message': 'DUMP importé avec succès', 'liste_erreur': liste_erreur})
    
    