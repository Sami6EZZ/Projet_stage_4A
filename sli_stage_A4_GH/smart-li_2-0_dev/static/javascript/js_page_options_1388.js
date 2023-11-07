var nom_utilisateur = localStorage.getItem('nom_utilisateur');
var nom_bdd = localStorage.getItem('nom_bdd');
var mot_de_passe = localStorage.getItem('mot_de_passe');
const host = localStorage.getItem('host');


// Code JS pour les blocs
// Récupère tous les éléments de classe "bloc"
var options = document.getElementsByClassName("bloc");

// Parcourt chaque élément "child"
for (var i = 0; i < options.length; i++) {
    // Ajoute un gestionnaire d'événements click à chaque élément "child"
    options[i].addEventListener("click", function() {
        // Sauvegarde la référence à l'élément "child" dans une variable pour l'utiliser dans la fonction de temporisation
        var option = this;

        // Supprime le box-shadow en ajoutant une classe "remove-box-shadow"
        option.classList.add("clicked");

        // Utilise la fonction setTimeout pour rétablir le style initial après 2 secondes
        setTimeout(function() {
            // Supprime la classe "remove-box-shadow" pour réactiver le style initial
            option.classList.remove("clicked");
        }, 150);
    });
}

// Affichage et Animation du nom du projet
document.addEventListener("DOMContentLoaded", function() {
    var valueSpan = document.getElementById("valeurSpan");
    var storedValue = localStorage.getItem("nom_projet");
  
    if (storedValue) {
      valueSpan.textContent = storedValue;
    } else {
      valueSpan.textContent = "Valeur non disponible";
    }
  });


// Fonction d'importation des données


//Script JavaScript pour intercepter l'événement de changement de fichier et soumettre automatiquement le formulaire -->
	// Sélection du formulaire et du champ de fichier avec JavaScript
	const uploadForm = document.querySelector('#upload-form');


