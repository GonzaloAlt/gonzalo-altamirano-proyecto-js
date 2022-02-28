let $generateBtn = document.getElementById("generate-btn");

$generateBtn.style.display = localStorage.getItem("boton oculto");
/*-------------------------------------------------------------------- */
renderDataDolar(defaultSearches, "id", "exchange_container__default_searches");
/*-------------------------------------------------------------------- */
let generateMoney = () => {
  return Math.round(Math.random() * (20000000 - 10000) + 10000) / 100;
};
/*-------------------------------------------------------------------- */
/* Crea elementos iniciales del localStorage */
$generateBtn.addEventListener("click", () => {
  localStorage.setItem(
    "dinero en cuenta pesos",
    ($pesosAccount.value = generateMoney())
  );
  localStorage.setItem("plazos fijos conformados", "");
  localStorage.setItem("dinero en cuenta dolares", ($dollarAccount.value = 0));
  localStorage.setItem("boton oculto", ($generateBtn.style.display = "none"));
});
// console.log(localStorage);

/* Limpia el localStorage */
$localStorageBtn.addEventListener("click", () => {
  localStorage.clear();
  movements = [];
  movementBox.innerHTML = "";
  $pesosAccount.value = "";
  $dollarAccount.value = "";
  $generateBtn.style.display = "inline-block";
});
/*-------------------------------------------------------------------- */
/* Muestra movimientos de la cuenta */
let $seeMovementBtn = document.getElementById("see_movement__btn");

$seeMovementBtn.addEventListener("click", () => {
  $movementBox.innerHTML = "";
  seeMovements();
});
/*-------------------------------------------------------------------- */
/* Renderiza los movimientos en cuenta */
let $movementBox = document.getElementById("see_movements__box");
const seeMovements = () => {
  let movements = JSON.parse(localStorage.getItem("Movimientos en cuenta"));
  let movReq = 10;
  movements = movements.reverse();
  for (let i = 0; i <= movReq; i++) {
    const movement = movements[i];

    newDiv = document.createElement("DIV");
    newDiv.className = "see_movements__box__info";

    dateH3 = document.createElement("H3");
    dollarH3 = document.createElement("H3");
    pesosH3 = document.createElement("H3");
    balanceDollarH3 = document.createElement("H3");
    balancePesosH3 = document.createElement("H3");

    dateH3.innerHTML = `Día: <span>${movement.date}</span>`;
    dollarH3.innerHTML = `Dolares: <span>$${
      Math.round(movement.dollar * 100) / 100
    }</span>`;
    pesosH3.innerHTML = `Pesos: <span>$${
      Math.round(movement.pesos * 100) / 100
    }</span>`;
    balanceDollarH3.innerHTML = `Cuenta dolares: <span>$${
      Math.round(movement.balanceDollarAccount * 100) / 100
    }</span>`;
    balancePesosH3.innerHTML = `Cuenta pesos: <span>$${
      Math.round(movement.balancePesosAccount * 100) / 100
    }</span>`;

    newDiv.appendChild(dateH3);
    newDiv.appendChild(dollarH3);
    newDiv.appendChild(pesosH3);
    newDiv.appendChild(balanceDollarH3);
    newDiv.appendChild(balancePesosH3);
    $movementBox.appendChild(newDiv);
  }
};
$seeMovementBtn.addEventListener("click", () => {
  $movementBox.style.display == "none"
    ? ($movementBox.style.display = "flex")
    : ($movementBox.style.display = "none");
});
