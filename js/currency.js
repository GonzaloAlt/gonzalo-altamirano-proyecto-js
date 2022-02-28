let $selectBanks = document.getElementById("select_banks");
let $containerOpt = document.getElementById("exchange_container__options");
const $searchRates = document.getElementById("search-btn");

$selectBanks.addEventListener("click", () => {
  if ($containerOpt.style.display == "none") {
    $containerOpt.style.display = "flex";
    $searchRates.style.display = "flex";
  } else {
    $containerOpt.style.display = "none";
    $searchRates.style.display = "none";
  }
});
$searchRates.addEventListener("click", () => {
  checkBanks();
});

/* ------------------------------------------------- FUNCIONES------------------------------------------- */

/* Crea una lista de inputs con todos los bancos disponibles */
let createBankCheckBox = () => {
  for (const bank of bankList) {
    const bankDiv = document.createElement("DIV");
    bankDiv.innerHTML = `<label for="${Object.keys(
      bank
    )}"><input type="checkbox" id="${Object.keys(
      bank
    )}" class="bank"/>${Object.values(bank)}</label>`;
    bankDiv.className = "bank";
    $containerOpt.appendChild(bankDiv);
  }
};
createBankCheckBox();
//
//
//
/*-------------------------------------------------------------------- */
/* Valida los bancos seleccionados, devuelve [{}] y llama a renderDataDolar() */
let checkBanks = () => {
  clearContainer("class", "exchange_container__banklist_searches");
  let bankSelection = [];
  $arr = document.querySelectorAll(".bank");
  for (let i = 0; i < $arr.length; i++) {
    const element = $arr[i];
    const result = bankList.find((e) => Object.keys(e) == element.id);
    if (element.checked) bankSelection.push(result);
  }

  return renderDataDolar(
    bankSelection,
    "class",
    "exchange_container__banklist_searches"
  );
};
//
//
/*-------------------------------------------------------------------- */

renderDataDolar(defaultSearches, "id", "exchange_container__default_searches");

/*-------------------------------------------------------------------- */
/* Limpia el contenedor para que las busquedas no se concatenen una detrás de otra infinitamente */
const clearContainer = (selectorType, fatherAppend) => {
  selectorType == "id".toLocaleLowerCase()
    ? (document.getElementById(`${fatherAppend}`).innerHTML = "")
    : (document.getElementsByClassName(`${fatherAppend}`)[0].innerHTML = "");
};
/* -------------------------------------------------------------------------------------------------------- */
