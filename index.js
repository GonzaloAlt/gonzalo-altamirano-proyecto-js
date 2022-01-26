/* DOCUMENTACIÓN API https://github.com/Castrogiovanni20/api-dolar-argentina */

/* PARA HACER
  1. Crear dinamicamente cada cotización en el DOM.
  2. Crear una función que reciba como parametros funcion para traer datos, 
  funcion para mostrar en DOM y el nodo al que va a appendear
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
const dolarTax = 1.65;
const riesgoPais = "riesgopais";

let $selectBanks = document.getElementById("select_banks");
let $containerOpt = document.getElementById("exchange_container__options");

$selectBanks.addEventListener("click", () => {
  $containerOpt.style.display = "block";
});

class Bank {
  constructor(name, buy, sell) {
    this.name = name;
    this.buy = buy;
    this.sell = sell;
  }
  setTax() {
    this.buy = buy * dolarTax;
    this.sell = this.sell * dolarTax;
  }
}
/*------------------------------------------------- FUNCIONES------------------------------------------- */

/* Llamado a la API */
let getExchangeData = async (currency) => {
  response = await fetch(`${API}${currency}`);
  const data = await response.json();
  // console.log(data);
  return data;
};
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
getSearch(defaultSearches);

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
/* Valida los bancos seleccionados, devuelve [{}] */
let check = () => {
  let bankSelection = [];
  $arr = document.querySelectorAll(".bank");
  for (let i = 0; i < $arr.length; i++) {
    const element = $arr[i];
    const result = bankList.find((e) => Object.keys(e) == element.id);
    if (element.checked) bankSelection.push(result);
  }
  console.log(bankSelection);
  return bankSelection;
};
//
let renderDataDolar = async (search) => {
  response = getSearch(search);
  data = await response;
  console.log(data);

  const bankDiv = document.createElement("DIV");
  document.getElementById("exchange_container__options").appendChild(bankDiv);
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      const element = data[key];
      console.log(element.name);
    }
  }
  // for (let index = 0; index < data.length; index++) {
  //   const element = data[index];
  //   console.log(element);
  // }

  bankDiv.innerHTML = `<div>
    <h2>asd</h2>
    <h3>Compra: asd</h3>
    <h3>Venta: asd</h3>
  </div>`;
};

renderDataDolar(defaultSearches);

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
