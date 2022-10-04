//LS:CETTE FONCTION SAUVE UN TABLEAU D'OBJETS {ID,QTE,COULEUR} DANS LE LS AU FORMAT TXT
function savePanier(Panier) {
  //Panier est un tableau d'objet JSON indice: 0 valeur: {Id,qte,couleur}
  localStorage.setItem("Datakanap", JSON.stringify(Panier)); //on sauve un Panier txt
}
//LS:CETTE FONCTION EXTRAIT LE PANIER ACTUEL DU LOCALSTORAGE ET LE TRANSFORME EN TABLEAU D OBJET JSON
function recupPanier() {
  let panierRecup = localStorage.getItem("Datakanap"); //panierRecup est un txt
  if (panierRecup == null) {
    document.getElementById("cart__items").textContent =
      "Votre panier est vide";
    // Si le panier ne contient aucun article on ne fait pas apparaître le formulaire contact utilisateur
    document.querySelector(".cart__order__form").style.display = "none";
    return [];
  } else {
    return JSON.parse(panierRecup); //on recupere un tableau d'objet JSon ex: indice 0 {Id,qte,couleur}
  }
}
//LS:CETTE FONCTION AJOUTE L ARTICLE CLICKER DANS LE LS, SAUF S IL EXISTE DEJA, DANS CE CAS LA FONCTION MET A JOUR SA QUANTITE
function ajoutAuPanier({ id, qte, color }) {
  // 1 arg objet  avec 3 propriété
  // console.log(id);//ok
  let PanierA = recupPanier(); //on recupère le tableau  d'objets du panier [clé:0, valeur:{id:"id",qte:"quantité",color:"couleur"}] dans localStorage au format Json
  console.log(PanierA);
  let memeProduit = PanierA.find((p) => p._id == id && p.color == color);
  if (memeProduit != undefined) {
    //on ajoute la quantite en arg de ajoutAuPanier à la qte initiale
    memeProduit.quantity =
      parseInt(memeProduit.quantity, 10) + parseInt(qte, 10);
    //parseInt(string,10) transforme une string en nombre en base 10 (base 10 par défaut, pas obligé de le mettre)
  } else {
    PanierA.push({ id, qte, color });
  }
  savePanier(PanierA);
}

