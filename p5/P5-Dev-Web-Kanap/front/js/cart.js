let tabMulti = [];
let total = 0;
let quant = 0;
if (localStorage.getItem('panier')) {
    //On récupère le tableau d'objets stringifiés à partir du local storage
    tabMulti = localStorage.getItem('panier').split('%');
}
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
        // console.log(prix, ' = prix');
        // console.log(obj.price, ' = obj.price');
        // console.log(cetteQuantite, ' = cetteQuantite');
        // console.log(total, ' = total 1');
        total = parseInt(total) - prix;
        // console.log(total, ' = total 2');
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
