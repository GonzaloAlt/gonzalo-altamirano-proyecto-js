/* DOCUMENTACIÓN API https://github.com/Castrogiovanni20/api-dolar-argentina */

const API = "https://apiarg.herokuapp.com/api/";
const defaultSearches = [
  { dolaroficial: "Dolar oficial" },
  { dolarBlue: "Dolar blue" },
  { contadoliqui: "Contado con liqui" },
  { dolarbolsa: "Dolar bolsa" },
];

const bankList = [
  { bbva: "Banco BBVA" },
  { piano: "Banco Piano" },
  { hipotecario: "Banco Hipotecario" },
  { galicia: "Banco Galicia" },
  { santander: "Banco Santander" },
  { ciudad: "Banco Ciudad" },
  { supervielle: "Banco Supervielle" },
  { patagonia: "Banco Patagonia" },
  { comafi: "Banco Comafi" },
  { nacion: "Banco Nación" },
  { bind: "Banco Industrial" },
  { bancor: "Banco de Córdoba" },
  { chaco: "Nuevo Banco del Chaco" },
  { pampa: "Banco de La Pampa" },
];

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

class Bank {
  constructor(name, buy, sell) {
    this.name = name;
    this.buy = buy;
    this.sell = sell;
  }
}
/* ------------------------------------------------- FUNCIONES------------------------------------------- */

/* Llamado a la API */
let getExchangeData = async (currency) => {
  response = await fetch(`${API}${currency}`);
  const data = await response.json();
  // console.log(data);
  return data;
};
//
//
/*-------------------------------------------------------------------- */
/* Recibe un [{}], llama a getExchangeData() y completa los objetos con los datos de la API */
let getSearch = async (searches) => {
  let bankInfoList = [];
  await searches.reduce(async (pv, cv) => {
    bankInfoList = await pv;
    response = await getExchangeData(Object.keys(cv));
    bankInfoList.push(
      new Bank(Object.values(cv).toString(), response.compra, response.venta)
    );
    return bankInfoList;
  }, Promise.resolve([]));
  // console.log(bankInfoList);
  return bankInfoList;
};
//
//
/*-------------------------------------------------------------------- */
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
/* Renderiza según [{}] se le pasa comp parametro, tipo de selector y nombre de clase/id 
en el que se quiere appendear los resultados */
let renderDataDolar = async (search, selectorType, fatherAppend) => {
  response = getSearch(search);
  data = await response;
  // console.log(data);
  const bankDiv = document.createElement("ul");
  bankDiv.className = "bank-div";
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      const bankCard = document.createElement("li");
      bankCard.className = "bank-card";
      const currency = data[key];
      const bankH2 = document.createElement("H2");
      bankH2.textContent = currency.name;
      const bankH3 = document.createElement("H3");
      bankH3.textContent = `Compra: ${currency.buy} || Venta: ${currency.sell}`;
      bankDiv.appendChild(bankCard);
      bankCard.appendChild(bankH2);
      bankCard.appendChild(bankH3);
    }
  }
  selectorType == "id".toLocaleLowerCase()
    ? document.getElementById(`${fatherAppend}`).appendChild(bankDiv)
    : document
        .getElementsByClassName(`${fatherAppend}`)[0]
        .appendChild(bankDiv);
};

renderDataDolar(defaultSearches, "id", "exchange_container__default_searches");

/*-------------------------------------------------------------------- */
/* Limpia el contenedor para que las busquedas no se concatenen una detrás de otra infinitamente */
const clearContainer = (selectorType, fatherAppend) => {
  selectorType == "id".toLocaleLowerCase()
    ? (document.getElementById(`${fatherAppend}`).innerHTML = "")
    : (document.getElementsByClassName(`${fatherAppend}`)[0].innerHTML = "");
};
/* -------------------------------------------------------------------------------------------------------- */
