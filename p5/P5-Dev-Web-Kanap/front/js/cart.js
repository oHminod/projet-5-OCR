let tabMulti = [];
let total = 0;
let quant = 0;

debut();
listenForm();
/**
 * * debut
 * Fonction qui récupère le panier s'il existe
 * et appelle la fonction trouverPanier
 */
function debut() {
    if (localStorage.getItem('panier')) {
        tabMulti = localStorage.getItem('panier').split('%');
        trouverPanier(tabMulti);
    }else{
        document.querySelector('h1').innerText = "Votre panier est vide";
        return
    }
}
/**
 * * trouverPanier
 * Fonction asynchrone qui appelle la fonction canap
 * avec chaque item du panier
 * @param  {} tab tableau d'objets json en format string
 */
async function trouverPanier(tab) {
    for (const i in tab) {
        let item = JSON.parse(tab[i]);
        await canape(item);
    }
    afficherTotal(total, quant);
    AfficherQuantitePanier();
}

/**
 * *canape
 * Fonction asynchrone qui récupère les données manquante de chaque objet
 * et appelle la fonction afficherPanier avec le résultat et l'item
 * ou le fonction erreurChargement avec l'erreur le cas échéant
 * @param  {} item item du panier (id, couleur, quantité)
 */
async function canape(item) {
    try {
        const reponse = await fetch(`http://localhost:3000/api/products/${item.id}`);
        const resultat = await reponse.json();
        afficherPanier(resultat, item);
    } catch (erreur) {
        erreurChargement(erreur);
    }
}
/**
 * * erreurChargement
 * Fonction qui affiche l'erreur de la fonction canape
 * @param  {} erreur
 */
function erreurChargement(erreur) {
    console.log(erreur);
    cart__items.innerText = "Il y a eu un problème lors du chargement du panier !";
}
/**
 * * afficherPanier
 * Fonction qui affiche un item du panier
 * @param  {} obj : objet canape de l'API correspondant à l'item du panier
 * @param  {} item : item du panier avec la quantité et la couleur
 */
function afficherPanier(obj, item) {
    total += parseInt(obj.price) * parseInt(item.quantity);
    quant += parseInt(item.quantity);
    const canap = document.createElement('article');
    canap.classList.add('cart__item');
    canap.setAttribute('data-id', item.id);
    canap.setAttribute('data-color', item.color);
    canap.id = 'id-' + item.id + item.color;
    canap.innerHTML =
    `<div class="cart__item__img">
    <img src="${obj.imageUrl}" alt="${obj.altTxt}">
  </div>
  <div class="cart__item__content">
    <div class="cart__item__content__description">
      <h2>${obj.name}</h2>
      <p>${item.color}</p>
      <p>${obj.price} €</p>
    </div>
    <div class="cart__item__content__settings">
      <div class="cart__item__content__settings__quantity">
        <p>Qté : </p>
        <input type="number" class="itemQuantity" id="quant-${item.id + item.color}" name="itemQuantity" min="1" max="100" value="${item.quantity}">
      </div>
      <div class="cart__item__content__settings__delete">
        <p class="deleteItem" id="delete-${item.id + item.color}">Supprimer</p>
      </div>
    </div>
  </div>`;
    cart__items.appendChild(canap);
    let ancienneQuantite = parseInt(item.quantity);
    quantiteDynamique(item, obj, ancienneQuantite);
    supprimerItem(item, obj);
}
/**
 * * quantiteDynamique
 * Fonction permettant de mettre à jour les quantités et le prix total 
 * au niveau de l'affichage et du locale storage quand on fait 
 * des modifications dans la page panier
 * @param  {} item : item du panier avec la quantité et la couleur
 * @param  {} obj : objet canape de l'API correspondant à l'item du panier
 * @param  {} ancienneQuantite : quantité avant modification
 */
