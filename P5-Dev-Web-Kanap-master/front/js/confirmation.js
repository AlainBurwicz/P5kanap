 // Récupération du n° de commande

 let params = new URLSearchParams(window.location.search);
 let orderId = params.get("orderId");
 document.getElementById("orderId").innerHTML += orderId;