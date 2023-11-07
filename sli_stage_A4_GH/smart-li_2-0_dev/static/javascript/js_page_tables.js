var nom_utilisateur = localStorage.getItem('nom_utilisateur');
var nom_bdd = localStorage.getItem('nom_bdd');
var mot_de_passe = localStorage.getItem('mot_de_passe');
const host = localStorage.getItem('host');
var nom_projet= localStorage.getItem("nom_projet");
var table_choisie = localStorage.getItem("table_choisie");
var numero_pagination = localStorage.getItem("numero_pagination")
// Récupérer l'élément input
const valeur_pagination = document.getElementById('input_pagination');
if (numero_pagination) {
  valeur_pagination.value = numero_pagination;
}

// Affichage et Animation du nom du projet
document.addEventListener("DOMContentLoaded", function() {
var valeurSpan = document.getElementById("valeurSpan");
var valeurEnregistree = localStorage.getItem("nom_projet");

if (valeurEnregistree) {
valeurSpan.textContent = valeurEnregistree;
} else {
valeurSpan.textContent = "Valeur non disponible";
}
});
document.addEventListener("DOMContentLoaded", function() {
var valeurSpan = document.getElementById("valeurSpan2");
var valeurEnregistree = localStorage.getItem("table_choisie");

if (valeurEnregistree) {
valeurSpan.textContent = valeurEnregistree.toUpperCase();
} else {
valeurSpan.textContent = "Valeur non disponible";
}
});



// fonction affichage de la table


const conn = {
    'username': nom_utilisateur,
    'mdp': mot_de_passe,
    'bdd': nom_bdd,
    'host': host,
    'nom_projet': nom_projet,
    'nom_table': table_choisie,
    };

// fonction du nombre total des pages de pagination

// Mettre à jour le nombre total de pages
// Récupérer l'élément HTML du nombre total de pages
const totalPagesElement = document.querySelector(".total-pages");

// Récupérer le nombre total de pages depuis la route Flask et mettre à jour l'élément HTML
function nbTotal_Pagination() {
  fetch('/get_table_total_pages', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(conn)  
  })
  .then(response => response.json())
  .then(data => {
    const totalPages = data.totalPages;
    totalPagesElement.innerHTML = ` / ${totalPages}`;
    localStorage.setItem('nb_total_pagination', totalPages);
  })
  .catch(error => {
    console.error('Erreur:', error);
    alert('erreur nombre total de pagination');
  });
}

// Exécuter la fonction nbTotal_Pagination lorsque le contenu de la page est chargé
window.addEventListener('DOMContentLoaded', nbTotal_Pagination);


// Fonction  getData appellée lorsque la page se charge
function getData() {
  const jeton = localStorage.getItem("jeton");
  if (!jeton) {
      alert("Vous devez d'abord vous connecter !");
      return;
  }

  const connplus = {
    'username': nom_utilisateur,
    'mdp': mot_de_passe,
    'bdd': nom_bdd,
    'host': host,
    'nom_projet': nom_projet,
    'nom_table': table_choisie,
    'numero_pagination' : numero_pagination
    };
    document.body.style.cursor = "progress";
    // Envoi de la requête POST pour récupérer les données de la table
    fetch('/get_table_data', {method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(connplus)
    })
    .then(response => response.json())// Convertir la réponse en JSON
    .then(table => {
        document.body.style.cursor = "default";
        // Remplissage du tableau HTML avec les données récupérées
        remplissageTable(table);

    })
    .catch(erreur => {
        document.body.style.cursor = "default";
        console.error('Erreur:', erreur);
    });
}

