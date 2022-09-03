//Récupération de l'id produit
let url = window.location.href;
let id;
url = new URL(url);
let search_params = new URLSearchParams(url.search);
search_params.has('id') ? id = search_params.get('id') : alert("Pas d'id produit");
//Variables pour les redirections
let fin = window.location.href.indexOf("html/") + 5;
var racine = window.location.href.slice(0, fin) + "index.html";
var racineP = window.location.href.slice(0, fin) + "product.html";

canap();
/**
 * * canap
 * Fonction asynchrone appelant 
 * une fonction avec le json du produit
 * une fonction avec l'erreur.
 */
async function canap() {
    try {
        const reponse = await fetch(`http://localhost:3000/api/products/${id}`);
        const resultat = await reponse.json();
        afficherCanap(resultat);
    } catch (erreur) {
        erreurChargement(erreur);
    }
}

/**
 * * erreurChargement
 * Fonction affichant l'erreur de la 
 * fonction canap si elle existe
 * @param  {} erreur
 */
function erreurChargement(erreur) {
    console.log(erreur);
    title.innerText = "Il y a eu un problème lors du chargement du canapé !";
}



/**
 * * afficherCanap
 * Fonction d'affichage du résultat de la requête
 * effectuée dans la fonction canap
 * @param  {} obj : objets json du produit
 */
function afficherCanap(obj) {
    AfficherQuantitePanier();
    if (!obj.name) {
        alert("numéro de produit invalide !");
        document.location.href = racine; 
    }
    const img = document.createElement('img');
    img.src = obj.imageUrl;
    img.alt = obj.altTxt;
    document.querySelector(".item__img").appendChild(img);
    title.innerText = obj.name;
    price.innerText = obj.price;
    description.innerText = obj.description;
    for (let couleur of obj.colors) {
        const option = document.createElement("option");
        option.value = couleur;
        option.innerText = couleur;

        colors.appendChild(option);
    }
}



/**
 * EventListener qui ajoute la sélection au panier
 * quand on clic sur le bouton "ajouter au panier"
 */
document.getElementById('addToCart').addEventListener('click', (e) => {
    e.preventDefault;
    ajoutPan();
})



/**
 * * ajoutPan
 * Fonction qui ajoute la sélection au panier
 * en prenant garde de ne pas dupliquer les items
 */
function ajoutPan() {
    //On récupère les données du formulaire et on fabrique un json dans la variable "panier"
    let color = colors.options[colors.selectedIndex].text;
    if (color === "--SVP, choisissez une couleur --") {
        alert("Sélectionnez une couleur dans la liste");
        return
    }
    let quantity = parseInt(document.getElementById('quantity').value);
    if (quantity <= 0) {
        alert("Sélectionnez une quantité");
        return
    }
    let panier = {
        "id": id,
        "color": color,
        "quantity": quantity
    };

    //Si un panier existe dans le locale storage
    if (localStorage.getItem('panier')) {
        //On récupère le tableau d'objets stringifiés à partir du local storage
        let tabMulti = localStorage.getItem('panier').split('%');

        for (const i in tabMulti) {
            //Pour chaque item du tableau, on transforme l'item en objet
            let item = JSON.parse(tabMulti[i]);

            //Si l'id et la couleur de l'item correspondent à l'objet qu'on veut ajouter
            if (item.id == panier.id && item.color == panier.color) {
                //on ajoute la quantité en prenant garde de manipuler des nombres
                item.quantity += parseInt(panier.quantity);
                item = JSON.stringify(item);
                //on change la valeur de l'item dans le tableau et on redéfinit le locale storage "panier"
                tabMulti[i] = item;
                tabMulti = tabMulti.join('%');
                localStorage.setItem('panier', tabMulti);
                compterArticles();
                return
            }
        }
        //On ajoute le panier au tableau d'objets stringifiés, lui-même joint pour faire une string qu'on définit comme valeur du locale storage "panier"
        tabMulti.push(JSON.stringify(panier));
        tabMulti = tabMulti.join('%');
        localStorage.setItem('panier', tabMulti);
        compterArticles();

        return
    }

    //On initie le locale storage "panier" avec le premier objet stringifié
    localStorage.setItem('panier', JSON.stringify(panier));
    compterArticles();
}



/**
 * * compterArticles
 * Fonction qui compte le nombre total d'articles dans le panier
 * stocke le résultat dans le local storage
 * @returns le nombre d'articles dans le panier
 */
function compterArticles() {
    if (!localStorage.getItem('panier')) {
        if (localStorage.getItem('quantite')) {
            localStorage.clear('quantite');
        }
        return
    }
    //On récupère le tableau d'objets stringifiés à partir du local storage
    let tabCanaps = localStorage.getItem('panier').split('%');
    let quantiteArticles = 0;
    for (item of tabCanaps) {
        item = JSON.parse(item);
        quantiteArticles += parseInt(item.quantity);
    }
    localStorage.setItem('quantite', quantiteArticles);
    AfficherQuantitePanier();
    return quantiteArticles
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