function quantiteDynamique(item, obj, ancienneQuantite) {
    const modifQuant = document.getElementById(`quant-${item.id + item.color}`);
    modifQuant.addEventListener('input', (e) => {
        let nouvelleQuantite = parseInt(e.target.value);
        let offsetQuantite = nouvelleQuantite - ancienneQuantite;
        ancienneQuantite = nouvelleQuantite;
        let offsetPrix = parseInt(obj.price) * offsetQuantite;
        prixTotal(offsetPrix);
        totalPrice.innerText = total;
        tabMulti = localStorage.getItem('panier').split('%');
        for (let i in tabMulti) {
            let cetItem = JSON.parse(tabMulti[i]);
            if (cetItem.id == item.id && cetItem.color == item.color) {
                cetItem.quantity = nouvelleQuantite;
                cetItem = JSON.stringify(cetItem);
                tabMulti[i] = cetItem;
                tabMulti = tabMulti.join('%');
                localStorage.setItem('panier', tabMulti);
                totalQuantity.innerText = compterArticles();
                return
            }
        }

    })
}
/**
 * * supprimerItem
 * Fonction permettant de supprimer un item du panier
 * en mettant à jour les quantités et le prix total
 * @param  {} item : item du panier avec la quantité et la couleur
 * @param  {} obj : objet canape de l'API correspondant à l'item du panier
 */
function supprimerItem(item, obj) {
    const deleteItem = document.getElementById(`delete-${item.id + item.color}`);
    deleteItem.addEventListener('click', (e) => {
        let count = document.getElementById(`quant-${item.id + item.color}`);

        let prix = parseInt(obj.price) * parseInt(count.value);
        total = parseInt(total) - prix;
        tabMulti = localStorage.getItem('panier').split('%');
        totalPrice.innerText = total;
        for (let i in tabMulti) {
            let cetItem = JSON.parse(tabMulti[i]);
            if (cetItem.id == item.id && cetItem.color == item.color) {
                const card = document.getElementById(`id-${item.id + item.color}`);
                card.remove();
                tabMulti.splice(i, 1);
                tabMulti = tabMulti.join('%');
                localStorage.setItem('panier', tabMulti);
                totalQuantity.innerText = compterArticles();
                if (!localStorage.getItem('quantite')) {
                    totalQuantity.innerText = '0';
                }
                return
            }
        }
    })
}
/**
 * * afficherTotal
 * Fonction pour afficher le prix et la quantité totale 
 * au chargement de la page
 * @param  {} total : prix total
 * @param  {} quant : quantité totale
 */
function afficherTotal(total, quant) {
    totalPrice.innerText = total;
    totalQuantity.innerText = quant;
}
/**
 * * compterArticles
 * Fonction qui compte le nombre d'articles dans le panier
 * @returns le nombre d'articles dans le panier
 */
function compterArticles() {
    if (!localStorage.getItem('panier')) {
        if (localStorage.getItem('quantite')) {
            localStorage.clear('quantite');
            AfficherQuantitePanier();
            totalQuantity.innerText = '0';
            totalPrice.innerText = '0';
        }
        return
    }
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
 * * prixTotal
 * Fonction pour modifier le prix total
 * @param  {} number nombre à ajouter au total
 */
function prixTotal(number) {
    total += parseInt(number);
    return
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
        return
    }
    let panNav = document.querySelector('nav > ul > a:last-child > li');
        panNav.innerText = `Panier`;
}
/**
 * Initialisation des variables utiles à la validation du formulaire
 */
let prenomOk, nomOk, adresseOk, villeOk, emailOk, contact;
contact = {
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    email: ""
};
/**
 * * listenForm
 * Fonction d'écoute des entrées du formulaire
 */
