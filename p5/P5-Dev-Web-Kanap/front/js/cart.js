let tabMulti = [];
let total = 0;
let quant = 0;
if (localStorage.getItem('panier')) {
    //On récupère le tableau d'objets stringifiés à partir du local storage
    tabMulti = localStorage.getItem('panier').split('%');
}
//console.log(tabMulti);
trouverPanier(tabMulti);

async function trouverPanier(tab) {
    for (const i in tab) {
        let item = JSON.parse(tab[i]);
        await canape(item);
        //console.log(canap.name);
        //console.log(total);
    }
    afficherTotal(total, quant);
}


async function canape(item) {
    try {
        const reponse = await fetch(`http://localhost:3000/api/products/${item.id}`);
        const resultat = await reponse.json();
        afficherPanier(resultat, item);
        //console.log(total);
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
    //console.log(total);
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
    quantiteDynamique(item, obj);
    supprimerItem(item, obj);
    //console.log(obj.price);
}

function quantiteDynamique(item, obj) {
    const modifQuant = document.getElementById(`quant-${item.id + item.color}`);
    modifQuant.addEventListener('input', (e) => {
        let nouvelleQuantite = e.target.value;
        let offset = parseInt(nouvelleQuantite) - parseInt(item.quantity);
        let nouveauPrix = offset * parseInt(obj.price);
        console.log(offset);
        //quant = parseInt(quant) + offset;

        totalPrice.innerText = parseInt(total) + nouveauPrix;
        totalQuantity.innerText = parseInt(quant) + offset;
        //console.log(offset);
        tabMulti = localStorage.getItem('panier').split('%');
        //console.log(tabMulti + '=tabMulti');
        for (let i in tabMulti) {
            let cetItem = JSON.parse(tabMulti[i]);
            if (cetItem.id == item.id && cetItem.color == item.color) {
                cetItem.quantity = nouvelleQuantite;
                cetItem = JSON.stringify(cetItem);
                //console.log(cetItem + ' ' + i);
                tabMulti[i] = cetItem;
                tabMulti = tabMulti.join('%');
                localStorage.setItem('panier', tabMulti);
                return
            }
        }
    })
}

function supprimerItem(item, obj) {
    const deleteItem = document.getElementById(`delete-${item.id + item.color}`);
    deleteItem.addEventListener('click', (e) => {

        let prix = parseInt(obj.price) * parseInt(item.quantity);
        total = parseInt(total) - prix;
        quant = parseInt(quant) - parseInt(item.quantity);
        console.log(prix + '  prix');
        console.log(total + '  total');
        //console.log(newPrix + '  newPrix');
        totalPrice.innerText = total;
        totalQuantity.innerText = quant;
        //console.log(offset);
        tabMulti = localStorage.getItem('panier').split('%');
        //console.log(tabMulti + '=tabMulti');
        for (let i in tabMulti) {
            let cetItem = JSON.parse(tabMulti[i]);
            if (cetItem.id == item.id && cetItem.color == item.color) {
                const card = document.getElementById(`id-${item.id + item.color}`);
                //console.log(card);
                card.remove();
                tabMulti.splice(i, 1);
                //tabMulti[i] = cetItem;
                tabMulti = tabMulti.join('%');
                localStorage.setItem('panier', tabMulti);
                return
            }
        }
    })
}

function afficherTotal(total, quant) {
    totalPrice.innerText = total;
    totalQuantity.innerText = quant;
}
