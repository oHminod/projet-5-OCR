"use strict";
let tabMulti = [];
let total = 0;
let quant = 0;

debut();
listenForm();
/**
 * * debut
 * Fonction qui récupère le panier et appelle
 * la fonction trouverPanier s'il existe
 * ou indique que le panier est vide et
 * termine le script.
 */
function debut() {
    if (localStorage.getItem("panier")) {
        tabMulti = JSON.parse(localStorage.getItem("panier"));
        trouverPanier(tabMulti);
    } else {
        document.querySelector("h1").innerText = "Votre panier est vide";
        totalQuantity.innerText = "0";
        totalPrice.innerText = "0";
        return;
    }
}

/**
 * * trouverPanier
 * Fonction asynchrone qui appelle la fonction fetchDataCanapes
 * avec chaque item du panier en parallèle, appelle la
 * fonction afficherQuantitePanier une fois toutes les
 * informations reçues.
 * @param  {array} tab tableau d'objets json
 */
async function trouverPanier(tab) {
    const promesseTab = tab.map(async (item) => {
        await fetchDataCanapes(item);
    });
    await Promise.all(promesseTab);
    totalPrice.innerText = total;
    afficherQuantitePanier(quant);
}

/**
 * *fetchDataCanapes
 * Fonction asynchrone qui récupère les données manquante de chaque objet
 * et appelle la fonction afficherPanier avec le résultat et l'item
 * ou la fonction erreurChargement avec l'erreur le cas échéant
 * @param  {json} item item du panier (id, couleur, quantité).
 */
async function fetchDataCanapes(item) {
    try {
        const reponse = await fetch(
            `http://localhost:3000/api/products/${item.id}`
        );
        if ((reponse.status >= 400 && reponse.status < 600) || !reponse.ok) {
            throw new Error(reponse.status + "\n" + reponse.statusText);
        }
        const resultat = await reponse.json();
        afficherPanier(item, resultat);
    } catch (erreur) {
        erreurChargement(erreur);
    }
}

/**
 * * erreurChargement
 * Fonction qui affiche l'erreur de la fonction fetchDataCanapes.
 * @param  {json} erreur
 */
function erreurChargement(erreur) {
    alert(erreur);
    console.log(erreur);
    cart__items.innerText =
        "Il y a eu un problème lors du chargement du panier !";
}

/**
 * * afficherPanier
 * Fonction qui affiche un item du panier et active les fonctions d'écoute
 * des évènements (modification de la quantité et suppression) liès
 * à cet item.
 * @param  {json} obj : objet canape de l'API correspondant à l'item du panier
 * @param  {json} item : item du panier avec la quantité et la couleur.
 */
function afficherPanier(item, obj) {
    const canap = document.createElement("article");
    canap.classList.add("cart__item");
    canap.setAttribute("data-id", item.id);
    canap.setAttribute("data-color", item.color);
    canap.id = "id-" + item.id + item.color;

    const divImg = document.createElement("div");
    divImg.classList.add("cart__item__img");
    canap.appendChild(divImg);

    const imgProduct = document.createElement("img");
    imgProduct.src = obj.imageUrl;
    imgProduct.alt = obj.altTxt;
    divImg.appendChild(imgProduct);

    const divItem = document.createElement("div");
    divItem.classList.add("cart__item__content");
    canap.appendChild(divItem);

    const divDescription = document.createElement("div");
    divDescription.classList.add("cart__item__content__description");
    divItem.appendChild(divDescription);

    const titreProd = document.createElement("h2");
    titreProd.innerText = obj.name;
    divDescription.appendChild(titreProd);

    const couleurProd = document.createElement("p");
    couleurProd.innerText = item.color;
    divDescription.appendChild(couleurProd);

    const quantiteProd = document.createElement("p");
    quantiteProd.innerText = obj.price + " €";
    divDescription.appendChild(quantiteProd);

    const divSettings = document.createElement("div");
    divSettings.classList.add("cart__item__content__settings");
    divItem.appendChild(divSettings);

    const divSetQuantity = document.createElement("div");
    divSetQuantity.classList.add("cart__item__content__settings__quantity");
    divSettings.appendChild(divSetQuantity);

    const pQuantite = document.createElement("p");
    pQuantite.innerText = "Qté : ";
    divSetQuantity.appendChild(pQuantite);

    const inputQuantite = document.createElement("input");
    inputQuantite.setAttribute("type", "number");
    inputQuantite.setAttribute("name", "itemQuantity");
    inputQuantite.setAttribute("min", "1");
    inputQuantite.setAttribute("max", "100");
    inputQuantite.classList.add("itemQuantity");
    inputQuantite.id = "quant-" + item.id + item.color;
    inputQuantite.value = item.quantity;
    divSetQuantity.appendChild(inputQuantite);

    const divDelete = document.createElement("div");
    divDelete.classList.add("cart__item__content__settings__delete");
    divSettings.appendChild(divDelete);

    const pDelete = document.createElement("p");
    pDelete.classList.add("deleteItem");
    pDelete.id = "delete-" + item.id + item.color;
    pDelete.innerText = "Supprimer";
    divDelete.appendChild(pDelete);

    cart__items.appendChild(canap);
    quantiteDynamique(item, obj);
    supprimerItem(item, obj);
    total += parseInt(obj.price) * parseInt(item.quantity);
    quant += parseInt(item.quantity);
}

