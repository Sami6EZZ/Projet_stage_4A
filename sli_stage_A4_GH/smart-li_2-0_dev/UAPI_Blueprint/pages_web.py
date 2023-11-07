from flask import Blueprint, render_template

navigation = Blueprint("pages_web", __name__)

# routes pour se déplacer entre les différentes pages html
@navigation.route('/')
def page_1():
    return render_template("page_connexion_inscription.html")
#page_connexion_inscription.html page_connexion

@navigation.route('/page_accueil_1388' )
def page_1388():
    return render_template("page_accueil_1388.html")

@navigation.route('/page_connexion' )
def logout():
    # ajouter la commande conn.close pour se déconnecter de la bdd
    return render_template("page_connexion.html")

@navigation.route('/page_inscription' )
def singin():
    return render_template("page_inscription.html")

@navigation.route('/page_affichage_projets' )
def page_projets():
    return render_template("page_affichage_projets.html")


@navigation.route('/page_choix_module' )
def page_normes():
    return render_template("page_choix_module.html")

@navigation.route('/page_options_1388')
def page_options_1388_r():
    return render_template("page_options_1388.html")

@navigation.route('/page_affichage_tables')
def page_table_1_():
    return render_template("page_affichage_tables.html")


@navigation.route('/page_connexion_inscription')
def page_table_2_ioi1388():
    return render_template("page_connexion_inscription.html")