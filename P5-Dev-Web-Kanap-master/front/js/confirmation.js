// Récupération du n° de commande

let params = new URLSearchParams(window.location.search);
const orderId = params.get("id");
document.getElementById("orderId").innerHTML += `${orderId}`;