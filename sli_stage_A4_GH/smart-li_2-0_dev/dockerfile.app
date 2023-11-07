# Utilisez une image de base contenant Python et Apache Tomcat
FROM python:3.11
# Copiez les fichiers de votre API dans le conteneur
COPY . /app
# Définissez le répertoire de travail
WORKDIR /app
# Installez les dépendances
RUN pip install -r requirements.txt
# Exposez le port sur lequel votre application Flask écoute
EXPOSE 3000

# Démarrez l'application Flask
CMD ["python", "app.py"]