function choix_fichier_import_dump_txt_Excel_1388() {
  document.getElementById('import_txt_btn').disabled = true;
  // jeton JWT récupéré du localStorage et ajouté à l'en-tête "Authorization de la requête du module fetch
	const jeton = localStorage.getItem("jeton");
  if (!jeton) {
      alert("Vous devez d'abord vous connecter !");
      return;
  }
  	// Récupération du champ d'entrée pour le fichier
	var fileInput = document.getElementById("file");
  // Récupération du fichier sélectionné
  var file = fileInput.files[0];
        
        // Vérification du type de fichier
        if (file.type === "text/plain") {
			      // Appel de la méthode "submit()" du formulaire pour soumettre automatiquement le formulaire         
            submitForm().then(() => {
              import_dump_txt_1388();
            });
            
            
          }
         else if (file.type === "application/vnd.ms-excel" || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            // Appel de la méthode "submit()" du formulaire pour soumettre automatiquement le formulaire
            submitForm().then(() => {
              import_dump_Excel_1388();
            });
        } else {
          document.getElementById('import_txt_btn').classList.add('btn-erreur');

        }
    }
    function submitForm() {
      
      return new Promise((resolve) => {
        // Crée une nouvelle instance de l'objet XMLHttpRequest
        var xhr = new XMLHttpRequest();

        // Ouvre une connexion en configurant la méthode HTTP et l'URL de destination
        xhr.open(uploadForm.method, uploadForm.action, true);

        // Définit le gestionnaire d'événement onload qui sera appelé lorsque la requête sera terminée
        xhr.onload = function () {
        resolve(); // Résout la promesse pour indiquer que la requête est terminée avec succès
        };

        // Envoie le formulaire en utilisant l'objet FormData
        xhr.send(new FormData(uploadForm));
      });
    }
	function import_dump_txt_1388() {
    const jeton = localStorage.getItem("jeton");
    if (!jeton) {
        alert("Vous devez d'abord vous connecter !");
        return;
    }
			// Ajouter l'indicateur de chargement
			var loader = document.createElement('div');
			loader.classList.add('loader');
      // placer  l'indicateur de chargement devant le bouton
			document.getElementById('import_txt_btn').insertAdjacentElement('afterend', loader);

			// Lancer la requête Flask
			var nom_projet = localStorage.getItem('nom_projet');
			const conn = {
          'username': nom_utilisateur,
          'mdp': mot_de_passe,
          'bdd': nom_bdd,
				  'host': host,
				  'nom_projet': nom_projet
			};
		fetch('/import_txt_1388', {method: 'POST',
    headers: { 'Content-Type': 'application/json',
          'Authorization': `Bearer ${jeton}` },
    body: JSON.stringify(conn)
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      return response.json().then(json => Promise.reject(json));
    }
  })
  .then(data => {
    // Supprimer l'indicateur de chargement
    loader.remove();
    document.getElementById('import_txt_btn').disabled = false;
    //document.getElementById("messageimport1388txt").innerHTML =data.message;
     // Afficher l'image check
    var image = document.createElement('img');
    image.src ='static/images/image_check_verte.png'; 
    image.classList.add('image-animation');
    document.getElementById('import_txt_btn').insertAdjacentElement('afterend', image);
    image.style.display = 'block';
    
    if (Object.keys(data.liste_erreur).length>0) {
    
      bloc_erreur = document.createElement('div');
      bloc_erreur.classList.add('bloc_erreur');
      for (const table_x in data.liste_erreur) {
        if (data.liste_erreur.hasOwnProperty(table_x)) {
          var table_h = document.createElement('h3');
          table_h.textContent = 'Erreur dans la table ** TABLE_' + table_x + ' **';

          bloc_erreur.appendChild(table_h);
          console.log(table_x);

          var liste_erreur = document.createElement('ul');
          liste_erreur.classList.add('liste_erreur');
          
        
          data.liste_erreur[table_x].forEach(erreur => {
            var requete_x = document.createElement('li');
            requete_x.textContent =`Erreur: ${erreur.erreur}, Requête: ${erreur.requete}, Ligne: ${erreur.ligne}`;
            liste_erreur.appendChild(requete_x);
          });

          bloc_erreur.appendChild(liste_erreur);
        }
      }
      var ajou_err = document.querySelector('.btn-impo');
      ajou_err.insertAdjacentElement('afterend', bloc_erreur);
    } else {
      setTimeout(function() {
        image.remove();
        fermerImpoDialog();
        }, 1500);
      }

  })
      .catch(erreur => {
        console.error(erreur);
				// Supprimer l'indicateur de chargement
				loader.remove();
        document.getElementById('import_txt_btn').disabled = false;
        //document.getElementById("messageimport1388txt").innerHTML =error.message;
        // Changer la couleur du bouton en rouge
        document.getElementById('import_txt_btn').classList.add('btn-erreur');

      });
	}

	function import_dump_Excel_1388() {
    const jeton = localStorage.getItem("jeton");
  if (!jeton) {
      alert("Vous devez d'abord vous connecter !");
      return;
  }

			// Ajouter l'indicateur de chargement
			var loader = document.createElement('div');
			loader.classList.add('loader');
			document.getElementById('import_txt_btn').insertAdjacentElement('afterend', loader);
			document.getElementById('import_txt_btn').disabled = true;

			// Lancer la requête Flask

			var nom_projet = localStorage.getItem('nom_projet');
			const conn = {
                'username': nom_utilisateur,
                'mdp': mot_de_passe,
                'bdd': nom_bdd,
				'host': host,
				'nom_projet': nom_projet
			};
		fetch('/import_Excel_1388',{method: 'POST',
    headers: { 'Content-Type': 'application/json',
          'Authorization': `Bearer ${jeton}` },
    body: JSON.stringify(conn)
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      return response.json().then(json => Promise.reject(json));
    }
  })
  .then(data => {
    // Supprimer l'indicateur de chargement
    loader.remove();
    document.getElementById('import_txt_btn').disabled = false;
    //document.getElementById("messageimport1388txt").innerHTML =data.message;
     // Afficher l'image check
    var image = document.createElement('img');
    image.src ='static/images/image_check_verte.png'; 
    image.classList.add('image-animation');
    document.getElementById('import_txt_btn').insertAdjacentElement('afterend', image);
    image.style.display = 'block';
    

    if (Object.keys(data.liste_erreur).length>0) {
    
      bloc_erreur = document.createElement('div');
      bloc_erreur.classList.add('bloc_erreur');
      for (const table_x in data.liste_erreur) {
        if (data.liste_erreur.hasOwnProperty(table_x)) {
          var table_h = document.createElement('h3');
          table_h.textContent = 'Erreur dans la table ** TABLE_' + table_x + ' **';

          bloc_erreur.appendChild(table_h);
          console.log(table_x);

          var liste_erreur = document.createElement('ul');
          liste_erreur.classList.add('liste_erreur');
          
        
          data.liste_erreur[table_x].forEach(erreur => {
            var requete_x = document.createElement('li');
            requete_x.textContent =`Erreur: ${erreur.erreur}, Requête: ${erreur.requete}, Ligne: ${erreur.ligne}`;
            liste_erreur.appendChild(requete_x);
          });

          bloc_erreur.appendChild(liste_erreur);
        }
      }
      var ajou_err = document.querySelector('.btn-impo');
      ajou_err.insertAdjacentElement('afterend', bloc_erreur);
    } else {
      setTimeout(function() {
        image.remove();
        fermerImpoDialog();
        }, 1500);
      }

  })
      .catch(erreur => {
        console.error(erreur);
				// Supprimer l'indicateur de chargement
				loader.remove();
        document.getElementById('import_txt_btn').disabled = false;
        //document.getElementById("messageimport1388txt").innerHTML =error.message;
        // Changer la couleur du bouton en rouge
        document.getElementById('import_txt_btn').classList.add('btn-erreur');

      });

	}
