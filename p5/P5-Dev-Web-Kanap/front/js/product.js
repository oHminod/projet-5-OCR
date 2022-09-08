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

let tabMulti = [];
//Si un panier existe dans le locale storage
if (localStorage.getItem('panier')) {
    //On récupère le tableau d'objets à partir du local storage
    tabMulti = JSON.parse(localStorage.getItem('panier'));
}
let quantitePanier = 0;
afficherQuantitePanier(quantitePanier);

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
        if (reponse.status >= 400 && reponse.status < 600 || !reponse.ok) {
            throw new Error(reponse.status + '\n' + reponse.statusText);
        }
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
 * @param  {json} erreur
 */
function erreurChargement(erreur) {
    alert(`Il y a eu un problème lors du chargement du canapé :\n\n${erreur}`);
    document.location.href = racine;
}



/**
 * * afficherCanap
 * Fonction d'affichage du résultat de la requête
 * effectuée dans la fonction canap
 * @param  {json} obj : objets json du produit
 */
function afficherCanap(obj) {
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
    let quantity = parseInt(document.getElementById('quantity').value);
    ajoutPan(quantity);
    quantitePanier += quantity;
    afficherQuantitePanier(quantitePanier);
    localStorage.setItem('quantite', quantitePanier);
})



/**
 * * ajoutPan
 * Fonction qui ajoute la sélection au panier
 * en prenant garde de ne pas dupliquer les items
 * @param {number} quantity quantité ajoutée
 */
function ajoutPan(quantity) {
    //On récupère les données du formulaire et on fabrique un json dans la variable "panier"
    let color = colors.options[colors.selectedIndex].text;
    if (color === "--SVP, choisissez une couleur --") {
        alert("Sélectionnez une couleur dans la liste");
        return
    }
    if (quantity <= 0) {
        alert("Sélectionnez une quantité");
        return
    }
    let panier = {
        "id": id,//variable globale
        "color": color,
        "quantity": quantity
    };
    //Si un panier existe dans le locale storage
    if (tabMulti.length > 0) {
        for (const item of tabMulti) {
            if (item.id == panier.id && item.color == panier.color) {
                item.quantity += parseInt(panier.quantity);
            }
        }
    }else{
        tabMulti.push(panier);
    }
    //On ajoute le tableau d'objets au panier
    stockerPanier(tabMulti);
    return
}



/**
 * * stockerPanier
 * Fonction servant à stocker le tableau d'objets dans le local storage
 * @param {array} tab tableau d'objets json
 * @returns 
 */
function stockerPanier(tab) {
    let tabMult = JSON.stringify(tab);
    localStorage.setItem('panier', tabMult);
    return
}



/**
 * * afficherQuantitePanier
 * Fonction qui affiche le nombre d'articles du panier
 * au niveau du lien vers le panier dans la barre de navigation
 * @param {number} number quantité d'articles du panier
 */
 function afficherQuantitePanier(number) {
    let panNav = document.querySelector('nav > ul > a:last-child > li');
    if (number && number > 0) {
        panNav.innerText = `Panier (${number})`;
    }
    else if (localStorage.getItem('quantite') && parseInt(localStorage.getItem('quantite')) > 0) {
        quantitePanier = parseInt(localStorage.getItem('quantite'));
        panNav.innerText = `Panier (${quantitePanier})`;
    }else{
        panNav.innerText = `Panier`;
    }
    return
}
