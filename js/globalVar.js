/* Variables globales */

let $pesosAccount = document.getElementById("pesos-account");
let $dollarAccount = document.getElementById("dollar-account");
let $localStorageBtn = document.getElementById("localStorage-btn");
$pesosAccount.value = localStorage.getItem("dinero en cuenta pesos");
$dollarAccount.value = localStorage.getItem("dinero en cuenta dolares");

/*-------------------------------------------------------------------- */
/* Crea alerta en el DOM */
const alertExchange = (msg) => {
  const myAlert = document.getElementById("alert_exchange");
  myAlert.innerHTML = "";
  const myMsg = document.createElement("H4");
  myMsg.innerHTML = msg;
  myAlert.appendChild(myMsg);
};
