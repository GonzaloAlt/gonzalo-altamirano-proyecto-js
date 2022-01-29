/* DOCUMENTACIÓN API https://github.com/Castrogiovanni20/api-dolar-argentina */

/* ------------------------------PARA HACER-------------

  A.API DOLAR
    1.Filtrar cotizaciones de mayor a menor.
    2.Toggle de ocultar o mostrar seleccionador de cotizaciones.
    3.Arreglar doble click de comprobar (está concatenando las búsquedas si se clickea muy rapido, 
      no toma el clearContainer()).
      
    
*/
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

const riesgoPais = "riesgopais";

let $selectBanks = document.getElementById("select_banks");
let $containerOpt = document.getElementById("exchange_container__options");

$selectBanks.addEventListener("click", () => {
  $containerOpt.style.display = "block";
});
document.getElementById("search-btn").addEventListener("click", () => {
  check();
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
/* Crea una lista de inputs con todos los bancos disponibles */
let createBankCheckBox = () => {
  for (const iterator of bankList) {
    const bankDiv = document.createElement("DIV");
    bankDiv.innerHTML = `<label for="${Object.keys(
      iterator
    )}"><input type="checkbox" id="${Object.keys(
      iterator
    )}" class="bank"/>${Object.values(iterator)}</label>`;
    $containerOpt.appendChild(bankDiv);
  }
};
createBankCheckBox();
//
//
//
/* Valida los bancos seleccionados, devuelve [{}] y llama a renderDataDolar() */
let check = () => {
  clearContainer("class", "prueba2");
  let bankSelection = [];
  $arr = document.querySelectorAll(".bank");
  for (let i = 0; i < $arr.length; i++) {
    const element = $arr[i];
    const result = bankList.find((e) => Object.keys(e) == element.id);
    if (element.checked) bankSelection.push(result);
  }

  return renderDataDolar(bankSelection, "class", "prueba2");
};
//
//
/* Renderiza según [{}] se le pasa comp parametro, tipo de selector y nombre de clase/id 
en el que se quiere appendear los resultados */
let renderDataDolar = async (search, selectorType, fatherAppend) => {
  response = getSearch(search);
  data = await response;
  // console.log(data);
  const bankDiv = document.createElement("DIV");
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      const currency = data[key];
      const bankH2 = document.createElement("H2");
      bankH2.textContent = currency.name;
      const bankH3 = document.createElement("H3");
      bankH3.textContent = `Compra: ${currency.buy}|| Venta: ${currency.sell}`;
      bankDiv.appendChild(bankH2);
      bankDiv.appendChild(bankH3);
    }
  }
  selectorType == "id".toLocaleLowerCase()
    ? document.getElementById(`${fatherAppend}`).appendChild(bankDiv)
    : document
        .getElementsByClassName(`${fatherAppend}`)[0]
        .appendChild(bankDiv);
};

renderDataDolar(defaultSearches, "id", "prueba1");

/* Limpia el contenedor para que las busquedas no se concatenen una detrás de otra infinitamente */
const clearContainer = (selectorType, fatherAppend) => {
  selectorType == "id".toLocaleLowerCase()
    ? (document.getElementById(`${fatherAppend}`).innerHTML = "")
    : (document.getElementsByClassName(`${fatherAppend}`)[0].innerHTML = "");
};
/* -------------------------------------------------------------------------------------------------------- */
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// let getSearch = async (searches) => {
//   let bankInfoList = [];
// searches.forEach(async (e) => {
//   response = await getExchangeData(Object.keys(e));

//   bankInfoList.push(
//     new Bank(Object.values(await e).toString(), response.compra, response.venta)
//   );
// });
// console.log(bankInfoList);
// return bankInfoList;
// };