// Fonction pour vider les tables
function vider_tables () {
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


  fetch('/vider_tables',{method: 'POST',
  headers: { 'Content-Type': 'application/json',
        'Authorization': `Bearer ${jeton}` },
  body: JSON.stringify(conn)
})
.then(response => {
  if (response.ok) {
    return response.json();
  } else {
    return response.json().then(json => Promise.reject(json));
  }
})
  .then(data => {
    // Affichage du message retourné dans une fenêtre contextuelle
    alert(data.message);
    
  })
  .catch(erreur => {
    // En cas d'erreur, affichage du message d'erreur dans une fenêtre contextuelle
    alert('Erreur : ' + erreur.message);
  });
  }
  
 //JS poUr le popup pour vider les tables

// Fonction du popup pour vider un projet

function Popup_Vider_Table() {
  var nom_projet = localStorage.getItem('nom_projet');
	localStorage.setItem('nom_projet', nom_projet);
	document.getElementById('popup_vider').style.display = 'block';
	document.getElementById('nom_projet_a_supp').textContent =nom_projet ;
  }

  function fermerPopupViderTable() {
	document.getElementById('popup_vider').style.display = 'none';
  }

  function annulerVider() {
	// Aucune action à effectuer lors de l'annulation de la suppression
	fermerPopupViderTable();
  }

  function confirmeVider() {
		// Action à effectuer lors de la confirmation de la suppression
		fermerPopupViderTable();
    vider_tables()
	
	
  }

  window.addEventListener('click', function(event) {
    var boite_de_dialogue = document.getElementById('popup_vider_table');
    var bouton_vider = document.getElementById('btn-vider');
  
    if (!boite_de_dialogue.contains(event.target) && !bouton_vider.contains(event.target) ) {
      fermerPopupViderTable();
	}
  });




         //JS poUr le popup d'importation
// Relier l'image 'Import' avec le pop-up '
document.getElementById("bloc_import").addEventListener("click", function() {
	ouvrirImpoDialog()
});

  //POP-UP 1
  // Ouvrir le popup d'importation
function ouvrirImpoDialog() {
	document.getElementById('arriere_plan_popup_impo').style.display = 'block';
	}

// Fermer le popup d'importation
function fermerImpoDialog() {
  
	document.getElementById('arriere_plan_popup_impo').style.display = 'none';
	}

  
  // Fermer la boîte de dialogue si on clic  en dehors du cadre de la boite de dialogue
window.addEventListener('click', function(event) {
    var impo_popup = document.getElementById('impo_popup');
    var image_impo = document.getElementById('bloc_import');
    
    if (!impo_popup.contains(event.target) && !image_impo.contains(event.target)) {
        fermerImpoDialog();
    } 
    });




