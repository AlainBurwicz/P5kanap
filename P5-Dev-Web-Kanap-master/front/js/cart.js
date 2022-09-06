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

  if (cart === null || cart === 0) {
    positionEmptyCart.textContent = "Votre panier est vide";
  } else {
    console.log("Des produits sont présents dans le panier");
  }
  
  // Si le localstorage (panier) contient des produits

  for (i = 0; i < cart.length; i++) {
    const product = await getProductById(cart[i].id);
    const prixUnitaire = (product.price * 1);
    const totalPriceItem = (product.price *= cart[i].quantity);
    cartArray += `<article class="cart__item" data-id="${cart[i].id}" data-color="${cart[i].color}">
                  <div class="cart__item__img">
                      <img src="${product.imageUrl}" alt="${product.altTxt}">
                  </div>
                  <div class="cart__item__content">
                      <div class="cart__item__content__description">
                          <h2>${product.name}</h2>
                          <p>${cart[i].color}</p>
                          <p>Prix unitaire : ${prixUnitaire}€</p>
                      </div>
                      <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p id="quantité">
                              Qté : <input data-id= ${cart[i].id} data-color= ${cart[i].color} type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${cart[i].quantity}>
                            </p>
                            <p id="sousTotal">Prix total pour cet article: ${totalPriceItem}€</p> 
                        </div>
                        <div class="cart__item__content__settings__delete">
                        </br>
                          <p data-id= ${cart[i].id} data-color= ${cart[i].color} class="deleteItem">Supprimer</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  </article>`;
  }

  // Boucle d'affichage du nombre total d'articles dans le panier et de la somme totale

  let totalQuantity = 0;
  let totalPrice = 0;

  for (i = 0; i < cart.length; i++) {
    const article = await getProductById(cart[i].id);
    totalQuantity += parseInt(cart[i].quantity);
    totalPrice += parseInt(article.price * cart[i].quantity);
    
  }

  document.getElementById("totalQuantity").innerHTML = totalQuantity;
  document.getElementById("totalPrice").innerHTML = totalPrice;

  if (i == cart.length) {
    const displayPanier = parser.parseFromString(cartArray, "text/html");
    positionEmptyCart.appendChild(displayPanier.body);
    changeQuantity();
    deleteItem();
  }
}

// Récupération des produits de l'API

async function getProductById(productId) {
  return fetch("http://localhost:3000/api/products/" + productId)
    .then(function (res) {
      return res.json();
    })
    .catch((err) => {
      // Erreur serveur
      console.log("erreur");
    })
    .then(function (data) {
      return data;
    });
}
displayCart();

// Modification de la quantité

function changeQuantity() {
  const quantityInputs = document.querySelectorAll(".itemQuantity");
  quantityInputs.forEach((quantityInput) => {
    quantityInput.addEventListener("change", (event) => {
      event.preventDefault();
      const inputValue = event.target.value;
      const dataId = event.target.getAttribute("data-id");
      const dataColor = event.target.getAttribute("data-color");
      let cart = localStorage.getItem("Datakanap");
      let items = JSON.parse(cart);

      items = items.map((item, index) => {
        if (item.id === dataId && item.color === dataColor) {
          item.quantity = inputValue;
        }
        return item;
      });

      // Mise à jour du localStorage

      let itemsStr = JSON.stringify(items);
      localStorage.setItem("Datakanap", itemsStr);

      // Mise à jour de la page panier

      location.reload();
    });
  });
}

// Suppression d'un article quand la quantité est à O ou nulle

// function deleteNullQte() {
//   const itemQte = document.querySelectorall(".itemQuantity");
//   itemQte.forEach((zoneQte)) => {
//   }
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
      console.log(cart);

      // Mise à jour du localStorage

      localStorage.setItem("Datakanap", JSON.stringify(cart));

      // Refresh de la page Panier

      location.reload();
      alert("Article supprimé du panier.");
    });
  });
}

// FORMULAIRE UTILISATEUR

// sélection du bouton Valider

const btnValidate = document.querySelector("#order");

// Ecoute de l'évenement click sur le bouton valider pour le formulaire utilisateur

