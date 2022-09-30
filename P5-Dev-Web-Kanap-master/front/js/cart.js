// Extraction du panier dur localStorage Datakanap

function recupPanier() {
  let panierRecup = localStorage.getItem("Datakanap"); //panierRecup est un txt

  if (panierRecup == null) {
    return [];
  } else {
    return JSON.parse(panierRecup); //on recupere un tableau d'objet JSon ex: indice 0 {Id,qte,couleur}
  }
}

affichePanier();

// Fonction créant pour chaque objet du panier un article dans le DOM pour l'affichage

function affichePanier() {
  let Panier = recupPanier();
  let prixTotal = 0;
  let qteTotale = 0;
  for (let idQteColor of Panier) {
    // Pour chaque article du panier, on recupere chaque objet à afficher au panier dans l'API à partir de son id

    let myPromise = fetch(
      "http://localhost:3000/api/products/" + idQteColor.id
    );

    // le résultat de la promesse contient l'article voulu

    myPromise
      .then(function (result) {
        if (result) {
          return result.json();

          // Conversion de l'objet au format JSON
        }
      })
      .then((ProductJson) => {
        // ************************* CREATION D UN ARTICLE DOM (AFFICHAGE) *************************

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
        document.querySelector("#cart__items").appendChild(article);

        // ************************* CALCUL DE LA QUANTITE TOTALE ET PRIX TOTAL *************************

        qteTotale += parseInt(idQteColor.quantity, 10);

        // console.log(qteTotale) ;
        document.querySelector("#totalQuantity").innerText = qteTotale;

        prixTotal += ProductJson.price * parseInt(idQteColor.quantity, 10);
        document.querySelector("#totalPrice").innerText = prixTotal;
        // console.log(prixTotal);//ok

        // ************************* ECOUTE ET GESTION DE LA MOFICATION DE LA QUANTITE *************************

        function modifierQtePanier(idQteColor, newQte) {
          let Panier = recupPanier();

          let articleQuiChange = Panier.find(
            (iqc) => iqc.id == idQteColor.id && iqc.color == idQteColor.color
          );

          let vieilleQte = articleQuiChange.quantity;

          articleQuiChange.quantity = newQte;

          console.log("NewQty", newQte);

          let prixTotal = document.querySelector("#totalPrice");

          // console.log("selecteur prix total: ",prixTotal);

          // console.log("prix total précédent: ",prixTotal.innerText);

          // console.log("vieille qte: ",vieilleQte);

          // console.log("new qte: ",newQte);

          // savePanier(Panier);

          // console.log(Panier);

          let qteTotale = document.querySelector("#totalQuantity");

          let totalQty = eval(newQte);
          console.log("EvalQte", totalQty.tostring);

          console.log("Total Qty", qteTotale);

          // console.log("qte totale innertext avant calcul: ",qteTotale.innerText);

          qteTotale.innerText =
            parseInt(qteTotale.innerText) -
            parseInt(vieilleQte) +
            parseInt(newQte);

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

        let quantite = article.querySelector(".itemQuantity");
        quantite.addEventListener(
          "change",
          (Event) => {
            if (Event.target.value >= 1 && Event.target.value < 101) {
              console.log("Valeurs", idQteColor, Event.target.value);
              modifierQtePanier(idQteColor, Event.target.value);
            } else {
              alert("La quantité doit être un nombre entre 1 et 100.");
            }
          },
          false
        );

        // ************************* ECOUTE ET GESTION DES SUPPRESSIONS *************************

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

        // ************************* FIN FORMULAIRE UTILISATEURS *************************


        
        
      })
      .catch((error) => {
        console.log(error);
      });
  }
  

  console.log(Panier);


}
