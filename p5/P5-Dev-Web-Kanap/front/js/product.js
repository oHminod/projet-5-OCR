let url = window.location.href;
let id;
url = new URL(url);
let search_params = new URLSearchParams(url.search);
search_params.has('id') ? id = search_params.get('id') : alert("Pas d'id produit");

let fin = window.location.href.indexOf("html/") + 5;
var racine = window.location.href.slice(0, fin) + "index.html";
var racineP = window.location.href.slice(0, fin) + "product.html";

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

// function ajoutPanier(event) {
//     let color = colors.options[colors.selectedIndex].text;
//     if (color === "--SVP, choisissez une couleur --") {
//         alert("Sélectionnez une couleur dans la liste");
//         return
//     }
//     let quantity = parseInt(document.getElementById('quantity').value);
//     if (quantity <= 0) {
//         alert("Sélectionnez une quantité");
//         return
//     }
//     let panier = [id, color, quantity];
//     panier = panier.join('|');


//     if (localStorage.getItem('panier')) {
//         let tabMulti = localStorage.getItem('panier').split('%');
//         if (tabMulti.length == 1) {
//             let tabCommande = tabMulti[0].split('|');
//             if (tabCommande[0] == id) {
//                 if (tabCommande[1] == color) {
//                     tabCommande[2] = parseInt(tabCommande[2]);
//                     console.log(tabCommande[2]);
//                     tabCommande[2] += quantity;
//                     localStorage.setItem('panier', tabCommande.join('|'));
//                     return
//                 }
//             }
//         }
//         let commande = [];
//         commande.push(localStorage.getItem('panier'));
//         commande.push(panier);
//         commande = commande.join('%');
//         localStorage.setItem('panier', commande);
//         return
//     }
//     localStorage.setItem('panier', panier);
// }

document.getElementById('addToCart').addEventListener('click', (e) => {
    e.preventDefault;
    //ajoutPanier(e);
    ajoutPan(e);
})




function ajoutPan(event) {
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
    
    //panier = panier.join('|');


    if (localStorage.getItem('panier')) {
        let tabMulti = localStorage.getItem('panier').split('%');
        //console.log(tabMulti);
        // if (tabMulti.length == 1) {
        for (const i in tabMulti) {
            let tabCommande = JSON.parse(tabMulti[i]);
            console.log(panier);
            if (tabCommande.id == id && tabCommande.color == color) {
                tabCommande.quantity = parseInt(tabCommande.quantity);
                //console.log(tabCommande.quantity);
                tabCommande.quantity += quantity;
                tabCommande = JSON.stringify(tabCommande);
                console.log(tabMulti);
                tabMulti[i] = tabCommande;
                tabMulti = tabMulti.join('%');
                localStorage.setItem('panier', tabMulti);
                return
            // }else{
            }
        }
        tabMulti.push(JSON.stringify(panier));
        tabMulti = tabMulti.join('%');
        localStorage.setItem('panier', tabMulti);


        // }
        // let commande = [];
        // commande.push(localStorage.getItem('panier'));
        // commande.push(panier);
        // commande = commande.join('%');
        // localStorage.setItem('panier', JSON.stringify(commande));
        //alert(tabCommande);
        return
        // alert('panier présent');
        // return
    }
    localStorage.setItem('panier', JSON.stringify(panier));
    //alert(panier);
}