//DANS CETTE FONCTION, POUR CHAQUE OBJET DU PANIER, ON CREER UN ARTICLE DANS LE DOM POUR L AFFICHER, ON ECOUTE LE CLICK SUR SUPPRIMER
//ET LA MODIF DE QUANTITE ET ON LES GERE en cas de click.
function affichePanier() {
  let Panier = recupPanier();
  let prixTotal = 0;
  let qteTotale = 0;
  for (let idQteColor of Panier) {
    //pour chaque article du panier:
    //on recupere chaque objet à afficher au panier dans l'api à partir de son id:
    let myPromise = fetch(
      "http://localhost:3000/api/products/" + idQteColor.id
    ); //le résultat de la promesse contient l'article voulu au format ?
    myPromise
      .then(function (result) {
        if (result) {
          return result.json(); //on convertit l'objet au format Json
        }
      })
      .then((ProductJson) => {
        //-----------------------------------------------CREATION D UN ARTICLE DOM (AFFICHAGE)
        let article = document.createElement("article");
        article.setAttribute("class", "cart__item");
        article.setAttribute("data-id", idQteColor.id);
        article.setAttribute("data-color", idQteColor.color);
        article.innerHTML = ` <div class="cart__item__img">
       <img src=${ProductJson.imageUrl} alt=${ProductJson.altTxt}>
       </div>
       <div class="cart__item__content">
         <div class="cart__item__content__description">
           <h2>${ProductJson.name}</h2>
           <p>${idQteColor.color}</p>
           <p>${ProductJson.price} euros</p>
         </div>
         <div class="cart__item__content__settings">
           <div class="cart__item__content__settings__quantity">
             <p>Qté : </p>
             <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${idQteColor.quantity}">
           </div>
           <div class="cart__item__content__settings__delete">
             <p class="deleteItem">Supprimer</p>
           </div>
         </div>
       </div> `;
        console.log(idQteColor.quantity);
        document.querySelector("#cart__items").appendChild(article);

        //------------------------------------------------------------CALCUL QUANTITE TOTALE ET PRIX TOTAL
        qteTotale += parseInt(idQteColor.quantity, 10);

        // console.log(qteTotale) ;
        document.querySelector("#totalQuantity").innerText = qteTotale;

        prixTotal += ProductJson.price * parseInt(idQteColor.quantity, 10);
        document.querySelector("#totalPrice").innerText = prixTotal;
        // console.log(prixTotal);//ok

        //---------------------------------------------------ECOUTE ET GESTION DES SUPPRESSIONS
        let supprime = article.querySelector(".deleteItem");
        supprime.addEventListener(
          "click",
          () => {
            //suppression dans le DOM:
            article.remove();
            qteTotale -= parseInt(idQteColor.quantity, 10);
            document.querySelector("#totalQuantity").innerText = qteTotale;
            prixTotal -= ProductJson.price * parseInt(idQteColor.quantity, 10);
            document.querySelector("#totalPrice").innerText = prixTotal;
            //suppression dans le LS:
            supprimeLigne(idQteColor);
          },
          false
        );

        //-----------------------------------------------------ECOUTE ET GESTION DES MODIF DE QUANTITE
        let quantite = article.querySelector(".itemQuantity");
        quantite.addEventListener(
          "change",
          (Event) => {
            if (Event.target.value >= 1 && Event.target.value < 101) {
              modifierQtePanier(idQteColor, Event.target.value);
            } else {
              alert("La quantité doit être un nombre entre 1 et 100.");
            }
          },
          false
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }
  console.log(Panier);
}

//LS:CETTE FONCTION SUPPRIME UNE LIGNE ID/QUANTITE/COULEUR DU LOCALSTORAGE
function supprimeLigne(idQteColor) {
  let Panier = recupPanier();
  let indexPanier = Panier.findIndex((iqc) => iqc === idQteColor);

  console.log(indexPanier); //index négatif??
  Panier.splice(indexPanier, 1);
  localStorage.setItem("Datakanap", JSON.stringify(Panier));
  console.log(Panier);
  savePanier(Panier);
}

//LS:CETTE FONCTION TROUVE LA LIGNE A MODIFIER DU LS ET REMPLACE SA QUANTITE PAR LA NOUVELLE et met à jour qte et prix total dans le DOM
function modifierQtePanier(idQteColor, newQte) {
  let Panier = recupPanier();
  let articleQuiChange = Panier.find(
    (iqc) => iqc.id == idQteColor.id && iqc.color == idQteColor.color
  );
  let vieilleQte = articleQuiChange.quantity;
  articleQuiChange.quantity = newQte;
  let prixTotal = document.querySelector("#totalPrice");
  // console.log("selecteur prix total: ",prixTotal);
  // console.log("prix total précédent: ",prixTotal.innerText);

  // console.log("vieille qte: ",vieilleQte);
  // console.log("new qte: ",newQte);
  savePanier(Panier);
  // console.log(Panier);
  let qteTotale = document.querySelector("#totalQuantity");
  // console.log("qte totale innertext avant calcul: ",qteTotale.innerText);
  qteTotale.innerText =
    parseInt(qteTotale.innerText) - parseInt(vieilleQte) + parseInt(newQte);
  console.log("qte totale innertext: ", qteTotale.innerText);
  // console.log(document.querySelector(".cart__item__content__description p"));
  // console.log(document.querySelector(".cart__item__content__description p").nextElementSibling.innerText);
  let prixUnitaire = parseInt(
    document.querySelector(".cart__item__content__description p")
      .nextElementSibling.innerText
  );
  prixTotal.innerText =
    parseInt(prixTotal.innerText) -
    parseInt(vieilleQte) * prixUnitaire +
    parseInt(newQte) * prixUnitaire;
  // console.log("prix total: ",prixTotal.innerText);
}

window.addEventListener("load", () => {
  console.log(window.location);
  if (window.location == "http://127.0.0.1:5500/front/html/cart.html") {
    affichePanier(); //on appelle la fonction à s'exécuter au chargement de la page panier
  }
});

// ************************* FORMULAIRE UTILISATEURS *************************

// Definition des constantes champs utilisateurs

const prenom = document.getElementById("firstName");
const nom = document.getElementById("lastName");
const adresse = document.getElementById("address");
const ville = document.getElementById("city");
const email = document.getElementById("email");

let valuePrenom, valueNom, valueAdresse, valueVille, valueEmail;

// Ecoute de prenom

prenom.addEventListener("input", function (e) {
  valuePrenom;
  if (e.target.value.length == 0) {
    let inputPrenom = document.querySelector("#firstName");
    inputPrenom.style.backgroundColor = "#90e0ef";
    firstNameErrorMsg.innerHTML = "";
    valuePrenom = null;
  }
  // Validation du champ prénom
  else if (e.target.value.length < 2 || e.target.value.length > 30) {
    let inputPrenom = document.querySelector("#firstName");
    inputPrenom.style.backgroundColor = "#90e0ef";
    firstNameErrorMsg.innerHTML =
      "Attention ! Le prénom doit contenir entre 2 et 30 caractères !";
    valuePrenom = null;
  }

  // Regexp du champ prénom et conditions de validation

  if (e.target.value.match(/[A-Za-z\é\è\ê\ô\-]{2,30}$/)) {
    firstNameErrorMsg.innerHTML = "";
    valuePrenom = e.target.value;
  }
  if (
    !e.target.value.match(/^[A-Za-z\é\è\ê\ô\-]{2,30}$/) &&
    e.target.value.length > 2 &&
    e.target.value.length < 30
  ) {
    firstNameErrorMsg.innerHTML =
      "Le prénom ne doit pas contenir de caractères spéciaux ou chiffres";
    valuePrenom = null;
  }
});

// Ecoute de nom

nom.addEventListener("input", function (e) {
  valueNom;
  if (e.target.value.length == 0) {
    let inputNom = document.querySelector("#lastName");
    inputNom.style.backgroundColor = "#90e0ef";
    lastNameErrorMsg.innerHTML = "";
    valueNom = null;
  }
  // Validation du champ nom
  else if (e.target.value.length < 2 || e.target.value.length > 30) {
    let inputNom = document.querySelector("#lastName");
    inputNom.style.backgroundColor = "#90e0ef";
    lastNameErrorMsg.innerHTML =
      "Attention ! Le nom doit contenir entre 2 et 30 caractères !";
    valueNom = null;
  }

  // Regexp du champ nom et conditions de validation

  if (e.target.value.match(/^[a-zA-Zéêëèîïâäçù ,'-]{2,30}$/)) {
    lastNameErrorMsg.innerHTML = "";
    valueNom = e.target.value;
  }
  if (
    !e.target.value.match(/^[a-zA-Zéêëèîïâäçù ,'-]{2,30}$/) &&
    e.target.value.length > 2 &&
    e.target.value.length < 30
  ) {
    lastNameErrorMsg.innerHTML =
      "Le nom ne doit pas contenir de caractères spéciaux ou chiffres";
    valueNom = null;
  }
});

// Ecoute de adresse

adresse.addEventListener("input", function (e) {
  valueAdresse;
  if (e.target.value.length == 0) {
    let inputAdresse = document.querySelector("#address");
    inputAdresse.style.backgroundColor = "#90e0ef";
    addressErrorMsg.innerHTML = "";
    valueAdresse = null;
  }
  // Validation du champ adresse
  else if (e.target.value.length < 2 || e.target.value.length > 100) {
    let inputAdresse = document.querySelector("#address");
    inputAdresse.style.backgroundColor = "#90e0ef";
    addressErrorMsg.innerHTML =
      "Attention ! L'adresse doit contenir entre 3 et 100 caractères";
    valueAdresse = null;
  }

  // Regexp du champ adresse et conditions de validation

  if (e.target.value.match(/^[a-zA-Z0-9.,-_ ]{3,100}[ ]{0,2}$/)) {
    addressErrorMsg.innerHTML = "ex : 20 rue des Capucines";
    valueAdresse = e.target.value;
  }
  if (
    !e.target.value.match(/^[a-zA-Z0-9.,-_ ]{3,100}[ ]{0,2}$/) &&
    e.target.value.length > 3 &&
    e.target.value.length < 100
  ) {
    addressErrorMsg.innerHTML = "";
    valueAdresse = null;
  }
});

// Ecoute de ville

ville.addEventListener("input", function (e) {
  valueVille;
  if (e.target.value.length == 0) {
    let inputVille = document.querySelector("#city");
    inputVille.style.backgroundColor = "#90e0ef";
    cityErrorMsg.innerHTML = "";
    valueVille = null;
  }
  // Validation du champ ville
  else if (e.target.value.length < 2 || e.target.value.length > 30) {
    let inputVille = document.querySelector("#city");
    inputVille.style.backgroundColor = "#90e0ef";
    cityErrorMsg.innerHTML =
      "Attention ! La ville doit contenir entre 2 et 30 caratères";
    valueVille = null;
  }

  // Regexp du champ ville et conditions de validation

  if (e.target.value.match(/^[[a-zA-Z0-9.,-_ ]{2,30}[ ]{0,2}$/)) {
    cityErrorMsg.innerHTML = "ex : PARIS ou Paris";
    valueVille = e.target.value;
  }
  if (
    !e.target.value.match(/^[a-zA-Z0-9.,-_ ]{2,30}[ ]{0,2}$/) &&
    e.target.value.length > 2 &&
    e.target.value.length < 30
  ) {
    cityErrorMsg.innerHTML =
      "Le ville ne doit pas contenir de caractères spéciaux";
    valueVille = null;
  }
});

// Ecoute de email

email.addEventListener("input", function (e) {
  valueEmail;
  if (e.target.value.length == 0) {
    let inputEmail = document.querySelector("#email");
    inputEmail.style.backgroundColor = "#90e0ef";
    emailErrorMsg.innerHTML = "";
    valueEmail = null;
  }
  // Validation du champ email
  else if (e.target.value.length < 7 || e.target.value.length > 40) {
    let inputEmail = document.querySelector("#email");
    inputEmail.style.backgroundColor = "#90e0ef";
    emailErrorMsg.innerHTML = "Format email invalide";
    valueEmail = null;
  }

  // Regexp du champ email et conditions de validation

  if (
    e.target.value.match(
      /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/
    )
  ) {
    emailErrorMsg.innerHTML = "";
    valueEmail = e.target.value;
  }
  if (
    !e.target.value.match(
      /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/
    ) &&
    // !e.target.value.match(/^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/) &&
    e.target.value.length > 7 &&
    e.target.value.length < 40
  ) {
    emailErrorMsg.innerHTML = "Email invalide ! ex : dupont@gmail.com";
    valueVille = null;
  }

  // sélection du bouton Valider
});

const forumulaireContact = document.querySelector("#order");

forumulaireContact.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("Post Stoppé");
  if (valuePrenom && valueNom && valueAdresse && valueVille && valueEmail) {
    console.log("Bon pour envoyer");
    const bonDecommande = JSON.parse(localStorage.getItem("Datakanap"));
    let commandeId = [];
    console.log("Bon de cde", bonDecommande);
    console.log("cde ID", commandeId);
    bonDecommande.forEach((commande) => {
      commandeId.push(commande.id);
    });

    const validationCde = {
      contact: {
        firstName: valuePrenom,
        lastName: valueNom,
        address: valueAdresse,
        city: valueVille,
        email: valueEmail,
      },
      products: commandeId,
    };

    console.log(validationCde);

    // **************** FETCH POST API ****************

    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validationCde),
    })
      .then((res) => res.json())
      .then((data) => {
        let reponseServeur = data;
        localStorage.clear();
        orderId = data.orderId;
        console.log(orderId);
        console.log(reponseServeur);
        if (orderId != null && orderId != undefined) {
          location.href = "confirmation.html?id=" + orderId;
        }
      });
  } else {
    alert("Le formulaire n'est pas rempli correctement");
  }
});

// ************************* FIN FORMULAIRE UTILISATEURS *************************
