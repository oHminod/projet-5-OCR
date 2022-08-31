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

function erreurChargement(erreur) {
    const err = document.createElement("h2");
    err.innerText = "Il y a eu un problème lors du chargement du catalogue !";
    items.appendChild(err);
    dump(erreur);
}

function dump(obj) {
    var out = '';
    for (var i in obj) {
        out += i + ": " + obj[i] + "\n";
    }

    //alert(out);

    // or, if you wanted to avoid alerts...

    var pre = document.createElement('pre');
    pre.innerHTML = out;
    items.appendChild(pre)
}


function afficherCanaps(tabObj) {
    //console.log("dans la fonction"); //S'affiche
    //let num = 0;
    for (let i in tabObj) {
        // num++;
        // console.log(`dans la boucle ${num}`); //Ne s'affiche pas
        const canap = document.createElement("a");
        canap.href = `./product.html?id=` + tabObj[i]._id;

        const article = document.createElement("article");
        canap.appendChild(article);

        const image = document.createElement("img");
        image.src = tabObj[i].imageUrl;
        image.alt = tabObj[i].altTxt;
        article.appendChild(image);

        const titre = document.createElement("h3");
        titre.classList.add("productName");
        titre.innerText = tabObj[i].name;
        article.appendChild(titre);

        const description = document.createElement("p");
        description.classList.add("productDescription");
        description.innerText = tabObj[i].description;
        article.appendChild(description);


        items.appendChild(canap);
    }
}
