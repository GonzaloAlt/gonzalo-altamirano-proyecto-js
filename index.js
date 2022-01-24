/* DOCUMENTACIÓN API https://github.com/Castrogiovanni20/api-dolar-argentina */
const API = "https://apiarg.herokuapp.com/api/";
const defaultSearches = [
  { dolaroficial: "Dolar oficial" },
  { dolarBlue: "Dolar blue" },
  { contadoliqui: "Contado con liqui" },
  { dolarturista: "Dolar turista" },
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
let prueba = [];

let $selectBanks = document.getElementById("select_banks");
let $containerOpt = document.getElementById("exchange_container__options");
let $exchangeContainer = document.getElementsByClassName("exchange_container");

const dolarTax = 1.65;
const riesgoPais = "riesgopais";
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
$selectBanks.addEventListener("click", () => {
  $containerOpt.style.display = "block";
});

/*Llamado a la API*/
let getExchangeData = async (endpoint) => {
  response = await fetch(`${API}${endpoint}`);
  const data = await response.json();
  return data;
};

/*Pide info a getExchangeData para guardar un array de objetos*/
let getSearch = (searches) => {
  searches.forEach(async (e) => {
    const response = await getExchangeData(Object.keys(e));
    prueba.push(
      new Bank(Object.values(e).toString(), response.compra, response.venta)
    );
  });
  console.log(prueba);
  return prueba;
};

getSearch(bankList);
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
/* Valida los bancos seleccionados */
let comprobar = () => {
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

// const resultado = bankList.find((e) => Object.keys(e) == "bbva");

// console.log(resultado);

// let getSearch = async (searches) => {
//   for (const search in searches) {
//     const response = await getExchangeData(search);
//     searches[search].compra = response.compra;
//     searches[search].venta = response.venta;
//   }
//   console.log(searches);
// };

// let getSearch = async (searches) => {
//   for (const search in searches) {
//     const response = await getExchangeData(search);
//     prueba.push(
//       new Bank(searches[search].name, response.compra, response.venta)
//     );
//   }
//   console.log(prueba);
// };

// const banks = {
//   bbva: { name: "Banco BBVA" },
//   piano: { name: "Banco Piano" },
//   hipotecario: { name: "Banco Hipotecario" },
//   galicia: { name: "Banco Galicia" },
//   santander: { name: "Banco Santander" },
//   ciudad: { name: "Banco Ciudad" },
//   supervielle: { name: "Banco Supervielle" },
//   patagonia: { name: "Banco Patagonia" },
//   comafi: { name: "Banco Comafi" },
//   nacion: { name: "Banco Nación" },
//   bind: { name: "Banco Industrial" },
//   bancor: { name: "Banco de Córdoba" },
//   chaco: { name: "Nuevo Banco del Chaco" },
//   pampa: { name: "Banco de La Pampa" },
// };
