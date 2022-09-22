"use strict";
//Affiche l'orderId
let url = window.location.href;
let id;
url = new URL(url);
let search_params = new URLSearchParams(url.search);
search_params.has("id")
    ? (id = search_params.get("id"))
    : alert("Pas d'id produit");
document.getElementById("orderId").innerText = id;