function listenForm() {
    firstName.addEventListener('input', (e) => {
        let prenom = e.target.value;
        verifNom(prenom) ? firstNameErrorMsg.innerText = '' : firstNameErrorMsg.innerText = "Le champ prénom doit contenir seulement des lettres. (espace, tiret et apostrophe seulement entre deux mots, pas plus d'un espace consécutif)";
        verifNom(prenom) ? prenomOk = true : prenomOk = false;
        contact.firstName = prenom;
        if (prenom == '') {firstNameErrorMsg.innerText = ''}
    })
    lastName.addEventListener('input', (e) => {
        let nom = e.target.value;
        verifNom(nom) ? lastNameErrorMsg.innerText = '' : lastNameErrorMsg.innerText = "Le champ nom doit contenir seulement des lettres. (espace, tiret et apostrophe seulement entre deux mots, pas plus d'un espace consécutif)";
        verifNom(nom) ? nomOk = true : nomOk = false;
        contact.lastName = nom;
        if (nom == '') {lastNameErrorMsg.innerText = ''}
    })
    address.addEventListener('input', (e) => {
        let adresse = e.target.value;
        verifAdresse(adresse) ? addressErrorMsg.innerText = '' : addressErrorMsg.innerText = "Entrer une adresse valide, terminer par le code postal.";
        verifAdresse(adresse) ? adresseOk = true : adresseOk = false;
        contact.address = adresse;
        if (adresse == '') {addressErrorMsg.innerText = ''}
    })
    city.addEventListener('input', (e) => {
        let ville = e.target.value;
        verifVille(ville) ? cityErrorMsg.innerText = '' : cityErrorMsg.innerText = "Entrer un nom de ville valide. (espace, tiret et apostrophe seulement entre deux mots, pas plus d'un espace consécutif)";
        verifVille(ville) ? villeOk = true : villeOk = false;
        contact.city = ville;
        if (ville == '') {cityErrorMsg.innerText = ''}
    })
    email.addEventListener('input', (e) => {
        let mail = e.target.value;
        verifEmail(mail) ? emailErrorMsg.innerText = '' : emailErrorMsg.innerText = "Entrer une adresse email valide.";
        verifEmail(mail) ? emailOk = true : emailOk = false;
        contact.email = mail;
        if (mail == '') {emailErrorMsg.innerText = ''}
    })
}
/**
 * * verifNom
 * Fonction pour vérifier le nom et le prénom
 * @param {string} string 
 * @returns bool
 */
function verifNom(string) {
	let re = /^[a-zA-Z\u0080-\u024F]+(?:([\ \-\']|(\.\ ))[a-zA-Z\u0080-\u024F]+)*$/;
    return re.test(string);
}
/**
 * * verifAdresse
 * Fonction pour vérifier l'adresse
 * @param {string} string 
 * @returns bool
 */
function verifAdresse(string) {
    //let re = /([0-9a-zA-Z,\. ]*) ?(\b[0-9]{5}\b)$/;
    let re = /^[0-9,a-zA-Z\u0080-\u024F]+(?:([\ \-\']|(\.\ ))[a-zA-Z\u0080-\u024F]+)* ?(\b[0-9]{5}\b)$/;
    return re.test(string);
}
/**
 * * verifVille
 * Fonction pour vérifier le nom de la ville
 * @param {string} string 
 * @returns bool
 */
function verifVille(string) {
    let re = /^[a-zA-Z\u0080-\u024F]+(?:([\ \-\']|(\.\ ))[a-zA-Z\u0080-\u024F0-9]+)*$/;
	return re.test(string);
}
/**
 * * verifEmail
 * Fonction pour vérifier l'email
 * @param {string} string 
 * @returns bool
 */
function verifEmail(string) {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(string);
}

//ne pas utiliser le comportement par défaut du formulaire
document.querySelector('.cart__order__form').addEventListener("submit", (e) => {
    e.preventDefault();
})
//utiliser la fonction submit à la place
document.getElementById('order').addEventListener('click', (e) => {
    e.preventDefault;
    submit();
})
/**
 * * submit
 * Fonction pour mettre en forme les données du formulaire
 * avant de les envoyer à la fonction post()
 */
function submit() {
    panierOrder = localStorage.getItem('panier');
    if (panierOrder && prenomOk && nomOk && adresseOk && villeOk && emailOk) {

        let products = [];
        panierOrder = panierOrder.split('%');
        for (const canapID of panierOrder) {
            products.push(JSON.parse(canapID).id);
        }
        let commande = {
            contact: contact,
            products: products
        }
        post(commande);
    }else{
        alert('Remplir correctement tous les champs et vérifier que le panier n\'est pas vide');
    }
}
/**
 * * post
 * Fonction asynchrone qui envois une requête à l'api
 * avec les données du client et du panier
 * renvois vers la page de confirmation avec l'orederId dans le get
 * en cas de succès
 * @param {json} commande 
 */
async function post(commande) {
    let response = await fetch('http://localhost:3000/api/products/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(commande)
    });
      
    let result = await response.json();
    
    if (result.orderId) {
        let fin = window.location.href.indexOf("html/") + 5;
        let confirmation = window.location.href.slice(0, fin) + `confirmation.html?id=${result.orderId}`;
    
        localStorage.clear();
        document.location.href = confirmation;
    }else{
        alert(`Il y a un problème avec le serveur, envoyer ce message à un administrateur :\n ${result}`)
    }
}
