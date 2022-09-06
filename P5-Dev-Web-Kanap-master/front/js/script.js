
// Récupération des données de l'API ABZ 10/08/2022


fetch("http://localhost:3000/api/products/")
    .then(function (data) {
        if (data.ok) {
            return data.json();
        }
    })

// Création des produits des données de l'API

    .then(function (products) {

        // Affichage des produits sur la page d'accueil

        for (let product of products) {
            let i = 0; i < product.length; i++;
            document.getElementById("items").innerHTML += `<a href="./product.html?id=${product._id}">          
            <article>
                <img src="${product.imageUrl}"" alt="${product.altTxt}">
                <h3 class="productName">${product.name}</h3>
                <p class="productDescription">${product.description}</p>
            </article>
        </a>`
        }
    })

    // Si echec de récupération des données de l'API alors :
    //  regroupe des instructions à exécuter et définit une réponse si l'une de ces instructions provoque une exception. (MDN)

    .catch (function(error) {
    console.log(error);
});