btnValidate.addEventListener("click", (event) => {
  event.preventDefault();

  let contact = {
    firstName: document.querySelector("#firstName").value,
    lastName: document.querySelector("#lastName").value,
    address: document.querySelector("#address").value,
    city: document.querySelector("#city").value,
    email: document.querySelector("#email").value,
  };

  console.log(contact);

// GESTION ET VERIFICATION DU REMPLISSAGE DU FORMULAIRE

// Contrôle des champs Prénom, Nom et Ville

  const enrgExPrenomNomVille = (value) => {
    return /^[A-Z][A-Za-z\é\è\ê\-]+$/.test(value);
  };

  // Contrôle du champ adresse

  const enrgExAdresse = (value) => {
    return /^[a-zA-Z0-9.,-_ ]{5,50}[ ]{0,2}$/.test(value);
  };

  // Contrôle du champ email

  const enrgExEmail = (value) => {
    return /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/.test(
      value
    );
  };

  // Fonction de contrôle du champ Prénom:

  function firstNameControl() {
    const prenom = contact.firstName;
    let inputFirstName = document.querySelector("#firstName");
    if (enrgExPrenomNomVille(prenom)) {
      inputFirstName.style.backgroundColor = "#06d6a0";

      document.querySelector("#firstNameErrorMsg").textContent = "";
      return true;
    } else {
      inputFirstName.style.backgroundColor = "#E63946";

      document.querySelector("#firstNameErrorMsg").textContent =
        "Champ Prénom de formulaire invalide, ex: Paul";
      return false;
    }
  }

  // Fonctions de contrôle du champ Nom:
  function lastNameControl() {
    const nom = contact.lastName;
    let inputLastName = document.querySelector("#lastName");
    if (enrgExPrenomNomVille(nom)) {
      inputLastName.style.backgroundColor = "#06d6a0";

      document.querySelector("#lastNameErrorMsg").textContent = "";
      return true;
    } else {
      inputLastName.style.backgroundColor = "#E63946";

      document.querySelector("#lastNameErrorMsg").textContent =
        "Champ Nom de formulaire invalide, ex: Durand";
      return false;
    }
  }

  // Fonctions de contrôle du champ Adresse:
  function addressControl() {
    const adresse = contact.address;
    let inputAddress = document.querySelector("#address");
    if (enrgExAdresse(adresse)) {
      inputAddress.style.backgroundColor = "#06d6a0";

      document.querySelector("#addressErrorMsg").textContent = "";
      return true;
    } else {
      inputAddress.style.backgroundColor = "#E63946";

      document.querySelector("#addressErrorMsg").textContent =
        "Champ Adresse de formulaire invalide, ex: 50 rue de la paix";
      return false;
    }
  }

  // Fonctions de contrôle du champ Ville:
  function cityControl() {
    const ville = contact.city;
    let inputCity = document.querySelector("#city");
    if (enrgExPrenomNomVille(ville)) {
      inputCity.style.backgroundColor = "#06d6a0";

      document.querySelector("#cityErrorMsg").textContent = "";
      return true;
    } else {
      inputCity.style.backgroundColor = "#E63946";

      document.querySelector("#cityErrorMsg").textContent =
        "Champ Ville de formulaire invalide, ex: Paris";
      return false;
    }
  }

  // Fonctions de contrôle du champ Email:
  function mailControl() {
    const courriel = contact.email;
    let inputMail = document.querySelector("#email");
    if (enrgExEmail(courriel)) {
      inputMail.style.backgroundColor = "#06d6a0";

      document.querySelector("#emailErrorMsg").textContent = "";
      return true;
    } else {
      inputMail.style.backgroundColor = "#E63946";

      document.querySelector("#emailErrorMsg").textContent =
        "Champ Email de formulaire invalide, ex: example@contact.fr";
      return false;
    }
  }

  // Contrôle validité formulaire avant de l'envoyer dans le local storage
  if (
    firstNameControl() &&
    lastNameControl() &&
    addressControl() &&
    cityControl() &&
    mailControl()
  ) {
    // Enregistrer le formulaire dans le local storage
    localStorage.setItem("contact", JSON.stringify(contact));

    document.querySelector("#order").value =
      "Articles et formulaire valide\n Passer commande !";
    sendToServer();
  } else {
    error("Veuillez bien remplir le formulaire");
  }

  /* FIN GESTION DU FORMULAIRE */

  /* REQUÊTE DU SERVEUR ET POST DES DONNÉES */
  function sendToServer() {
    const sendToServer = fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      body: JSON.stringify({ contact, products }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      // Récupération et stockage de la réponse de l'API (orderId)
      .then((data) => {
        return data.json();
      })
      .then((server) => {
        orderId = server.orderId;
        console.log(orderId);
      });

    // Si l'orderId a bien été récupéré, on redirige l'utilisateur vers la page de Confirmation
    if (orderId != "") {
      location.href = "confirmation.html?id=" + orderId;
    }
  }
});

/* FIN REQUÊTE DU SERVEUR ET POST DES DONNÉES */

// Maintenir le contenu du localStorage dans le champs du formulaire

 let dataFormulaire = JSON.parse(localStorage.getItem("contact"));

 console.log(dataFormulaire);
 if (dataFormulaire) {
   document.querySelector("#firstName").value = dataFormulaire.firstName;
   document.querySelector("#lastName").value = dataFormulaire.lastName;
   document.querySelector("#address").value = dataFormulaire.address;
   document.querySelector("#city").value = dataFormulaire.city;
   document.querySelector("#email").value = dataFormulaire.email;
 } else {
   console.log("Le formulaire est vide");
}