//POP-UP 2
// Ouvrir la boîte de dialogue pour choisir la table
document.getElementById('bloc_tables').addEventListener('click', function() {
  ouvrirTableDialog()
  
});

// Fonction pour ouvrir la boîte de dialogue
function ouvrirTableDialog() {
  document.getElementById('arriere_plan_popup_tables').style.display = 'block';
  remplirTableOptions();
}

// Fermer la boîte de dialogue
function fermerTableDialog() {
  document.getElementById('arriere_plan_popup_tables').style.display = 'none';
}

// Remplir les options de la liste déroulante avec les clés et les valeurs d'un dictionnaire
function remplirTableOptions() {
  var dictionary = {
    xa: 'XA : Projets',
    xb: 'XB : Arborescence logistique',
    xc: 'XC : Configurations',
    xd: 'XD : Description de la table "xd"',
    xe: 'XE : Description de la table "xe"',
    xf: 'XF : Association candidats log.-conf',
    xg: 'XG : Description de la table "xg"',
    xh: 'XH : Description de la table "xh"',
    xi: 'XI : Description de la table "xi"',
    ha: 'HA : Base articles',
    hb: 'HB : Description de la table "hb"',
    hc: 'HC : Description de la table "hc"',
    hd: 'HD : Description de la table "hd"',
    he: 'HE : Description de la table "he"',
    hf: 'HF : Description de la table "hf"',
    hg: 'HG : Association aticle-arborescence',
    hh: 'HH : Description de la table "hh"',
    hi: 'HI : Description de la table "hi"',
    hj: 'HJ : Description de la table "hj"',
    hk: 'HK : Description de la table "hk"',
    hl: 'HL : Description de la table "hl"',
    hm: 'HM : Description de la table "hm"',
    hn: 'HN : Description de la table "hn"',
    ho: 'HO : Description de la table "ho"',
    hp: 'HP : Description de la table "hp"',
    hq: 'HQ : Description de la table "hq"',
    hr: 'HR : Description de la table "hr"',
    ca: 'CA : Base tâches',
    cb: 'CB : Sous tâches',
    cc: 'CC : Description de la table "cc"',
    cd: 'CD : Association opérateur-tâche',
    ce: 'CE : Description de la table "ce"',
    cf: 'CF : Description de la table "cf"',
    cg: 'CG : Association EdS - tâche',
    ch: 'CH : Description de la table "ch"',
    ci: 'CI : Association recharge-tâche',
    cj: 'CJ : Description de la table "cj"',
    ck: 'CK : Description de la table "ck"',
    ga: 'GA : Description de la table "ga"',
    gb: 'GB : Description de la table "gb"',
    gc: 'GC : Description de la table "gc"',
    gd: 'GD : Description de la table "gd"',
    ge: 'GE : Description de la table "ge"',
    aa: 'AA : Description de la table "aa"',
    ab: 'AB : Description de la table "ab"',
    ac: 'AC : Description de la table "ac"',
    ad: 'AD : Description de la table "ad"',
    ae: 'AE : Description de la table "ae"',
    af: 'AF : Description de la table "af"',
    ag: 'AG : Description de la table "ag"',
    ah: 'AH : Description de la table "ah"',
    ai: 'AI : Description de la table "ai"',
    aj: 'AJ : Description de la table "aj"',
    ak: 'AK : Description de la table "ak"',
    ba: 'BA : Description de la table "ba"',
    bb: 'BB : Description de la table "bb"',
    bc: 'BC : Description de la table "bc"',
    bd: 'BD : Description de la table "bd"',
    be: 'BE : Description de la table "be"',
    bf: 'BF : Description de la table "bf"',
    bg: 'BG : Description de la table "bg"',
    bh: 'BH : Description de la table "bh"',
    bi: 'BI : Description de la table "bi"',
    bj: 'BJ : Description de la table "bj"',
    bk: 'BK : Description de la table "bk"',
    bl: 'BL : Description de la table "bl"',
    ea: 'EA : Equipements de soutien',
    eb: 'EB : Description de la table "eb"',
    ec: 'EC : Description de la table "ec"',
    ed: 'ED : Description de la table "ed"',
    ee: 'EE : Description de la table "ee"',
    ef: 'EF : Description de la table "ef"',
    eg: 'EG : Description de la table "eg"',
    eh: 'EH : Description de la table "eh"',
    ei: 'EI : Description de la table "ei"',
    ej: 'EJ : Description de la table "ej"',
    ek: 'EK : Description de la table "ek"',
    el: 'EL : Description de la table "el"',
    em: 'EM : Description de la table "em"',
    ua: 'UA : Description de la table "ua"',
    ub: 'UB : Description de la table "ub"',
    uc: 'UC : Description de la table "uc"',
    ud: 'UD : Description de la table "ud"',
    ue: 'UE : Description de la table "ue"',
    uf: 'UF : Description de la table "uf"',
    ug: 'UG : Description de la table "ug"',
    uh: 'UH : Description de la table "uh"',
    ui: 'UI : Description de la table "ui"',
    uj: 'UJ : Description de la table "uj"',
    uk: 'UK : Description de la table "uk"',
    ul: 'UL : Description de la table "ul"',
    um: 'UM : Description de la table "um"',
    un: 'UN : Description de la table "un"',
    fa: 'FA : Description de la table "fa"',
    fb: 'FB : Description de la table "fb"',
    fc: 'FC : Description de la table "fc"',
    fd: 'FD : Description de la table "fd"',
    fe: 'FE : Description de la table "fe"',
    ja: 'JA : Description de la table "ja"',
    jb: 'JB : Description de la table "jb"',
    jc: 'JC : Description de la table "jc"',
    jd: 'JD : Description de la table "jd"',
    je: 'JE : Description de la table "je"',
    jf: 'JF : Description de la table "jf"'
    
  };

  var tableSelect = document.getElementById('table_select');
  tableSelect.innerHTML = 'Tables_1388...';
  for (var key in dictionary) {
      //crée un nouvel élément option et configure sa propriété 'value' avec la clé et sa propriété 'text' avec la valeur correspondante du dictionnaire
    var option = document.createElement('option');
    option.value = key;
    option.text = dictionary[key];
    tableSelect.appendChild(option);
  }
}

