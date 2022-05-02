renderDataDolar(defaultSearches, "id", "exchange_container__default_searches");

let officialDollarPrice = {
  buy: 110,
  sell: 110,
};
const buyLimit = 200;
/* Hace un llamado a la API para buscar el valor del dolar oficial */
const getOfficialDollar = async () => {
  try {
    response = getExchangeData("dolaroficial");
    data = await response;
    officialDollarPrice.buy = parseFloat(data.compra);
    officialDollarPrice.sell = parseFloat(data.venta);
  } catch (e) {
    throw new Error(error);
  }
};

const impuestoPais = officialDollarPrice.sell * 0.3;
const impuestoGanancias = officialDollarPrice.sell * 0.35;
// const dollarTax = impuestoPais + impuestoGanancias;
getOfficialDollar();

/*-------------------------------------------------------------------- */
const buyDollars = (amount, currencyType) => {
  calculateAmount(amount, currencyType);

  alertExchange("");

  if (accountBuyValidations(pesosAmount, dollarAmount)) {
    if (buyDollarsValidations(pesosAmount, dollarAmount)) {
      showBuyCharges(dollarAmount);
    }
  } else return;
};
/*-------------------------------------------------------------------- */
/* Validaciones de la cuenta y de las normas mensuales en la compra de dolares */
const accountBuyValidations = (pesosAmount, dollarAmount) => {
  if (!checkPesosAccountMoney(pesosAmount)) {
    alertExchange("*Excede la cantidad en su cuenta");
    return false;
  }
  if (!minAmount(dollarAmount)) {
    alertExchange("*Ingrese monto mayor a 0");
    return false;
  }
  return pesosAmount, dollarAmount;
};

const buyDollarsValidations = (pesosAmount, dollarAmount) => {
  if (!limitBuyPerMonth(dollarAmount)) {
    alertExchange("*Excede el límite mensual permitido");
    return false;
  }
  if (!limitAmount(dollarAmount)) {
    alertExchange("*Excede el límite mensual permitido");
    return false;
  }
  return pesosAmount, dollarAmount;
};
/*-------------------------------------------------------------------- */
/* Crea alerta en el DOM */
const alertExchange = (msg) => {
  const myAlert = document.getElementById("alert_exchange");
  myAlert.innerHTML = "";
  const myMsg = document.createElement("H4");
  myMsg.innerHTML = msg;
  myAlert.appendChild(myMsg);
};
/*-------------------------------------------------------------------- */
/* Calculos según moneda elegida */
const calculateAmount = (amount, currencyType) => {
  currencyType == "dollar"
    ? calculateDollarAmount(amount)
    : calculatePesosAmount(amount);
  return pesosAmount;
};

const calculateDollarAmount = (amount) => {
  dollarAmount = amount;
  return (pesosAmount =
    (impuestoGanancias + impuestoPais + officialDollarPrice.sell) *
    dollarAmount);
};
const calculatePesosAmount = (amount) => {
  pesosAmount = amount;
  return (dollarAmount =
    pesosAmount /
    (impuestoGanancias + impuestoPais + officialDollarPrice.sell));
};
/*-------------------------------------------------------------------- */
/* Valida dinero en cuenta pesos */
const checkPesosAccountMoney = (amountReq) => {
  return parseFloat(amountReq) <=
    parseFloat(localStorage.getItem("dinero en cuenta pesos"))
    ? true
    : false;
};
const minAmount = (dollarAmount) => {
  return dollarAmount > 0 ? true : false;
};

/*-------------------------------------------------------------------- */
/* Valida selección de moneda */
/*Funcion llamada desde el DOM!!!*/

let checkCurrency = (currencyFunction) => {
  let buyAmountSelection = [];
  $currencies = document.querySelectorAll(".buy-amount");
  for (let i = 0; i < $currencies.length; i++) {
    const $currency = $currencies[i];
    if ($currency.checked) buyAmountSelection.push($currency);
  }
  buyAmountSelection[0].id == "dollar-amount"
    ? currencyFunction(document.getElementById("exchange").value, "dollar")
    : currencyFunction(document.getElementById("exchange").value, "pesos");
};

