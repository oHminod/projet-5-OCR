/**
 * * canaps
 * Fonction asynchrone appelant 
 * une fonction avec le json du catalogue
 * une fonction avec l'erreur.
 */
async function canaps() {
    try {
        const reponse = await fetch("http://localhost:3000/api/products");
        const resultat = await reponse.json();
        afficherCanaps(resultat);
    } catch (erreur) {
        erreurChargement(erreur);
    }
}

canaps();
/**
 * * erreurChargement
 * Fonction affichant l'erreur de la 
 * fonction canaps si elle existe
 * @param  {} erreur
 */
function erreurChargement(erreur) {
    const err = document.createElement("h2");
    err.innerText = "Il y a eu un problème lors du chargement du catalogue !";
    items.appendChild(err);
    dump(erreur);
}
/**
 * * dump
 * Fonction pour mettre en forme un message d'erreur
 * @param  {} obj
 */
function dump(obj) {
    var out = '';
    for (var i in obj) {
        out += i + ": " + obj[i] + "\n";
    }

    var pre = document.createElement('pre');
    pre.innerHTML = out;
    items.appendChild(pre)
}

/**
 * * afficherCanaps
 * Fonction d'affichage du résultat de la requête 
 * effectuée dans la fonction canaps
 * @param  {} tabObj : tableau d'objets json
 */
function afficherCanaps(tabObj) {
    AfficherQuantitePanier();
    for (let item of tabObj) {
        const canap = document.createElement("a");
        canap.href = `./product.html?id=` + item._id;

        const article = document.createElement("article");
        canap.appendChild(article);

        const image = document.createElement("img");
        image.src = item.imageUrl;
        image.alt = item.altTxt;
        article.appendChild(image);

        const titre = document.createElement("h3");
        titre.classList.add("productName");
        titre.innerText = item.name;
        article.appendChild(titre);

        const description = document.createElement("p");
        description.classList.add("productDescription");
        description.innerText = item.description;
        article.appendChild(description);


        items.appendChild(canap);
    }
}
/**
 * * AfficherQuantitePanier
 * Fonction qui affiche le nombre d'articles du panier
 * au niveau du lien vers le panier dans la barre de navigation
 */
function AfficherQuantitePanier() {
    if (localStorage.getItem('quantite') && parseInt(localStorage.getItem('quantite')) > 0) {
        let quantite = parseInt(localStorage.getItem('quantite'));
        let panNav = document.querySelector('nav > ul > a:last-child > li');
        panNav.innerText = `Panier (${quantite})`;
    }
}
