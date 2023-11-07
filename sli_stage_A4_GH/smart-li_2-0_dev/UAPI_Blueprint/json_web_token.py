import jwt
from flask import request, jsonify, current_app


# Fonction pour vérifier le jeton JWT
def verif_jeton(jeton):
    try:
        payload = jwt.decode(jeton, current_app.config['CLE_ID'], algorithms=["HS256"])
        return True
    except jwt.ExpiredSignatureError:
        return False
    except jwt.InvalidTokenError:
        return False

# Décorateur personnalisé pour vérifier le jeton avant d'exécuter la fonction de la route
def jeton_existe(func):
    def decorateur(*args, **kwargs):
        jeton = request.headers.get("Authorization")
        if not jeton:
            return jsonify({"message": "Token manquant"}), 401

        # Vérification du jeton
        if not verif_jeton(jeton.split()[1]):  # Supprimez le mot "Bearer" de l'en-tête
            return jsonify({"message": "Token invalide"}), 401

        # Si le jeton est valide, exécutez la fonction de la route
        return func(*args, **kwargs)
    return decorateur