function remplissageTable(table) {
document.body.style.cursor = "progress";
// Sélectionner le tableau et ses éléments d'en-tête et de corps
const element_table = document.querySelector("#data-table");
const tableHead = element_table.querySelector("thead");
const tableBody = element_table.querySelector("tbody");

// Supprimer les anciennes données de la table
tableHead.innerHTML = "";
tableBody.innerHTML = "";

// Ajouter de l'en-tête de la table
const ligne_noms_colonnes = document.createElement("tr");
// Première case : le checkbox
const checkboxHeader = document.createElement("th");
const checkbox = document.createElement("input");
checkbox.type = "checkbox";
checkboxHeader.appendChild(checkbox);
// Ajout de la case dans la table
ligne_noms_colonnes.appendChild(checkboxHeader);
// deuxieme case : la numérotation
const nombreHeader = document.createElement("th"); 
nombreHeader.textContent = "N";
// Ajout de la case dans la table
ligne_noms_colonnes.appendChild(nombreHeader);

//Création et remplissage des cases : noms des colonne /colonneHeader
table.colonnes.forEach(colonne => {
const colonneHeader = document.createElement("th");
colonneHeader.textContent = colonne;
// Ajout de la case dans la table
ligne_noms_colonnes.appendChild(colonneHeader);
});
// Ajout de l'en-tête/header dans la table
tableHead.appendChild(ligne_noms_colonnes);
// afficher la table dans l'ordre croissant de la colonne
table.data.sort((a, b) => {
// Vérifier si la colonne "lsaconxb" existe dans la colonne "lsaconxb"
if (table.colonnes.includes("lsaconxb")) {
    const valueA = a["lsaconxb"] || ""; // Récupérer la valeur de la colonne "lsaconxb" ou une chaîne vide si elle est null
    const valueB = b["lsaconxb"] || ""; // Récupérer la valeur de la colonne "lsaconxb" ou une chaîne vide si elle est null
    return valueA.localeCompare(valueB); // Comparer les valeurs de façon alphabétique
} else {
    return 0; // Si la colonne "lsaconxb" n'existe pas, conserver l'ordre initial
}
});

//Création et remplissage du corps de la table
//ligneData va itérer sur les dictionnaire de la liste 'data'. et ligneIndex contiendra le numéro d'itération
table.data.forEach((ligneData, ligneIndex) => {
  //initialisation de la variable 'ligne' qui contiendra à chaque itération, tous les cases de chaque ligne
const ligne = document.createElement("tr");
const checkboxCase = document.createElement("td");
const checkbox = document.createElement("input");
checkbox.type = "checkbox";
checkboxCase.appendChild(checkbox);
// Ajout de la case  'checkbox' dans la table
ligne.appendChild(checkboxCase);
const numero_ligne_case = document.createElement("td"); // Nouvelle cellule pour la numérotation
numero_ligne_case.textContent = (ligneIndex + 1)+(numero_pagination - 1) * 1000;
numero_ligne_case.classList.add("nombre-ligne");
// Ajout de la case n° dans la table
ligne.appendChild(numero_ligne_case);

table.colonnes.forEach(colonne => {
  // variable pour contenir la valeur de la case 
const cellule = document.createElement("td");
// récupération de la valeur de chaque colonne
const valeurColonne = ligneData[colonne];
const est_numerique = table.colonnesNumeric.includes(colonne);
  // variable pour gérer la valeur de la case 
if (est_numerique) {
    const valeur_case = document.createElement("input");
    valeur_case.type = "number";
    valeur_case.contentEditable = true
    valeur_case.classList.add("case-modifiable");// pour ajouter le style css et  vérifier Si la cellule est éditable
    valeur_case.value = valeurColonne 
    //Cet attribut est utilisé pour stocker la valeur initiale de la colonne avant toute modification
    valeur_case.setAttribute("case-valeur-initiale", parseFloat(valeurColonne) );
    //Ajout de la valeur dans la cellule
    cellule.appendChild(valeur_case);
    //Ajout de la cellule dans la ligne
    ligne.appendChild(cellule);
    // Ajout d'un écouteur d'evenement pour repérer les lignes où des cases ont étaient modifiées
      valeur_case.addEventListener("input", function(e) {
      const ligneModifiee = e.target.closest("tr");
      ligneModifiee.classList.add("edited");
    });
} else {
const caseDiv = document.createElement("div");
caseDiv.contentEditable = true;
caseDiv.classList.add("case-modifiable");// pour ajouter le style css et vérifier Si la cellule est éditable
caseDiv.textContent = valeurColonne
//Cet attribut est utilisé pour stocker la valeur initiale de la colonne avant toute modification
caseDiv.setAttribute("case-valeur-initiale", valeurColonne );
cellule.appendChild(caseDiv);
ligne.appendChild(cellule);
  // Ajout d'un écouteur d'évenement pour repérer les lignes où des cases ont étaient modifiées
  caseDiv.addEventListener("input", function(e) {
  const ligneModifiee = e.target.closest("tr");
  ligneModifiee.classList.add("edited");
});
}

});
//Ajout de la ligne dans la table
tableBody.appendChild(ligne);
});
document.body.style.cursor = "default";
}