/**
 * * quantiteDynamique
 * Fonction permettant de mettre à jour les quantités et le prix total
 * au niveau de l'affichage et du locale storage quand on fait
 * des modifications dans la page panier.
 * @param  {json} item : item du panier avec la quantité et la couleur
 * @param  {json} obj : objet canape de l'API correspondant à l'item du panier
 * @param  {int} ancienneQuantite : quantité avant modification
 */
function quantiteDynamique(item, obj) {
    const modifQuant = document.getElementById(`quant-${item.id + item.color}`);
    modifQuant.addEventListener("input", (e) => {
        let nouvelleQuantite = parseInt(e.target.value);
        if (nouvelleQuantite < 0) {
            nouvelleQuantite = 0;
            e.target.value = 0;
        } else if (nouvelleQuantite > 100) {
            nouvelleQuantite = 100;
            e.target.value = 100;
        }
        let ancienneQuantite = parseInt(item.quantity);
        let offsetQuantite = nouvelleQuantite - ancienneQuantite;
        ancienneQuantite = nouvelleQuantite;
        quant += offsetQuantite;
        let offsetPrix = parseInt(obj.price) * offsetQuantite;
        total += offsetPrix;
        totalPrice.innerText = total;
        localStorage.setItem("quantite", quant);
        afficherQuantitePanier(quant);
        item.quantity = nouvelleQuantite;
        let tabMult = JSON.stringify(tabMulti);
        localStorage.setItem("panier", tabMult);
    });
}

/**
 * * supprimerItem
 * Fonction permettant de supprimer un item du panier
 * en mettant à jour les quantités et le prix total.
 * @param  {json} item : item du panier avec la quantité et la couleur
 * @param  {json} obj : objet canape de l'API correspondant à l'item du panier
 */
function supprimerItem(item, obj) {
    const deleteItem = document.getElementById(
        `delete-${item.id + item.color}`
    );
    deleteItem.addEventListener("click", (e) => {
        let count = document.getElementById(`quant-${item.id + item.color}`);

        let prix = parseInt(obj.price) * parseInt(count.value);
        quant -= parseInt(item.quantity);
        total -= prix;
        totalPrice.innerText = total;
        localStorage.setItem("quantite", quant);
        afficherQuantitePanier(quant);
        let itemIndex = tabMulti.indexOf(item);
        const card = document.getElementById(`id-${item.id + item.color}`);
        card.remove();
        tabMulti.splice(itemIndex, 1);
        if (tabMulti.length > 0) {
            let tabMult = JSON.stringify(tabMulti);
            localStorage.setItem("panier", tabMult);
        } else {
            localStorage.clear("panier");
        }
    });
}

/**
 * * afficherQuantitePanier
 * Fonction qui affiche le nombre total d'articles du panier
 * au niveau du lien vers le panier dans la barre de navigation
 * et sur la page panier.
 */
function afficherQuantitePanier(number) {
    let panNav = document.querySelector("nav > ul > a:last-child > li");
    if (number && number > 0) {
        panNav.innerText = `Panier (${number})`;
        totalQuantity.innerText = number;
        return;
    }
    if (
        localStorage.getItem("quantite") &&
        parseInt(localStorage.getItem("quantite")) > 0
    ) {
        let quantite = parseInt(localStorage.getItem("quantite"));
        panNav.innerText = `Panier (${quantite})`;
        return;
    }
    panNav.innerText = `Panier`;
    totalQuantity.innerText = "0";
    document.querySelector("h1").innerText = "Votre panier est vide";
}

/**
 * Initialisation des variables globales utiles à la validation du formulaire.
 */
let prenomOk, nomOk, adresseOk, villeOk, emailOk, contact;
contact = {
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    email: "",
};

/**
 * * listenForm
 * Fonction d'écoute des entrées du formulaire.
 * Si l'entrée est invalide, affiche un message
 * d'erreur (sauf si le champ est vide) et défini
 * false pour la variable prenomOk.
 * Si l'entrée est valide, défini true à prenomOk.
 */
