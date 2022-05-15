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

class Bank {
  constructor(name, buy, sell) {
    this.name = name;
    this.buy = buy;
    this.sell = sell;
  }
}

/* Llamado a la API */
let getExchangeData = async (currency) => {
  try {
    response = await fetch(`${API}${currency}`);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};
//
//
/*-------------------------------------------------------------------- */
/* Recibe un [{}], llama a getExchangeData() y completa los objetos con los datos de la API */
let getSearch = async (searches) => {
  try {
    let bankInfoList = [];
    await searches.reduce(async (pv, cv) => {
      bankInfoList = await pv;
      response = await getExchangeData(Object.keys(cv));
      bankInfoList.push(
        new Bank(Object.values(cv).toString(), response.compra, response.venta)
      );
      return bankInfoList;
    }, Promise.resolve([]));
    console.log(bankInfoList);
    return bankInfoList;
  } catch (error) {
    console.log(error);
  }
};
/*-------------------------------------------------------------------- */
/* Renderiza según [{}] se le pasa comp parametro, tipo de selector y nombre de clase/id 
en el que se quiere appendear los resultados */
let renderDataDolar = async (search, selectorType, fatherAppend) => {
  try {
    response = getSearch(search);
    console.log(search);
    data = await response;
    console.log(data);
    const bankDiv = document.createElement("ul");
    bankDiv.className = "bank-div";
    for (const key in data) {
      console.log(key);
      if (Object.hasOwnProperty.call(data, key)) {
        const bankCard = document.createElement("li");
        bankCard.className = "bank-card";
        // bankCard.id = Object.keys(search[key]).toString();
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
  } catch (error) {
    console.log(error);
  }
};