// Ajouter un écouteur d'événement sur le bouton 'entrée' à l'input 'pagination'
valeur_pagination.addEventListener('keydown', function(event) {
  var total_pagination = localStorage.getItem('nb_total_pagination');
  // Vérifier si la touche préssée est 'Entrer'
  if (event.key === 'Enter') {
    const numeroPagination = parseInt(valeur_pagination.value);
    
    if (numeroPagination >= 1 && numeroPagination <= total_pagination) {
      localStorage.setItem('numero_pagination', numeroPagination);
    } else if (numeroPagination > total_pagination) {
      localStorage.setItem('numero_pagination', total_pagination);
    } else if (numeroPagination < 1) {
      localStorage.setItem('numero_pagination', 1);
    }
    
    valeur_pagination.value = localStorage.getItem('numero_pagination');
    location.reload();
  }
});

function page_suivante() {

  var total_pagination = localStorage.getItem('nb_total_pagination');
  var numero_pagination = localStorage.getItem('numero_pagination');
  numero_pagination++;
  if (numero_pagination>total_pagination) {
    document.getElementById('bouton_page_suivante').disabled = true;
  }
  else {localStorage.setItem('numero_pagination', numero_pagination);
  valeur_pagination.value = localStorage.getItem('numero_pagination');
  location.reload();
  }
  if (numero_pagination>1) {
    document.getElementById('bouton_page_precedente').disabled = false;
  }

}
function page_precedente() {

  var total_pagination = localStorage.getItem('nb_total_pagination');
  var numero_pagination = localStorage.getItem('numero_pagination');
  numero_pagination--;
  if (numero_pagination<1) {
    document.getElementById('bouton_page_precedente').disabled = true;
  }
  else { localStorage.setItem('numero_pagination', numero_pagination);
  valeur_pagination.value = localStorage.getItem('numero_pagination');
  location.reload();
  }
  if (numero_pagination<total_pagination) {
    document.getElementById('bouton_page_suivante').disabled = false;
  }

}


// Fonction pour mettre à jour la BDD ______________________________________________________________  

function updateTable2() {
document.body.style.cursor = "progress";
const nomsColonnes = getNomsColonnes();
const { lignes_modifiees, valeurs_PK_initiales } = getLignesModifiees();

// Récupérer les informations de connexion et les noms de schéma et de table
const conn = {
'username': nom_utilisateur,
'mdp': mot_de_passe,
'bdd': nom_bdd,
'host': host,
'nom_projet': nom_projet,
'nom_table': table_choisie
};

// Ajouter les lignes modifiées et les valeurs initiales des clés primaires à l'objet de requête
conn.lignes_modifiees = lignes_modifiees;
conn.valeurs_PK_initiales = valeurs_PK_initiales;
conn.nomsColonnes = nomsColonnes;

fetch('/update_table2', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(conn)
})
.then(response => response.json())
  .then(data => {
    document.body.style.cursor = "default";
    if (data.success) {
      // Recharger la page pour afficher la table mise à jour
      window.location.reload();
    } else {
 // Extraire la partie "détail" du message d'erreur
 const erreurMessage = data.erreur.split('DETAIL: ')[1];
 alert('Erreur lors de la mise à jour de la table !' + '\nDETAIL: '+ erreurMessage);
}
  })
  .catch(erreur => {
    document.body.style.cursor = "default";
    console.error('Erreur:', erreur);
  });
}

function getNomsColonnes() {
const table = document.querySelector("#data-table");
const ligne_header = table.querySelector("thead tr");
const colonne_Headers = ligne_header.querySelectorAll("th");

const nom_colonnes = [];

for (let i = 2; i < colonne_Headers.length; i++) {
const nom_colonne = colonne_Headers[i].textContent;
nom_colonnes.push(nom_colonne);
}

return nom_colonnes;
}


