/* Variables globales */

let $pesosAccount = document.getElementById("pesos-account");
let $dollarAccount = document.getElementById("dollar-account");
let $localStorageBtn = document.getElementById("localStorage-btn");
$pesosAccount.value = localStorage.getItem("dinero en cuenta pesos");
$dollarAccount.value = localStorage.getItem("dinero en cuenta dolares");
