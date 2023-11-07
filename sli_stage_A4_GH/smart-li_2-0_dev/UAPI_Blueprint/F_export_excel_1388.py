from flask import Blueprint, jsonify, request,send_file, make_response,current_app
import os
import psycopg2
import pandas as pd
from collections import defaultdict
from openpyxl import Workbook
import datetime
from UAPI_Blueprint.json_web_token import jeton_existe


route_export_excel_1388 = Blueprint("F_export_excel_1388",__name__)



    # Fnctions pour l'exportation des fichiers .Excel

def Get_time(ws):
  ws.write(1, 0, 'Date mise à jour')
  ws.write(1, 1, datetime.datetime.now().strftime('%d/%m/%Y'))


#Exporter tous les données d'une table  dans le fichier Excel
def export_table_data(WRITER, TABLE, conn,nom_schema, type_df):
    conn.autocommit = True       
    cursor=conn.cursor()
    cursor.execute(f'SET search_path TO "{nom_schema}";')
    # Sélectionner toutes les données de la table spécifiée
    sql = f"Select * from {TABLE}"
    #print(sql)
    cursor.execute(sql)
    # Données récupérées à l'aide de la méthode fetchall() et stockées dans la variable results
    results = cursor.fetchall()
    
    # Récupèrer les noms des colonnes de la table  
    columns = [i[0].upper() for i in cursor.description]
    
    # les colonnes de chaque table
    new_columns = ["UC", "Table"] + columns + ["_Commentaire_1", "_Commentaire_2", "_Commentaire_3"]
    #df = pd.DataFrame(columns=new_columns)
    type_dict = type_df[type_df["Table"] == TABLE].set_index('CODE')['Type'].to_dict()
    decim_dict = type_df[type_df["Table"] == TABLE].set_index('CODE')['Décim'].to_dict()

    records = 0
    donnees_par_ligne = []
    # Si une table est vide, ajouter une ligne vide avec les colonnes à df
    if len(results) == 0:  
        ligne_vide = {c: "" for c in new_columns}
        donnees_par_ligne.append(ligne_vide)
    else:
        for r in results:
            row = dict(zip(columns, r))
            row["Table"] = TABLE
            row = {c: row.get(c, "") for c in new_columns}

            for c in new_columns:
                if c not in type_dict:
                    continue
                chmp_type = type_dict[c]
                chmp_decim = decim_dict[c]
                value = row.get(c, "")
                if chmp_type == "N" and str(chmp_decim) not in ["nan"] and value is not None :
                    value = float(value) * ( 10 ** chmp_decim)
                row[c] = value
            # Append to an empty dataframe
            #df = pd.concat([df, pd.DataFrame([row])], ignore_index=True)
            donnees_par_ligne.append(row)
            records += 1
    #créer un DataFrame à partir de la liste des données
    df = pd.DataFrame(donnees_par_ligne)
    #Exporter les données vers une feuille Excel spécifiée par 'sheet_name' 
    df.to_excel(WRITER, sheet_name=TABLE, index=False)
    cursor.close()
    return records #Record the number of rows in this table

# To process the export, pass in the export file address    
def export_data(conn, OUTPUT_PATH, nom_schema):  
    
    # Crée un objet ExcelWriter pour écrire dans le fichier Excel de sortie
    writer = pd.ExcelWriter(OUTPUT_PATH, engine='xlsxwriter')
    #chargement des données du fichier Excel, contenant les types de données, dans une structure de données tabulaire
    type_df = pd.read_excel(os.path.join('in', 'Module 1388 - DED Liste complete Version Smart-LI.xlsx')) # Read table and field files
    # Extraction des noms de table uniques à partir du DataFrame type_df
    all_table_names = type_df['Table'].unique()
    # Colonnes de la feuille 'Résumé'
    columns = ["Table", "Porte sur", "Description", "Lien vers requête de vérification", "Nbre de ligne", "Statut"]
    # Création d'un DataFrame vide avec les colonnes spécifiées
    df = pd.DataFrame(columns=columns)
    # Écriture du DataFrame récapitulatif dans la feuille de calcul "Résumé"
    df.to_excel(writer, sheet_name="Résumé", index=False, startrow=3)
    
    for table in all_table_names:  # Traverse the table names and export them one by one
        records = export_table_data(writer, table, conn, nom_schema, type_df) # Update the columns of records in the worksheet("Résumé")
        #export_table_data(writer, table)
        row = {"Table": table, "Porte sur": "1388-2b", "Lien vers requête de vérification": table, "Nbre de ligne": records, "Statut": 1 if records > 0 else 0}
        for c in columns:
            row[c] = row.get(c, "")
        df = pd.concat([df, pd.DataFrame([row])], ignore_index=True)
    Get_time(writer.sheets["Résumé"])
    df.to_excel(writer, sheet_name="Résumé", index=False, startrow=3)
    print("**Fin**")
    writer.close()
    conn.close()


@route_export_excel_1388.route('/export_Excel_1388', methods=['POST'])
@jeton_existe
def export_excel_1388():
    try:
        # Connexion à la base de données
        username = request.json['username']
        mdp = request.json['mdp']
        bdd = request.json['bdd']
        localhost = request.json['host']
        nom_schema = request.json['nom_projet']
        global connexion
        connexion = psycopg2.connect(host=localhost, database=bdd, user=username, password=mdp)

        # Créer un nouveau fichier Excel vide
        nom_fichier_Excel_AExporter = nom_schema +"_Fichier_Smart-LI"+ ".xlsx"
        chemain_fichier_Excel_AExporter = os.path.join(os.path.abspath(os.path.dirname(__file__)), current_app.root_path,current_app.config['FILE_TO_DOWNLOAD'],nom_fichier_Excel_AExporter)
        # Créer un fichier Excel vide en utilisant openpyxl
        workbook = Workbook()
        workbook.save(chemain_fichier_Excel_AExporter)

    

        export_data(connexion, chemain_fichier_Excel_AExporter, nom_schema)
    
        # Envoi du fichier en tant que pièce jointe à télécharger
        response = make_response(send_file(chemain_fichier_Excel_AExporter, as_attachment=True))
        response.headers['Content-Disposition'] = 'attachment; filename=' + nom_fichier_Excel_AExporter
        # Retourner la réponse
        return response
        
    except psycopg2.Error as e:
        print(e)
        return jsonify({'message': 'Erreur lors de l\'exportation du dump Excel'})
    