function getLignesModifiees() {
  const lignes_modifiees = [];
  const valeurs_PK_initiales = [];
  
  const table = document.querySelector("#data-table"); // Sélectionne le tableau ayant l'ID "data-table"
  const lignes = table.querySelectorAll("tbody tr"); // Sélectionne toutes les lignes du corps du tableau
  
  
  try {
    // Parcourir chaque ligne du tableau
  lignes.forEach(ligne => { 
      // verifiéer si la class css 'édited' est dans le code css de la case
      if (ligne.classList.contains("edited")) {
          const lignesModifiee = [];// Tableau pour stocker les nouvelles valeurs des cellules de la ligne modifiée
          const Valeurs_ligne_initiales = []; // stocker les valeurs initiales des cellules de la ligne modifiée
          const cases = ligne.querySelectorAll("td");// Sélectionne toutes les cellules de la ligne
  
          cases.forEach(cell => {
              const contenant_case = cell.querySelector(".case-modifiable"); //Vérifie si la cellule contient un élément avec la classe "case-modifiee" 
              if (contenant_case !== null) { // Si la cellule est éditable
                 // Récupère la valeur initiale de la cellule à partir de l'attribut "data-initial-value"
                 let case_valeur_initiale = contenant_case.getAttribute("case-valeur-initiale");
                          let case_nouvelle_valeur;
  
                          if (contenant_case.tagName === "INPUT" && contenant_case.type === "number") {
                              case_nouvelle_valeur = parseFloat(contenant_case.value); 
                              case_valeur_initiale = parseFloat(contenant_case.getAttribute("case-valeur-initiale"));
  
                          } else {
                              case_nouvelle_valeur = contenant_case.textContent; 
                          }
  
                          if (case_valeur_initiale !== case_nouvelle_valeur) {
                              lignesModifiee.push(case_nouvelle_valeur);
                          } else {
                              lignesModifiee.push(case_valeur_initiale);
                          }
  
                          Valeurs_ligne_initiales.push(case_valeur_initiale);
                      }
                  });
  
  
          lignes_modifiees.push(lignesModifiee);
          valeurs_PK_initiales.push(Valeurs_ligne_initiales);
      }
  });
  } catch (error) {
  console.error('Erreur dans getModifiedRows():', error.message);
  }
  
  return { lignes_modifiees, valeurs_PK_initiales };
  }
//fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffinnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn

// Appeler la fonction getData lorsque la page se charge
window.addEventListener('DOMContentLoaded', getData);
// changer le nom de la table par une liste déroulante
document.getElementById("labelSpan2").addEventListener("click", function() {

    var dictio_1388 = {
        nn: 'Tables MIL STD 1388-2B',
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
        hg: 'HG : Association article-arborescence',
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
  
  
    var labelSpan2 = document.getElementById('labelSpan2');
    var select = document.getElementById('table_select');
    select.style.display = 'block';
    labelSpan2.style.display = 'none';
  
    select.innerHTML = 'Tables_1388';
    for (var key in dictio_1388) {
      var option = document.createElement('option');
      option.value = key;
      option.text = dictio_1388[key];
      select.appendChild(option);
    }
})
window.addEventListener('click', function(event) {
    var boite_de_dialogue = document.getElementById('labelSpan2');
    var liste_deroulante = document.getElementById('table_select');
  
    if (!boite_de_dialogue.contains(event.target) && !liste_deroulante.contains(event.target) ) {
        document.getElementById('table_select').style.display = 'none';
        document.getElementById('labelSpan2').style.display = 'block';
        
    
      
    } 
  });
  // Écouteur d'événement pour la sélection de ligne dans la liste déroulante
document.getElementById('table_select').addEventListener('change', function() {
    var selectedKey = this.value;
    
    // Enregistrer la clé sélectionnée dans le localStorage
    localStorage.setItem('table_choisie', selectedKey);
    // réinitialiser la valeur de la pagination à 1
    localStorage.setItem('numero_pagination', 1);
    
    // Recharger la page
    location.reload();
  });
  // Fonction pour retourner vers la page des options
document.getElementById("icone_exit").addEventListener("click", function() {
  
  window.location.href=('page_options_1388')
});