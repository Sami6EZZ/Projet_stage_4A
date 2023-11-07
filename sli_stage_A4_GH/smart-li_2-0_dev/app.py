
from flask import Flask,Blueprint, jsonify, render_template, request,send_file, make_response, current_app
from flask_wtf.csrf import validate_csrf
import pandas as pd
import os
from werkzeug.utils import secure_filename



# Importation des modules pour le protocole OpenID
#from flask_oidc import OpenIDConnect
#from flask_session import Session

# Importation des route  Blueprint
from UAPI_Blueprint.pages_web import navigation
from UAPI_Blueprint.F_connexion import route_connexion
from UAPI_Blueprint.F_inscription import route_inscription
from UAPI_Blueprint.F_liste_projets import route_liste_shemas
from UAPI_Blueprint.F_shema_et_tables_1388 import route_gen_shema_et_tables_1388
from UAPI_Blueprint.F_vider_tables import route_vider_tables
from UAPI_Blueprint.F_supprimer_projet import route_supprimer_projet
from UAPI_Blueprint.F_import_txt_1388 import route_import_txt_1388
from UAPI_Blueprint.F_import_excel_1388 import route_import_excel_1388
from UAPI_Blueprint.F_export_txt_1388 import route_export_txt_1388
from UAPI_Blueprint.F_export_excel_1388 import route_export_excel_1388
from UAPI_Blueprint.F_affichage_tables import route_affichage_tables
from UAPI_Blueprint.F_update_table_1388 import route_update_table_1388



app = Flask(__name__) 
"""
# Configurations OpenID
app.config['SECRET_KEY'] = 'superkey'
app.config['OIDC_CLIENT_SECRETS'] = 'client_secrets.json' # à remplacer par le chemin d'accès au fichier de configuration du client 'OpenID Connect' du fournisseur d'authentification.
app.config['OIDC_COOKIE_SECURE'] = False  
app.config['SESSION_TYPE'] = 'filesystem'

oidc = OpenIDConnect(app)
Session(app)

"""

# Configuration de l'emplacement du fichier importé et de la clé secrète pour l'application
app.config['IMPORTED_FILE_PATH'] = None  # Variable globale pour stocker le chemin d'accès du fichier importé

app.config['UPLOAD_FOLDER'] = 'static/fichiers'

app.config['FILE_TO_DOWNLOAD'] = 'static/fichiers'


"""
Méthode clé JWT
la clé secrete est déclaré commen une variable d'environnement et le fichier .env est stocké en dehors du référentiel de code source
ce qui permet de garder les variables d'environnement sécurisées lors du déploiement du logiciel en utilisant cette variable dans 
l'pplication sans exposer leurs valeurs directement dans les fichiers Dockerfile ou dans l'image Docker elle-même. 
"""

# Récupérer la clé secrète à partir de la variable d'environnement MY_SECRET_KEY
CLE_ID = os.environ.get("CLE_ID", "CLE_ID")

# Vérifier si la clé secrète est définie
if CLE_ID is None:
    raise ValueError("La clé secrète n'est pas définie dans les variables d'environnement.")

# Enregistrer la clé secrète dans l'objet app.config
app.config['CLE_ID'] = CLE_ID


# Les routes Flask de l'application
app.register_blueprint(navigation)




# Routes opérationnelles
app.register_blueprint(route_connexion)




app.register_blueprint(route_inscription)

    

app.register_blueprint(route_liste_shemas)


app.register_blueprint(route_gen_shema_et_tables_1388)



app.register_blueprint(route_vider_tables)

# Fonction pour supprimer un projet définitivement 
app.register_blueprint(route_supprimer_projet)





"""
    Route permettant d'importer un fichier envoyé via une requête POST.

    Cette route attend qu'un fichier soit envoyé dans le corps de la requête sous le nom de fichier 'file'.
    Le fichier est enregistré dans le répertoire spécifié par 'UPLOAD_FOLDER' dans la configuration de l'application.
    Une fois le fichier enregistré avec succès, le chemin d'accès complet du fichier est stocké dans la variable
    globale 'IMPORTED_FILE_PATH' pour une utilisation ultérieure.

    Returns:
        str: Une chaîne vide avec le code d'état 204 (No Content) pour indiquer que la requête a été traitée avec succès.
    """
@app.route('/import_fichier_1388', methods=['POST'])

def import_fichier_1388( ):
    file = request.files['file']
     
    
    if file:
        file_path = os.path.join(os.path.abspath(os.path.dirname(__file__)),app.config['UPLOAD_FOLDER'],secure_filename(file.filename))
        file.save(file_path)
        print('fichier téléchargé dans l\'API')
        app.config['IMPORTED_FILE_PATH'] = file_path  # Enregistrer le chemin d'accès du fichier importé dans la variable globale
    
    return '', 204


app.register_blueprint(route_import_txt_1388)




app.register_blueprint(route_import_excel_1388)


"""
   
                # Close the cursor and the connection
                cursor.close()
                conn.close()
                return jsonify({'message': 'DUMP importé avec succès'})
        """



app.register_blueprint(route_export_txt_1388)

app.register_blueprint(route_export_excel_1388)


# Route flask pour vider le dossier 'fichiers' des fichiers exportés
@app.route('/vider_dossier_desFichiers', methods=['GET'])
def vider_fichiers():
    dossier_fichiers = app.config['FILE_TO_DOWNLOAD']
    for fichier in os.listdir(dossier_fichiers):
        chemin_fichier = os.path.join(dossier_fichiers, fichier)
        os.remove(chemin_fichier)
    return jsonify({}), 204

#ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo

#Fonction pour l'affichage des tables 
app.register_blueprint(route_affichage_tables)


#aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
app.register_blueprint(route_update_table_1388)



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)