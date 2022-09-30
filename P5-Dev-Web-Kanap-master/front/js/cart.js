// Récupération du localstorage ABZ le 25/08/2022

let cart = JSON.parse(localStorage.getItem("Datakanap"));

// Variable pour le stockage des Id pour les articles présents dans le panier

let products = [];

// Variable servant à récupérer l'orderId envoyé par le serveur lors de la requête POST
// (Des requêtes POST successives et identiques peuvent avoir des effets additionnels, ce qui peut revenir par exemple à passer plusieurs fois une commande.)

let orderId = "";

// Affichage du contenu du panier

async function displayCart() {
  const parser = new DOMParser();
  const positionEmptyCart = document.getElementById("cart__items");
  let cartArray = [];

  // Si le localstorage (panier) est vide

  if (cart.length === 0) {
    positionEmptyCart.textContent = "Votre panier est vide";
    document.querySelector(".cart__order__form").hidden = true;

    // document.querySelector(".cart__order__form").style.display = "none"; Saisie CSS
  } else {
    console.log("Des produits sont présents dans le panier");
  }

  // Si le localstorage (panier) contient des produits

  for (i = 0; i < cart.length; i++) {
    const product = await getProductById(cart[i].id);

    // const totalPriceItem = (product.price *= cart[i].quantity);
  //   cartArray += `<article class="cart__item" data-id="${cart[i].id}" data-color="${cart[i].color}">
  //                 <div class="cart__item__img">
  //                     <img src="${product.imageUrl}" alt="${product.altTxt}">
  //                 </div>
  //                 <div class="cart__item__content">
  //                     <div class="cart__item__content__description">
  //                         <h2>${product.name}</h2>
  //                         <p>${cart[i].color}</p>
  //                          <p>Prix unitaire : ${product.price}€</p>
  //                     </div>
  //                     <div class="cart__item__content__settings">
  //                       <div class="cart__item__content__settings__quantity">
  //                           <p id="quantité">
  //                             Qté : <input data-id= ${cart[i].id} data-color= ${cart[i].color} data-prixUnitaire= ${product.price} type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${cart[i].quantity}>
  //                           </p>
  //                       </div>
  //                      <div class="cart__item__content__settings__delete">
  //                       </br>
  //                         <p data-id= ${cart[i].id} data-color= ${cart[i].color} class="deleteItem">Supprimer</p>
  //                       </div>
  //                     </div>
  //                   </div>
  //                 </div>
  //                 </article>`;
  // }


  // Boucle d'affichage du nombre total d'articles dans le panier et de la somme totale

  let totalQuantity = 0;
  let totalPrice = 0;

  for (i = 0; i < cart.length; i++) {
    const article = await getProductById(cart[i].id);
    totalQuantity += parseInt(cart[i].quantity);
    totalPrice += parseInt(article.price * cart[i].quantity);

    console.log(totalQuantity);
    console.log(totalPrice);
  }

  document.getElementById("totalQuantity").innerHTML = totalQuantity;
  document.getElementById("totalPrice").innerHTML = totalPrice;

  if (i == cart.length) {
    const displayPanier = parser.parseFromString(cartArray, "text/html");

    positionEmptyCart.appendChild(displayPanier.body);
  deleteItem();
  }
}

// Récupération des produits de l'API par son id

async function getProductById(productId) {
  return fetch("http://localhost:3000/api/products/" + productId)
    .then(function (res) {
      // .then((res) =>
      // res.json().then((data) => {
      //   console.log(data);
      // })
      return res.json();
    })
    .catch((error) => {
      //  Erreur serveur
      alert(error, "erreur");
    })
    .then(function (data) {
      return data;
    });
}


displayCart();
affichePanier();

// Modification de la quantité
//function test
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
            qteTotale -= parseInt(idQteColor.qte, 10);
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
          "click",
          (Event) => {
            if (Event.target.value >= 1 && Event.target.value < 101) {
              modifierQtePanier(idQteColor, Event.target.value);
            }
            else{
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



// fin function test
// function changeQuantity() {

//   const quantityInputs = document.querySelectorAll(".itemQuantity");
//   quantityInputs.forEach((quantityInput) => {
//     quantityInput.addEventListener("change", (event) => {
//       event.preventDefault();
//       const inputValue = event.target.value;
//       const dataId = event.target.getAttribute("data-id");
//       const dataColor = event.target.getAttribute("data-color");
//       const prixUnitaire = event.target.getAttribute("data-prixUnitaire");
//       console.log("Result Qté", inputValue);
//       // console.log("data de l'event", event.target, inputValue);
//       let cart = localStorage.getItem("Datakanap");
//       let items = JSON.parse(cart);
  


//       //manipulation du DOM

//       // let produitPrice = [];
//       // let qteTotaleProduit = [];
//       // let newTableau = localStorage.getItem("Datakanap");


//       // newTableau.forEach() => {
//       //   produitPrice.push(prixUnitaire * inputValue);
//       //   qteTotaleProduit.push(inputValue);
//       //  document.getElementById("totalPrice").innerText = sommePrice;
//       // }

//       for (i = 0; i < cart.length; i++) {
//         const article = getProductById(cart[i].id);
//         totalQuantity += parseInt(cart[i].inputValue);
//         console.log(cart[i].inputValue)
//         totalPrice += parseInt(article.prixUnitaire * cart[i].inputValue);
//       }

//       //  console.log("ARTICLE cris", inputValue);
//       //  let sommePrice = 0;
//       //  sommePrice += prixUnitaire * inputValue;
//       //  console.log("prix total", sommePrice);
//        document.getElementById("totalPrice").innerText = sommePrice;
      
//       // fin de manipulation du DOM

//          items = items.map((item) => {
//           if (item.id == dataId && item.color == dataColor) {
//             item.quantity = inputValue;

//           }

//           return item;
//       });

//       // Mise à jour du localStorage

//        let itemsStr = JSON.stringify(items);
//        console.log("ItemsStr ?", itemsStr);
//        localStorage.setItem("Datakanap", itemsStr);


//       // Mise à jour de la page panier
// changeQuantity()
//       // location.reload();
//      });
//    });
// }

// Suppression d'un article par le bouton supprimer

function deleteItem() {
  const deleteButtons = document.querySelectorAll(".deleteItem");
  deleteButtons.forEach((deleteButton) => {
    deleteButton.addEventListener("click", (event) => {
      event.preventDefault();
      const deleteId = event.target.getAttribute("data-id");
      const deleteColor = event.target.getAttribute("data-color");
      cart = cart.filter(
        (element) => !(element.id == deleteId && element.color == deleteColor)
      );
      



      // Mise à jour du localStorage

      localStorage.setItem("Datakanap", JSON.stringify(cart));

      // Refresh de la page Panier

      // location.reload();
      alert("Article supprimé du panier.");
    });
  });
}

// FORMULAIRE UTILISATEUR

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

const btnValidate = document.querySelector("#order");

// Ecoute de l'évenement click sur le bouton valider pour le formulaire utilisateur

btnValidate.addEventListener("click", (event) => {
  event.preventDefault();
  console.log("Post stoppé");

  // Vérification des valeurs dans les champs contact. Si valeur = true

  if (valuePrenom && valueNom && valueAdresse && valueVille && valueEmail) {
    console.log("c'est OK pour l'envoi");

    const commandeFinale = JSON.parse(localStorage.getItem("Datakanap"));
    let commandeId = [];
    console.log(commandeFinale);
    console.log(commandeId);


    const bonDeCommande = {
      contact: {
        firstName: valuePrenom,
        lastName: valueNom,
        address: valueAdresse,
        city: valueVille,
        email: valueEmail,
      },
      products: commandeId,
    };

    console.log(bonDeCommande);

    //  Création méthode POST
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      // transformation de l'objet data en string

      body: JSON.stringify(bonDeCommande),
      headers: { "Content-Type": "application/json" },

    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        localStorage.clear();
        orderId = data.orderId;
        // localStorage.setItem("Commande", JSON.stringify(orderId));
        if (orderId != "") {
          location.href = "confirmation.html?id=" + orderId;
        }
            // window.location.assign(`confirmation.html?orderId=${orderId}`);
      });
  } else {
    alert("Veuillez bien remplir le formulaire");
  }
    // Si le localstorage (panier) est vide

  
});

//LS:CETTE FONCTION TROUVE LA LIGNE A MODIFIER DU LS ET REMPLACE SA QUANTITE PAR LA NOUVELLE et met à jour qte et prix total dans le DOM

function modifierQtePanier(idQteColor, newQte) {

  let Panier = affichePanier();

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

  qteTotale.innerText = parseInt(qteTotale.innerText) - parseInt(vieilleQte) + parseInt(newQte);

  console.log("qte totale innertext: ",qteTotale.innerText);

  // console.log(document.querySelector(".cart__item__content__description p"));

  // console.log(document.querySelector(".cart__item__content__description p").nextElementSibling.innerText);

  let prixUnitaire = parseInt(document.querySelector(".cart__item__content__description p").nextElementSibling.innerText);

  prixTotal.innerText=parseInt(prixTotal.innerText)-(parseInt(vieilleQte)*prixUnitaire)+(parseInt(newQte)*prixUnitaire);

  // console.log("prix total: ",prixTotal.innerText);

}

//LS:CETTE FONCTION EXTRAIT LE PANIER ACTUEL DU LOCALSTORAGE ET LE TRANSFORME EN TABLEAU D OBJET JSON

 function recupPanier() {

  let panierRecup = localStorage.getItem("Datakanap"); //panierRecup est un txt

  if (panierRecup == null) {

    return [];

  } else {

    return JSON.parse(panierRecup); //on recupere un tableau d'objet JSon ex: indice 0 {Id,qte,couleur}

  }

}