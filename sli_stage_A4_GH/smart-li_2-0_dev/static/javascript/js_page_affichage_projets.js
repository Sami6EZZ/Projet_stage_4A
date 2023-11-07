
var nom_utilisateur = localStorage.getItem('nom_utilisateur');
var mot_de_passe = localStorage.getItem('mot_de_passe');
var nom_bdd = localStorage.getItem('nom_bdd');
const host = localStorage.getItem('host');

const nom_utilisateur_span = document.getElementById('id_nom_utilisateur');
if (nom_utilisateur) {
	nom_utilisateur_span.textContent = nom_utilisateur;
}
else {	nom_utilisateur_span.textContent = "@None"}

const data = {
			'username': nom_utilisateur,
			'mdp': mot_de_passe,
			'bdd': nom_bdd,
			'host': host
		};

// Ouvrir la boîte de dialogue pour créer un nouveau projet
function ouvrirDialog() {
	document.getElementById('nom_projet').style.display = 'block';
	}

// Fermer la boîte de dialogue
function fermerDialog() {
	document.getElementById('nom_projet').style.display = 'none';
	}

// Soumettre le formulaire
function nouveau_projet() {
	
	var inputValue = document.getElementById('nom_nouveau_projet').value;
	
	// Enregistrer la valeur saisie dans le stockage local
	localStorage.setItem('nom_projet', inputValue);
	// Fermer la boîte de dialogue
	fermerDialog();
	// Rediriger vers une autre page (page_2normes)
	window.location.href = 'page_choix_module';
	
	}
function affichage_projets(){
	// jeton JWT récupéré du localStorage et ajouté à l'en-tête "Authorization de la requête du module fetch
	const jeton = localStorage.getItem("jeton");
            if (!jeton) {
                alert("Vous devez d'abord vous connecter !");
                return;
            }
// Méthode fetch pour afficher la liste des projets enregistrés dans la bdd
fetch('/liste_schemas', {method: 'POST',
			headers: { 'Content-Type': 'application/json',
						'Authorization': `Bearer ${jeton}` },
			body: JSON.stringify(data)
		})
		.then(response => {
			if (response.ok) {
				return response.json();
			} else {
				return response.json().then(json => Promise.reject(json));
			}
		})
		.then((data) => {
		data.schemas.forEach((schema) => {
			const bouton_copie = document.createElement("div");
			bouton_copie.classList.add("bouton_copie");
			const button = document.createElement("button");
			const buttonText = document.createElement("span");
			const image = document.createElement("img");
			image.src = "static/images/image_sous_nom_projet.png";
			const Icone_X = document.createElement("span");
			Icone_X.classList.add("icone_X");
			Icone_X.textContent = '×';
			
			let maxChars = 20;
			if (schema.length > 20 && schema.length <= 30) {
			buttonText.style.fontSize = "16px"; // diminuer la font size pour les chaînes de caractères entre 20 et 30
			} else if (schema.length > 30) {
			buttonText.style.fontSize = "14px"; // diminuer la font size pour les chaînes de caractères supérieures à 30
			maxChars = 27; // tronquer le texte à 27 caractères
			}
			const truncatedText =
			schema.substring(0, maxChars) + (schema.length > maxChars ? "..." : "");
			buttonText.textContent = truncatedText;
			button.addEventListener("click", () => {
			// la fonction ci-dessous sera liée à chaque nom de projet/bouton ajouté
			fonction_bouton_projet(schema);
			});
			Icone_X.addEventListener("click", (event) => {
				event.stopPropagation();// Empêche la propagation du clic sur l'icône au bouton parent
				Popup_suppression(schema);
			  });
			  button.addEventListener("mouseover", () => {
				bouton_copie.style.boxShadow = '0px 0px 30px cyan';
				
			  });
		  
			  button.addEventListener("mouseout", () => {
				bouton_copie.style.boxShadow = '0 0 0';
			  });
			  Icone_X.addEventListener("mouseover", () => {
				bouton_copie.style.boxShadow = '0 0 5px cyan';
				button.style.boxShadow = '0px 0px 40px red';
			  });
		  
			  Icone_X.addEventListener("mouseout", () => {
				button.style.boxShadow = '0 0 0';
			  });

			
			button.appendChild(buttonText);
			button.appendChild(image);
			button.appendChild(Icone_X);// Ajout de l'icône de poubelle au bouton
    		//button.appendChild(tooltip); // Ajout de l'infobulle/tooltip
			bouton_copie.appendChild(button);
			bloc_principal.appendChild(bouton_copie);
		});
		})
		.catch(erreur => {
			console.error(erreur.message);
		});
	}


// fonction lier au labels des projets
function fonction_bouton_projet(nom_projet) {
	// Enregistrer le nom du projet choisi dans le stockage local
	localStorage.setItem('nom_projet', nom_projet);
	// Rediriger vers une autre page (page_2normes)
	window.location.href = 'page_options_1388';

}

window.addEventListener('DOMContentLoaded', affichage_projets)
// Fermer la boîte de dialogue si on clic  en dehors du cadre de la boite de dialogue
window.addEventListener('click', function(event) {
var boite_de_dialogue = document.getElementById('boite_dialogue');
var bouton_plus = document.getElementById('bouton_plus');

if (!boite_de_dialogue.contains(event.target) && event.target !== bouton_plus) {
	fermerDialog();
} 
});


// Fonction du popup de suppression d'un projet

function Popup_suppression(nom_projet) {
	localStorage.setItem('nom_projet', nom_projet);
	document.getElementById('popup').style.display = 'block';
	document.getElementById('nomProjetPopup').textContent =nom_projet ;
  }

  function fermerPopup() {
	document.getElementById('popup').style.display = 'none';
  }

  function annulerSuppression () {
	// Aucune action à effectuer lors de l'annulation de la suppression
	fermerPopup();
  }

  function confirmerSuppression() {
		// Action à effectuer lors de la confirmation de la suppression
		fermerPopup();
		// jeton JWT récupéré du localStorage et ajouté à l'en-tête "Authorization de la requête du module fetch
		const jeton = localStorage.getItem("jeton");
		if (!jeton) {
			alert("Vous devez d'abord vous connecter !");
			return;
		}
	
		var nom_projet = localStorage.getItem('nom_projet');
		const conn = {
		  'username': nom_utilisateur,
		  'mdp': mot_de_passe,
		  'bdd': nom_utilisateur,
		  'host': host,
		  'nom_projet': nom_projet
		};
	  
		fetch('/supprimer_projet', {
		  method: 'POST',
		  headers: { 'Content-Type': 'application/json' ,
		  			'Authorization': `Bearer ${jeton}`},
		  body: JSON.stringify(conn)
		})
		.then(response => {
		  if (response.ok) {
			// Suppression réussie, rechargement de la page
			window.location.reload();
		  } else {
			throw new Error('Erreur lors de la suppression du schéma');
		  }
		})
		.catch(error => {
		  console.error(error);
		});
	  
	  

	
  }

  window.addEventListener('click', function(event) {
	var popup_supp = document.getElementById('popup_suppression');
	var icone_fermer = document.getElementsByClassName('icone_X')[0]

	if (!popup_supp.contains(event.target) && !icone_fermer.contains(event.target)) {
	  fermerPopup();
	}
  });

  // Fonction pour se déconnecter et revenir à la page de connexion
document.getElementById("icone_deconnexion").addEventListener("click", function() {
	localStorage.removeItem('nom_utilisateur');
	localStorage.removeItem('nom_projet');
	localStorage.removeItem('mot_de_passe');
	window.location.href=('page_connexion_inscription')
  });

  