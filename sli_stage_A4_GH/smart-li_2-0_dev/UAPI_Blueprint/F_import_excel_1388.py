from flask import Blueprint, jsonify, request, current_app
import os
import psycopg2
import pandas as pd
from collections import defaultdict
import sys
from UAPI_Blueprint.json_web_token import jeton_existe



route_import_excel_1388 = Blueprint("F_import_excel_1388",__name__)




# Obtain a name list of every tables
def get_all_tables(FILE):
    xlsx = pd.ExcelFile(FILE)
    sheet_names = xlsx.sheet_names
    # The first is a summary and should not be handled
    return sheet_names[1:]

def get_type(DICTIONNAIRE):

    # Create a dicitonary with the key of the "Table" column et the value of the column "Type"
    df2 = pd.read_excel(DICTIONNAIRE)
    data_dict = df2.set_index('CODE')['Type'].to_dict()
    #print(data_dict)

    # This dictionnary contains 198 types of fields
    return data_dict


def Convertir_une_table(liste_erreur,TABLE, xls_lu,type_df, m_type , conn):
    cur=conn.cursor()
    # vers la fonction principale de la route flask
    # Read an excel file
    #x = pd.ExcelFile(FILE)

    # Lecture des données de la feuille Excel correspondant à la table spécifiée
    df1 = xls_lu.parse(TABLE)

    # Obtention de tous les champs (colonnes) de cette feuille Excel
    all_champ = list(df1.columns)[2:-3] # Last 3 are comments, they don't need to be taken into account

    # fichier=open('requetes.sql', "a") ajouté par les étudiants
    # Obtention du schéma de la table à partir du DataFrame des types de données
    table_schema = type_df[type_df["Table"] == TABLE]
    decim_dict = table_schema.set_index('CODE')['Décim'].to_dict()
    
    
    # Loop through the rows of the worksheet, retrieving the values of all columns from each row
    #cur.execute(f"TRUNCATE TABLE {TABLE} CASCADE")
    queries = []
    for i in range(df1.shape[0]): # df.shape[0] number of rows，df.shape[1] number of columns
        SQL = ''
        row = df1.iloc[i,2:-3] # the i-th row of the form, the third column to the penultimate third column (the last three are comments, not required) the name and corresponding data of each column
        row_list = list(row) # Convert the row to a list
        m_dict = dict(zip(all_champ, row_list)) # Create a dictionary with the row values and column names

        
        columns = []
        values = []
        for k in all_champ:
            chmp_type = m_type.get(k)
            chmp_decim = decim_dict[k]
            value = str(m_dict[k]).strip()
            sql_value = None
            if m_type.get(k) in ['X', 'A'] and value not in ["","nan"]:
                value = value.replace("'", "''")  # Escape single quotes in the value
                sql_value = f"'{value}'"  # Add single quotes around the value
            elif chmp_type == "N" and str(chmp_decim) not in ["nan"] and value not in ["", "nan"]:
                sql_value = str(float(value) / 10 ** chmp_decim)

            elif value not in ["","nan"]:
                sql_value = value

         

            if sql_value is not None :
                columns.append(k)
                values.append(sql_value)

        list_key = ",".join(columns)  # Create comma-separated string of column names
        list_value = ",".join(values)  # Create comma-separated string of values, inserting 'null' for null values

        SQL = "INSERT INTO %s(%s) VALUES (%s);" % (TABLE, list_key, list_value) # Create the SQL query with placeholders for table name, column names, and values
        #SQL = SQL.replace("'nan'", "null").replace("nan", "null") # Replace 'nan' with 'null'
      
        

        queries.append(SQL)

    
    # exécution des requêtes 
    try:
        # vérification des contraintes de clé étrangère pour toutes les tables à la fin de l'exécution des requetes (au momoent du commit)
        cur.execute("SET CONSTRAINTS ALL DEFERRED") 
        for requete in queries:
            ligne = 1
            try:
                cur.execute(requete)
            except Exception as e:
                #affichage des messages d'erreur + les requetes éronnées
                print(e," => ",requete,'\n')
                if TABLE not in liste_erreur:
                     liste_erreur[TABLE] = []
                liste_erreur[TABLE].append({'erreur': str(e), 'requete': requete, 'ligne': ligne})
               
            
                # En cas d'erreur, on annule les modifications de la transaction et on passe à la requete suivante
                conn.rollback()
            ligne+=1
        # Validation des requetes
        conn.commit()
    except Exception as e:
        print(e)
        return jsonify({'message': 'Erreur lors de l\'importation du fichier','liste_erreur': liste_erreur}), 500

    finally:
        cur.close()



@route_import_excel_1388.route('/import_Excel_1388', methods=['POST'])

def import_Excel_1388_Convertir_tous():

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
        # Récupérer le chemin d'accès du fichier importé à partir de la variable globale
        file_xls = current_app.config['IMPORTED_FILE_PATH']
        # Obtention de la liste de toutes les tables du fichier Excel importé  
        all_tables=get_all_tables(file_xls)
        # Lecture du fichier Excel
        xls_lu = pd.ExcelFile(file_xls)
        # Obtention du chemin d'accès du fichier Excel contenant les types de données
        data_type = os.path.join('in','Module 1388 - DED Liste complete Version Smart-LI.xlsx')  
        # is used to obtain the data type to decide whether to add quotation marks
        m_type=get_type(data_type)
        #charger les données de la liste DED-1388 dans une structure de données tabulaire 
        type_df = pd.read_excel(data_type)
        # dictionnaire pour stocker les requêtes erronées par table
        liste_erreur  = {}
        for table in all_tables:
            Convertir_une_table(liste_erreur, table, xls_lu, type_df, m_type=m_type , conn=connexion)
        cursor.close()
        connexion.close()
        # Ferme  et supprimer le fichier Excel
        xls_lu.close()  
        os.remove(file_xls)
                
        return jsonify({'message': 'DUMP importé avec succès','liste_erreur': liste_erreur })
      