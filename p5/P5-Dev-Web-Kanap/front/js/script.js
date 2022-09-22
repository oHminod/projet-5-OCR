"use strict";
/**
 * * trouverCatalogue
 * Fonction asynchrone appelant
 * une fonction avec le json du catalogue
 * ou une fonction avec l'erreur.
 */
async function trouverCatalogue() {
    try {
        const reponse = await fetch("http://localhost:3000/api/products");
        if ((reponse.status >= 400 && reponse.status < 600) || !reponse.ok) {
            throw new Error(reponse.status + "\n" + reponse.statusText);
        }
        const resultat = await reponse.json();
        afficherCanaps(resultat);
    } catch (erreur) {
        erreurChargement(erreur);
    }
}

trouverCatalogue();

/**
 * * erreurChargement
 * Fonction affichant l'erreur de la
 * fonction trouverCatalogue si elle existe.
 * @param  {json} erreur
 */
function erreurChargement(erreur) {
    alert(
        `Il y a eu un problème lors du chargement du catalogue, contacter un administrateur :\n\n${erreur}`
    );
}

/**
 * * afficherCanaps
 * Fonction d'affichage du résultat de la requête
 * effectuée dans la fonction trouverCatalogue.
 * @param  {json} catalogue : tableau d'objets json
 */
function afficherCanaps(catalogue) {
    AfficherQuantitePanier();
    for (let canape of catalogue) {
        const canap = document.createElement("a");
        canap.href = `./product.html?id=` + canape._id;

        const article = document.createElement("article");
        canap.appendChild(article);

        const image = document.createElement("img");
        image.src = canape.imageUrl;
        image.alt = canape.altTxt;
        article.appendChild(image);

        const titre = document.createElement("h3");
        titre.classList.add("productName");
        titre.innerText = canape.name;
        article.appendChild(titre);

        const description = document.createElement("p");
        description.classList.add("productDescription");
        description.innerText = canape.description;
        article.appendChild(description);

        items.appendChild(canap);
    }
}

/**
 * * AfficherQuantitePanier
 * Fonction qui affiche le nombre d'articles du panier
 * au niveau du lien vers le panier dans la barre de navigation.
 */
function AfficherQuantitePanier() {
    if (
        localStorage.getItem("quantite") &&
        parseInt(localStorage.getItem("quantite")) > 0
    ) {
        let quantite = parseInt(localStorage.getItem("quantite"));
        let panNav = document.querySelector("nav > ul > a:last-child > li");
        panNav.innerText = `Panier (${quantite})`;
    }
}