// Soumettre le formulaire de sélection de table
function confirmeTable() {
  event.preventDefault();
  var tableSelectionee = document.getElementById('table_select').value;

  if (tableSelectionee !== 'Tables_1388...') {
    // Enregistrer la valeur sélectionnée dans le localStorage pour une utilisation ultérieure
    localStorage.setItem('table_choisie', tableSelectionee);
    // Fermer la boîte de dialogue
    fermerTableDialog();
    // Effectuer des actions supplémentaires avec la table choisie
    // ...
    localStorage.setItem('numero_pagination', 1); 
    window.location.href ="page_affichage_tables";
  } else {
    alert('Veuillez sélectionner une table !');
  }
}
// Fermer la boîte de dialogue si on clique  en dehors du cadre de la boite de dialogue
window.addEventListener('click', function(event) {
      var boite_de_dialogue = document.getElementById('popup_tables');
      var bouton_tables = document.getElementById('bloc_tables');

      if (!boite_de_dialogue.contains(event.target) && !bouton_tables.contains(event.target) ) {
          fermerTableDialog();
      } 
      });



      //  3ème POP-UP OOOOOOOOOOO


      // Relier l'image 'Export' avec le pop-up '
      document.getElementById("bloc_export").addEventListener("click", function() {
        ouvrirPopupExpo()
      });

      function ouvrirPopupExpo() {
        document.getElementById('arriere_plan_popup_expo').style.display = 'block';
      }
      
      function fermerPopupExpo() {
        document.getElementById('arriere_plan_popup_expo').style.display = 'none';
      }
      
      window.addEventListener('click', function(event) {
        var boite_de_dialogue = document.getElementById('popup_expo');
        var image_export = document.getElementById('bloc_export');
      
        if (!boite_de_dialogue.contains(event.target) && !image_export.contains(event.target) ) {
          fermerPopupExpo();
        } 
      });

      // Fonction Export TXT et EXCEL
  
//Ajouter une annimation apres le clic sur chaque bouton

