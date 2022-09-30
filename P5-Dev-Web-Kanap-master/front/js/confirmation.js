 //Récupération de l'id depuis l'url
let params = new URL(document.location).searchParams;
let orderId = params.get("orderId");


//Affichage du numéro de commande
document.getElementById("orderId").textContent = orderId;

  // Si le localstorage (panier) est vide