const limitAmount = (dollarAmount) => {
  return dollarAmount <= buyLimit ? true : false;
};
/*-------------------------------------------------------------------- */
/* Muestra los cargos y llama a debitCreditCurrencys() si se aceptan */
const showBuyCharges = (dollarAmount) => {
  const $charges = document.getElementById("charges");
  $charges.innerHTML = "";
  $newDiv = document.createElement("DIV");
  $newDiv.className = "generated_charges";

  $dollarH3 = document.createElement("H3");
  $pesosH3 = document.createElement("H3");
  $impPaisH3 = document.createElement("H3");
  $impGananciasH3 = document.createElement("H3");
  $totalDebitH3 = document.createElement("H3");

  $buttonAccept = document.createElement("BUTTON");
  $buttonDecline = document.createElement("BUTTON");

  $dollarH3.innerHTML = `Dolares comprados: <span>$${dollarAmount}</span>`;
  $pesosH3.innerHTML = `Pesos sin impuestos: <span>$${
    officialDollarPrice.sell * dollarAmount
  }</span>`;
  $impPaisH3.innerHTML = `Impuesto pais: <span>$${
    impuestoPais * dollarAmount
  }</span>`;
  $impGananciasH3.innerHTML = `Impuesto a las ganancias: <span>$${
    impuestoGanancias * dollarAmount
  }</span>`;
  $totalDebitH3.innerHTML = `Total pesos debitados: <span>$${
    impuestoPais * dollarAmount +
    officialDollarPrice.sell * dollarAmount +
    impuestoGanancias * dollarAmount
  }</span>`;

  $buttonAccept.innerHTML = `Confirmar`;

  $buttonDecline.innerHTML = `Cancelar`;

  $newDiv.appendChild($dollarH3);
  $newDiv.appendChild($pesosH3);
  $newDiv.appendChild($impPaisH3);
  $newDiv.appendChild($impGananciasH3);
  $newDiv.appendChild($totalDebitH3);
  $newDiv.appendChild($buttonAccept);
  $newDiv.appendChild($buttonDecline);
  $charges.appendChild($newDiv);
  $buttonAccept.addEventListener("click", () => {
    $charges.innerHTML = "";
    debitCreditCurrencys(parseFloat(-pesosAmount), dollarAmount);
    return true;
  });
  $buttonDecline.addEventListener("click", () => {
    $charges.innerHTML = "";
    return false;
  });
};

/*-------------------------------------------------------------------- */
/* Suma movimientos en dolares para limitar los 200 dolares mensuales */

const limitBuyPerMonth = (dollarAmount) => {
  acumulator = [];
  monthMovements = JSON.parse(localStorage.getItem("Movimientos en cuenta"));
  newDate = new Date();
  newDate = newDate.toLocaleDateString();
  initialValue = parseFloat(dollarAmount);
  if (monthMovements) {
    for (const move of monthMovements) {
      if (filterMonth(move.date) == filterMonth(newDate)) acumulator.push(move);
    }
    let totalPurchased = acumulator
      .map((amount) => amount.dollar)
      .reduce((acc, dollar) => acc + dollar, initialValue);
    if (totalPurchased > 200) {
      return false;
    } else return true;
  } else return true;
};
const filterMonth = (date) => {
  originalDate = date.split("/");
  modifiedDate = originalDate.shift();
  return originalDate.join("/");
};
/*-------------------------------------------------------------------- */
let movements = [];
class Movement {
  constructor(date, dollar, pesos, balancePesosAccount, balanceDollarAccount) {
    this.date = date;
    this.dollar = dollar;
    this.pesos = pesos;
    this.balancePesosAccount = balancePesosAccount;
    this.balanceDollarAccount = balanceDollarAccount;
  }
}
/*-------------------------------------------------------------------- */
/* Crea movimientos en el LocalStorage */
const debitCreditCurrencys = (pesos, dollar) => {
  pesos = parseFloat(pesos);
  dollar = parseFloat(dollar);

  localStorage.setItem(
    "dinero en cuenta pesos",
    ($pesosAccount.value =
      parseFloat(localStorage.getItem("dinero en cuenta pesos") / 10) * 10 +
      parseFloat(pesos / 10) * 10)
  );

  movement = new Movement(
    new Date().toLocaleDateString(),
    dollar,
    pesos,
    parseFloat($pesosAccount.value),
    parseFloat($dollarAccount.value) + dollar
  );

  movements.push(movement);

  localStorage.setItem(
    "dinero en cuenta dolares",
    ($dollarAccount.value = setInitialValue(dollar))
  );
  localStorage.setItem("Movimientos en cuenta", JSON.stringify(movements));
};

const setInitialValue = (amountReq) => {
  let valueStorage = localStorage.getItem("dinero en cuenta dolares");
  valueStorage = JSON.parse(valueStorage);
  initialValue = valueStorage + amountReq;
  return initialValue;
};

const saveStorageMovements = () => {
  if (localStorage.getItem("Movimientos en cuenta")) {
    let movementsRefresh = JSON.parse(
      localStorage.getItem("Movimientos en cuenta")
    );
    movements.push(...movementsRefresh);
  }
};
saveStorageMovements();
/*-------------------------------------------------------------------- */