document.getElementById("icone_txt").addEventListener("click", function() {
  var shadox = document.getElementById('icone_txt')
  shadox.classList.add("clicked")
  setTimeout(function() {
    // Supprime la classe "remove-box-shadow" pour réactiver le style initial
    shadox.classList.remove("clicked");
}, 150);

});
document.getElementById("icone_excel").addEventListener("click", function() {
  var shadox = document.getElementById('icone_excel')
  shadox.classList.add("clicked")
  setTimeout(function() {
    // Supprime la classe "remove-box-shadow" pour réactiver le style initial
    shadox.classList.remove("clicked");
}, 150);

});

// Relier l'image 'TXT' avec la fonction export_fichier_txt_1388 '
document.getElementById("icone_txt").addEventListener("click", function() {
  document.body.style.cursor = "progress";
  document.getElementById('icone_txt').disabled = true;
  export_fichier_txt_1388()
});

// Relier l'image 'EXCEL' avec la fonction export_fichier_Excel_1388 '
document.getElementById("icone_excel").addEventListener("click", function() {
  document.body.style.cursor = "progress";
  document.getElementById('icone_excel').disabled = true;
  export_fichier_Excel_1388()
});






      function export_fichier_txt_1388() {
        const jeton = localStorage.getItem("jeton");
  if (!jeton) {
      alert("Vous devez d'abord vous connecter !");
      return;
  }

        var nom_projet = localStorage.getItem('nom_projet');
        const conn = {
                  'username': nom_utilisateur,
                  'mdp': mot_de_passe,
                  'bdd': nom_bdd,
          'host': host,
          'nom_projet': nom_projet
        };
  
      fetch('/export_txt_1388', {method: 'POST',
			headers: { 'Content-Type': 'application/json',
						'Authorization': `Bearer ${jeton}` },
			body: JSON.stringify(conn)
		})
		.then(response => {
			if (response.ok) {
        document.body.style.cursor = "default";
        return response.blob();
      }
			else {
				return response.json().then(json => Promise.reject(json));
			}
		})
            
          .then(blob => {
              const url = window.URL.createObjectURL(new Blob([blob]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', nom_projet + '_Fichier_Smart-LI.txt');
              document.body.appendChild(link);
              link.click();
              vider_dossier_desFichiers ()
          })
          .catch(error => {
            document.body.style.cursor = "default";
            console.error(error);
            alert(error.message);
            
            
          });
          document.getElementById('icone_txt').disabled = false;
    }
    
  
    function export_fichier_Excel_1388() {
      const jeton = localStorage.getItem("jeton");
      if (!jeton) {
          alert("Vous devez d'abord vous connecter !");
          return;
      }

      var nom_projet = localStorage.getItem('nom_projet');
      const conn = {
        'username': nom_utilisateur,
        'mdp': mot_de_passe,
        'bdd': nom_bdd,
        'host': host,
        'nom_projet': nom_projet
      };
  
      fetch('/export_Excel_1388', {method: 'POST',
			headers: { 'Content-Type': 'application/json',
						'Authorization': `Bearer ${jeton}` },
			body: JSON.stringify(conn)
		})
		.then(response => {
			if (response.ok) {
        document.body.style.cursor = "default";
        return response.blob();
      }
			else {
				return response.json().then(json => Promise.reject(json));
			}
		})
    .then(blob => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', nom_projet + '_Fichier_Smart-LI.xlsx');
      document.body.appendChild(link);
      link.click();
      vider_dossier_desFichiers ()
      })

    .catch(erreur => {
        document.body.style.cursor = "default";
        console.error(erreur);
        alert(erreur.message);
        
      });
      document.getElementById('icone_excel').disabled = false;
    }


    // Fonction pour se déconnecter et revenir à la page de connexion
document.getElementById("icone_deconnexion").addEventListener("click", function() {
  localStorage.removeItem('nom_utilisateur');
  localStorage.removeItem('nom_projet');
  localStorage.removeItem('mot_de_passe');
  window.location.href=('page_connexion_inscription')
});
// Fonction pour revenir à la page d'accueil
document.getElementById("icone_accueil").addEventListener("click", function() {
  window.location.href=('page_affichage_projets')
});
  
    // Fonction pour vider le dossier 'fichiers' des fichiers exporté
    function  vider_dossier_desFichiers () {
      fetch('/vider_dossier_desFichiers', 
        {method: 'GET'});
    }


   