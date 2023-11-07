from flask import Blueprint, jsonify, request, send_file, make_response, current_app
import os
import psycopg2
import pandas as pd
from collections import defaultdict
from UAPI_Blueprint.json_web_token import jeton_existe


route_export_txt_1388 = Blueprint("F_export_txt_1388",__name__)



#Fonction pour exporter le DUMP txt
def read1388_imp(path):
    df1388 = pd.read_excel(path, converters={'Leng': int, 'Décim': int})
    df1388 = df1388[df1388["CODE"].notna()]
    df1388.loc[df1388['Décim'].isna(), 'Décim'] = 0
    df1388.loc[df1388["Type"] == "XL", ["Type", "Just"]] = ['X', 'L']
    return df1388

def srcdump_imp_txt() -> defaultdict['tble', dict['chmp', ('chmp_len','chmp_decim','chmp_type','chmp_just')]]:
    df1388 = read1388_imp(os.path.join('in','Module 1388 - DED Liste complete Version Smart-LI.xlsx'))
    ans = defaultdict(dict)
    for tbl_name, tbl_group in df1388.groupby("Table", sort=False):
        ans[tbl_name] = dict(zip(tbl_group["CODE"], tbl_group.apply(lambda row: (row["Leng"], row["Décim"], row["Type"], row["Type"]), axis=1)))
    return ans

def writetxt_imp(conn, nom_schema):
    conn.autocommit = True       
    cursor=conn.cursor()
    cursor.execute(f'SET search_path TO "{nom_schema}";')
    dict_1 = srcdump_imp_txt()
    formatted_dump = []
    for tble in dict(dict_1):
        tble = tble.upper()
        select_query = f"SELECT * FROM {tble}"
        cursor.execute(select_query)
        results = cursor.fetchall()
        column_names = [i[0].upper() for i in cursor.description]
        for result in results:
            formatted_record = ' ' + str(tble) + ' '
            for chmp, chmp_def in dict_1[tble].items():
                chmp = chmp.upper()
                chmp_index = column_names.index(chmp)
                value = result[chmp_index]
                chmp_def = dict_1[tble][chmp]
                chmp_len = chmp_def[0]
                chmp_decim = chmp_def[1]
                chmp_type = chmp_def[2]
                chmp_just = chmp_def[3]
                if chmp_type in ('N', 'D'):
                    if value == None:
                        value = ""*chmp_len
                    elif tble == "BD" and chmp == "FAILRTBD":
                        value = str(float(value))
                    
                    else:
                        value = int(float(value)*10 ** chmp_decim)
                        if value == 0 and len(str(value)) < chmp_len:
                            value = str(value).zfill(chmp_len)
                        elif len(str(value)) < chmp_len-1 and chmp_just=='R'or chmp_decim >0:
                            value = str(value).zfill(chmp_len)
                if chmp_type in ('X', 'A'):
                    if value == None:
                        continue
                    

                if chmp_just == 'F':
                    formatted_value = str(value).center(chmp_len)
                elif chmp_just == 'R':
                    formatted_value = str(value).rjust(chmp_len)
                else:
                    formatted_value = str(value).ljust(chmp_len)

                formatted_record += formatted_value
            formatted_dump.append(formatted_record)
    return formatted_dump  



@route_export_txt_1388.route('/export_txt_1388', methods=['POST'])
@jeton_existe
def exp_txt_total():
    global configuration
    configuration = current_app.config['FILE_TO_DOWNLOAD']
    # Connexion à la base de données
    username = request.json['username']
    mdp = request.json['mdp']
    bdd = request.json['bdd']
    localhost = request.json['host']
    nom_schema = request.json['nom_projet']
    global connexion
    connexion = psycopg2.connect(host=localhost, database=bdd, user=username, password=mdp)
    
    # Créer un nouveau fichier texte vide
    nom_fichierAExporter = nom_schema +"_Fichier_Smart-LI"+ ".txt"
    chemain_fichierAExporter = os.path.join(os.path.abspath(os.path.dirname(__file__)),current_app.root_path,current_app.config['FILE_TO_DOWNLOAD'],  nom_fichierAExporter)
    # utilise l'instruction pass pour ne rien écrire dans le fichier. Cela crée donc un fichier texte vide 
    with open(chemain_fichierAExporter, "w") as f:
        pass    
    

    try:
        writetxt_imp(connexion, nom_schema)
        # Write the records to a text file
        with open(chemain_fichierAExporter, "w") as f:
            for record in writetxt_imp(connexion, nom_schema):
                f.write(record + "\n")
        f.close()
        
        # Envoi du fichier en tant que pièce jointe à télécharger
        response = make_response(send_file(chemain_fichierAExporter, as_attachment=True))
        response.headers['Content-Disposition'] = 'attachment; filename=' + nom_fichierAExporter
         
        # Retourner la réponse
        return response
        
    except psycopg2.Error as e:
        print(e)
        return jsonify({'message': 'Erreur lors de l\'exportation du dump txt'})
    