function listenForm() {
    firstName.addEventListener("input", (e) => {
        let prenom = e.target.value;
        verifNom(prenom)
            ? (firstNameErrorMsg.innerText = "")
            : (firstNameErrorMsg.innerText =
                  "Le champ prénom doit contenir seulement des lettres. (espace, tiret et apostrophe seulement entre deux mots, pas plus d'un espace consécutif)");
        verifNom(prenom) ? (prenomOk = true) : (prenomOk = false);
        contact.firstName = prenom;
        if (prenom == "") {
            firstNameErrorMsg.innerText = "";
        }
    });
    lastName.addEventListener("input", (e) => {
        let nom = e.target.value;
        verifNom(nom)
            ? (lastNameErrorMsg.innerText = "")
            : (lastNameErrorMsg.innerText =
                  "Le champ nom doit contenir seulement des lettres. (espace, tiret et apostrophe seulement entre deux mots, pas plus d'un espace consécutif)");
        verifNom(nom) ? (nomOk = true) : (nomOk = false);
        contact.lastName = nom;
        if (nom == "") {
            lastNameErrorMsg.innerText = "";
        }
    });
    address.addEventListener("input", (e) => {
        let adresse = e.target.value;
        verifAdresse(adresse)
            ? (addressErrorMsg.innerText = "")
            : (addressErrorMsg.innerText =
                  "Entrer une adresse valide, terminer par le code postal.");
        verifAdresse(adresse) ? (adresseOk = true) : (adresseOk = false);
        contact.address = adresse;
        if (adresse == "") {
            addressErrorMsg.innerText = "";
        }
    });
    city.addEventListener("input", (e) => {
        let ville = e.target.value;
        verifVille(ville)
            ? (cityErrorMsg.innerText = "")
            : (cityErrorMsg.innerText =
                  "Entrer un nom de ville valide. (espace, tiret et apostrophe seulement entre deux mots, pas plus d'un espace consécutif)");
        verifVille(ville) ? (villeOk = true) : (villeOk = false);
        contact.city = ville;
        if (ville == "") {
            cityErrorMsg.innerText = "";
        }
    });
    email.addEventListener("input", (e) => {
        let mail = e.target.value;
        verifEmail(mail)
            ? (emailErrorMsg.innerText = "")
            : (emailErrorMsg.innerText = "Entrer une adresse email valide.");
        verifEmail(mail) ? (emailOk = true) : (emailOk = false);
        contact.email = mail;
        if (mail == "") {
            emailErrorMsg.innerText = "";
        }
    });
}

/**
 * * verifNom
 * Fonction pour vérifier le nom et le prénom.
 * @param {string} string
 * @returns bool
 */
function verifNom(string) {
    let re =
        /^[a-zA-Z\u0080-\u024F]+(?:([\ \-\']|(\.\ ))[a-zA-Z\u0080-\u024F]+)*$/;
    return re.test(string);
}

/**
 * * verifAdresse
 * Fonction pour vérifier l'adresse.
 * @param {string} string
 * @returns bool
 */
function verifAdresse(string) {
    //let re = /([0-9a-zA-Z,\. ]*) ?(\b[0-9]{5}\b)$/;
    let re =
        /^[0-9,a-zA-Z\u0080-\u024F]+(?:([\ \-\']|(\.\ ))[a-zA-Z\u0080-\u024F]+)* ?(\b[0-9]{5}\b)$/;
    return re.test(string);
}

/**
 * * verifVille
 * Fonction pour vérifier le nom de la ville.
 * @param {string} string
 * @returns bool
 */
function verifVille(string) {
    let re =
        /^[a-zA-Z\u0080-\u024F]+(?:([\ \-\']|(\.\ ))[a-zA-Z\u0080-\u024F0-9]+)*$/;
    return re.test(string);
}

/**
 * * verifEmail
 * Fonction pour vérifier l'email.
 * @param {string} string
 * @returns bool
 */
function verifEmail(string) {
    let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
    return re.test(string);
}

//ne pas utiliser le comportement par défaut du formulaire
//utiliser la fonction submit à la place
document.getElementById("order").addEventListener("click", (e) => {
    e.preventDefault();
    submit();
});

/**
 * * submit
 * Fonction pour mettre en forme les données du formulaire
 * avant de les envoyer à la fonction post().
 */
function submit() {
    let panierOrder = JSON.parse(localStorage.getItem("panier"));
    let quantite = localStorage.getItem("quantite");
    if (
        panierOrder &&
        prenomOk &&
        nomOk &&
        adresseOk &&
        villeOk &&
        emailOk &&
        quantite > 0
    ) {
        let products = [];
        for (const item of panierOrder) {
            if (item.quantity > 0) {
                products.push(item.id);
            }
        }
        let commande = {
            contact: contact,
            products: products,
        };
        commande = {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify(commande),
        };
        post(commande);
    } else {
        alert(
            "Remplir correctement tous les champs et vérifier que le panier n'est pas vide"
        );
    }
}

/**
 * * post
 * Fonction asynchrone qui envois une requête à l'api
 * avec les données du client et du panier
 * renvois vers la page de confirmation avec l'orederId dans le get
 * en cas de succès.
 * @param {json} commande
 */
async function post(commande) {
    try {
        let response = await fetch(
            "http://localhost:3000/api/products/order",
            commande
        );

        if ((response.status >= 400 && response.status < 600) || !response.ok) {
            throw new Error(response.status + "\n" + response.statusText);
        }

        let result = await response.json();

        let fin = window.location.href.indexOf("html/") + 5;
        let confirmation =
            window.location.href.slice(0, fin) +
            `confirmation.html?id=${result.orderId}`;

        localStorage.clear();
        document.location.href = confirmation;
    } catch (error) {
        alert(
            `Il y a un problème avec le serveur, contacter un administrateur : \n\n${error}`
        );
    }
}
