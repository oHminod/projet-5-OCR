let tabMulti = [];
let total = 0;
let quant = 0;
function debut() {
    if (localStorage.getItem('panier')) {
        //On récupère le tableau d'objets stringifiés à partir du local storage
        tabMulti = localStorage.getItem('panier').split('%');
    }else{
        document.querySelector('h1').innerText = "Votre panier est vide";
        return
    }
}
debut();
trouverPanier(tabMulti);

async function trouverPanier(tab) {
    for (const i in tab) {
        let item = JSON.parse(tab[i]);
        await canape(item);
    }
    afficherTotal(total, quant);
    AfficherQuantitePanier();
}


async function canape(item) {
    try {
        const reponse = await fetch(`http://localhost:3000/api/products/${item.id}`);
        const resultat = await reponse.json();
        afficherPanier(resultat, item);
    } catch (erreur) {
        erreurChargement(erreur);
    }
}

function erreurChargement(erreur) {
    console.log(erreur);
    cart__items.innerText = "Il y a eu un problème lors du chargement du panier !";
}

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

function afficherTotal(total, quant) {
    totalPrice.innerText = total;
    totalQuantity.innerText = quant;
}
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

function prixTotal(number) {
    total += parseInt(number);
    return
}

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

function sendOrder () {

}
let prenomOk, nomOk, adresseOk, villeOk, emailOk, contact, preno, nomdef, addr, vil, emai;
prenomOk = false;
nomOk = false;
adresseOk = false;
villeOk = false;
emailOk = false;
contact = {
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    email: ""
};

listenForm();
function listenForm() {
    firstName.addEventListener('input', (e) => {
        let prenom = e.target.value;
        verifNom(prenom) ? firstNameErrorMsg.innerText = '' : firstNameErrorMsg.innerText = "Le champ prénom doit contenir seulement des lettres. (espace, tiret et apostrophe seulement entre deux mots, pas plus d'un espace consécutif)";
        verifNom(prenom) ? prenomOk = true : prenomOk = false;
        preno = prenom;
        if (prenom == '') {firstNameErrorMsg.innerText = ''}
    })
    lastName.addEventListener('input', (e) => {
        let nom = e.target.value;
        verifNom(nom) ? lastNameErrorMsg.innerText = '' : lastNameErrorMsg.innerText = "Le champ nom doit contenir seulement des lettres. (espace, tiret et apostrophe seulement entre deux mots, pas plus d'un espace consécutif)";
        verifNom(nom) ? nomOk = true : nomOk = false;
        nomdef = nom;
        if (nom == '') {lastNameErrorMsg.innerText = ''}
    })
    address.addEventListener('input', (e) => {
        let adresse = e.target.value;
        verifAdresse(adresse) ? addressErrorMsg.innerText = '' : addressErrorMsg.innerText = "Entrer une adresse valide, terminer par le code postal.";
        verifAdresse(adresse) ? adresseOk = true : adresseOk = false;
        addr = adresse;
        if (adresse == '') {addressErrorMsg.innerText = ''}
    })
    city.addEventListener('input', (e) => {
        let ville = e.target.value;
        verifVille(ville) ? cityErrorMsg.innerText = '' : cityErrorMsg.innerText = "Entrer un nom de ville valide. (espace, tiret et apostrophe seulement entre deux mots, pas plus d'un espace consécutif)";
        verifVille(ville) ? villeOk = true : villeOk = false;
        vil = ville;
        if (ville == '') {cityErrorMsg.innerText = ''}
    })
    email.addEventListener('input', (e) => {
        let mail = e.target.value;
        verifEmail(mail) ? emailErrorMsg.innerText = '' : emailErrorMsg.innerText = "Entrer une adresse email valide.";
        verifEmail(mail) ? emailOk = true : emailOk = false;
        emai = mail;
        if (mail == '') {emailErrorMsg.innerText = ''}
    })
}

function verifNom(string) {
	let re = /^[a-zA-Z\u0080-\u024F]+(?:([\ \-\']|(\.\ ))[a-zA-Z\u0080-\u024F]+)*$/;
    return re.test(string);
}
function verifAdresse(string) {
    //let re = /([0-9a-zA-Z,\. ]*) ?(\b[0-9]{5}\b)$/;
    let re = /^[0-9,a-zA-Z\u0080-\u024F]+(?:([\ \-\']|(\.\ ))[a-zA-Z\u0080-\u024F]+)* ?(\b[0-9]{5}\b)$/;

    return re.test(string);
}
function verifVille(string) {
    let re = /^[a-zA-Z\u0080-\u024F]+(?:([\ \-\']|(\.\ ))[a-zA-Z\u0080-\u024F0-9]+)*$/;
	return re.test(string);
}
function verifEmail(string) {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(string);
}

document.querySelector('.cart__order__form').addEventListener("submit", (e) => {
    e.preventDefault();
})
document.getElementById('order').addEventListener('click', (e) => {
    e.preventDefault;
    submit();
    console.log('envois !');
})

function submit() {
    panierOrder = localStorage.getItem('panier');
    if (panierOrder && prenomOk && nomOk && adresseOk && villeOk && emailOk) {
        contact.firstName = preno;
        contact.lastName = nomdef;
        contact.address = addr;
        contact.city = vil;
        contact.email = emai;

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

async function post(commande) {
    let response = await fetch('http://localhost:3000/api/products/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(commande)
    });
      
    let result = await response.json();
    // if code de retour OK...
    let fin = window.location.href.indexOf("html/") + 5;
    let confirmation = window.location.href.slice(0, fin) + `confirmation.html?id=${result.orderId}`;

    localStorage.clear();
    document.location.href = confirmation;
}
