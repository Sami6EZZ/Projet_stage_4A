var nom_utilisateur = localStorage.getItem("nom_utilisateur");
var nom_bdd = localStorage.getItem("nom_bdd");
var mot_de_passe = localStorage.getItem("mot_de_passe");
const host = localStorage.getItem("host");
var nom_projet = localStorage.getItem("nom_projet");

const nom_utilisateur_span = document.getElementById("id_nom_utilisateur");
if (nom_utilisateur) {
  nom_utilisateur_span.textContent = nom_utilisateur;
} else {
  nom_utilisateur_span.textContent = "@";
}

function gen_projet_tables() {
  document.getElementById("image_1388").disabled = true;
  document.body.style.cursor = "progress";
  // jeton JWT récupéré du localStorage et ajouté à l'en-tête "Authorization de la requête du module fetch
	const jeton = localStorage.getItem("jeton");
	if (!jeton) {
		alert("Vous devez d'abord vous connecter !");
		return;
	}

  const data = {
    username: nom_utilisateur,
    mdp: mot_de_passe,
    bdd: nom_bdd,
    host: host,
    projet: nom_projet,
  };
  fetch("/generateur_schema_&_tables_1388", {method: 'POST',
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
      window.location.href = "page_options_1388";
    })
    .catch((erreur) => {
      console.error(erreur);
      window.location.href = "page_options_1388";
    });
  document.getElementById("image_1388").disabled = false;
  document.body.style.cursor = "default";
}


// Relier l'image du module 1388 avec la page 'accueil_1388'
document.getElementById("image_1388").addEventListener("click", function () {
  gen_projet_tables();
});
// Relier l'image du module S3000L avec la page des options
//document.getElementById("image_S3000L").addEventListener("click", function() {
//	window.location.href=('page_options_1388')
//});

// Fonction pour se déconnecter et revenir à la page de connexion
document
  .getElementById("icone_deconnexion")
  .addEventListener("click", function () {
    localStorage.removeItem("nom_utilisateur");
    localStorage.removeItem("nom_projet");
    localStorage.removeItem('mot_de_passe');
    window.location.href = "page_connexion_inscription";
  });
