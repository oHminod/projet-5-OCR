let url = window.location.href;
let id;
url = new URL(url);
let search_params = new URLSearchParams(url.search);
search_params.has('id') ? id = search_params.get('id') : alert("Pas d'id produit");

let fin = window.location.href.indexOf("html/") + 5;
var racine = window.location.href.slice(0, fin) + "index.html";

canap();

async function canap() {
    try {
        const reponse = await fetch(`http://localhost:3000/api/products/${id}`);
        const resultat = await reponse.json();
        afficherCanap(resultat);
    } catch (erreur) {
        erreurChargement(erreur);
    }
}


function erreurChargement(erreur) {
    console.log(erreur);
    title.innerText = "Il y a eu un problème lors du chargement du canapé !";
}

function afficherCanap(obj) {
    if (!obj.name) {
        alert("numéro de produit invalide !");
        document.location.href = racine; 
    }
    //console.log(obj);
    document.querySelector(".item__img").children[0].src = obj.imageUrl;
    document.querySelector(".item__img").children[0].alt = obj.altTxt;
    title.innerText = obj.name;
    price.innerText = obj.price;
    description.innerText = obj.description;
    for (const i in obj.colors) {
        const option = document.createElement("option");
        option.value = obj.colors[i];
        option.innerText = obj.colors[i];

        colors.appendChild(option);
    }
}
