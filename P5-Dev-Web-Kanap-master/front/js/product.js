// Récupération de l'ID du produit ABZ 10/08/2022

const getProductId = () => {
  return new URL(location.href).searchParams.get("id");
};
const productId = getProductId();

fetch(`http://localhost:3000/api/products/${productId}`)
  .then((data) => {
    return data.json();
  })

  .then((product) => {
    selectedProduct(product);
    registredProduct(product);
    console.log("PRODUIT", product);

  })
  .catch((error) => {
    alert(error);
  });

// Sélection de la couleur (#idcolors)

const selectedColor = document.querySelector("#colors");

// Sélection de la quantité (#idquantity)

const selectedQuantity = document.querySelector("#quantity");

// Sélection Click bouton pour ajout au panier

const button = document.querySelector("#addToCart");

// Récupération des données potentielles .then(product) pour l'intégration dans le fichier HTML

let selectedProduct = (product) => {

// Intégration des données du produit sélectionné dans la page HTML

  document.querySelector("head > title").textContent = product.name;
  document.querySelector(
    ".item__img"
  ).innerHTML += `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
  document.querySelector("#title").textContent += product.name;
  document.querySelector("#price").textContent += product.price;
  document.querySelector("#description").textContent += product.description;

  // Boucle pour l'intégration des différentes couleurs du produit dans le fichier HTML

  for (color of product.colors) {
    let option = document.createElement("option");
    option.innerHTML = `${color}`;
    option.value = `${color}`;
    selectedColor.appendChild(option);
  }
};

// Enregistrement dans un objet les options choisies par l'utilisateur au click sur le bouton "Ajouter au panier"

let registredProduct = (product) => {

// Ecoute de l'évenement click sur le bouton ajouter

  button.addEventListener("click", (event) => {
    event.preventDefault();

    if (selectedColor.value == false) {
      confirm("Veuillez sélectionner une couleur S.V.P");
    } else if (selectedQuantity.value == 0) {
      confirm("Veuillez sélectionner le nombre d'articles souhaités S.V.P");
    } else {
      alert("Votre article a bien été ajouté au panier");

      // Récupération des informations du produit sélectionné

      let selectedProduct = {
        id: product._id,
        // price: product.price,
        color: selectedColor.value,
        quantity: parseInt(selectedQuantity.value, 10),
      };
      console.log(selectedProduct);

      // ================== GESTION DU LOCALSTORAGE ===================================
      // ================== Récupération des données du localStorage ==================

      let existingCart = JSON.parse(localStorage.getItem("Datakanap"));

      // Si le localStorage existe

      if (existingCart) {
        console.log(
          "Un produit est déjà présent dans le panier, on compare les données"
        );

        // Recherche avec la méthode find() si l'id et la couleur d'un article est déjà présent

        let item = existingCart.find(
          (item) =>
            item.id == selectedProduct.id && item.color == selectedProduct.color
        );

        // Si l'article est présent, alors on incrémente la nouvelle quantité et la mise à jour du prix total de l'article

        if (item) {
          item.quantity = item.quantity + selectedProduct.quantity;
          item.totalPrice += item.price * selectedProduct.quantity;
          localStorage.setItem("Datakanap", JSON.stringify(existingCart)),
          (item = JSON.parse(localStorage.getItem("DataKanap")));
          console.log("Quantité supplémentaire dans le panier.");
          return;
        }
        // Si l'article n'est pas présent alors on push le nouvel article sélectionné

        existingCart.push(selectedProduct);
        localStorage.setItem("Datakanap", JSON.stringify(existingCart));
        console.log("Le produit a été ajouté au panier");
      } else {
        // Sinon création d'un tableau dans le lequel on push l'objet "selectedProduct"

        let createLocalStorage = [];
        createLocalStorage.push(selectedProduct);
        localStorage.setItem("Datakanap", JSON.stringify(createLocalStorage));
        console.log("Le panier est vide,ajout du premier produit");
      }
    }
  });
};
