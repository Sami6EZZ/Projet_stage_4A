#class pour se connecter au schema choisi
#class mère
class ReqeteFctory_connexionSchema:
    @staticmethod
    def schemaCible(nom_schema):
        # Cette méthode statique permet de créer une instance de la classe SchemaCible avec le nom de schéma spécifié.
        return SchemaCible(nom_schema)
#class fille
class SchemaCible(ReqeteFctory_connexionSchema):
    def __init__(self, nom_schema):
        # Initialise la classe avec le nom du schéma cible.
        self.nom_schema = nom_schema

    def execute(self, cursor):
        # Utilisation d'une requête paramétrée 
        requete = 'SET search_path TO %s;'
        cursor.execute(requete, (self.nom_schema,))



# class(s) pour créer un nouveau schema. divisé en deux classes distinctes, pour séparer les responsabilités et suivre le principe de responsabilité unique du design SOLID.
class requeteFactory_nouveauSchema:
    @staticmethod
    def requete_nouveau_schema(nom_schema, nom_utilisateur):
        return requete_nouveau_schema(nom_schema, nom_utilisateur)

    @staticmethod
    def requete_autorisations(nom_schema, nom_utilisateur):
        return requete_autorisations(nom_schema, nom_utilisateur)
    
class requete_nouveau_schema(requeteFactory_nouveauSchema):
    def __init__(self,nom_schema, nom_utilisateur):
        self.nom_schema = nom_schema
        self.nom_utilisateur = nom_utilisateur
    
    def execute(self, cursor):
        cursor.execute((f'CREATE SCHEMA "{self.nom_schema}" AUTHORIZATION "{self.nom_utilisateur}";'))


class requete_autorisations(requeteFactory_nouveauSchema):
    def __init__(self,nom_schema, nom_utilisateur):
        self.nom_schema = nom_schema
        self.nom_utilisateur = nom_utilisateur
    
    def execute(self,cursor):
        cursor.execute(f'GRANT ALL PRIVILEGES ON SCHEMA "{self.nom_schema}" TO "{self.nom_utilisateur}";')
        cursor.execute(f'GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA "{self.nom_schema}" TO "{self.nom_utilisateur}";')
        cursor.execute(f'ALTER DEFAULT PRIVILEGES IN SCHEMA "{self.nom_schema}" GRANT ALL PRIVILEGES ON TABLES TO "{self.nom_utilisateur}";')



