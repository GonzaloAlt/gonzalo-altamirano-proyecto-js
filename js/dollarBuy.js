let officialDollarPrice = {
  buy: 110,
  sell: 110,
};
const buyLimit = 200;
const getOfficialDollar = async () => {
  response = getExchangeData("dolaroficial");
  data = await response;
  officialDollarPrice.buy = parseFloat(data.compra);
  officialDollarPrice.sell = parseFloat(data.venta);
};

const impuestoPais = officialDollarPrice.sell * 0.3;
const impuestoGanancias = officialDollarPrice.sell * 0.35;
const dollarTax = impuestoPais + impuestoGanancias;
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
const alertExchange = (msg) => {
  const myAlert = document.getElementById("alert_exchange");
  myAlert.innerHTML = "";
  const myMsg = document.createElement("H4");
  myMsg.innerHTML = msg;
  myAlert.appendChild(myMsg);
};
/*-------------------------------------------------------------------- */
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
/*Funcion llamada desde el DOM- CAMBIAR!!!*/

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
const setBuyDate = () => {
  let buyDate = new Date();
  let reBuyDate = new Date(buyDate.setMonth(buyDate.getMonth() + 1));
  reBuyDate = new Date(reBuyDate.setDate(1));
  reBuyDate = reBuyDate.toLocaleDateString();
  console.log(reBuyDate);
  return reBuyDate;
};
const limitBuyPerMonth = (dollarAmount) => {
  acumulator = [];
  monthMovements = JSON.parse(localStorage.getItem("Movimientos en cuenta"));
  newDate = new Date();
  newDate = newDate.toLocaleDateString();
  initialValue = parseFloat(dollarAmount);
  if (monthMovements) {
    for (const move of monthMovements) {
      // if (move.date == newDate) acumulator.push(move);
      if (filterMonth(move.date) == filterMonth(newDate)) acumulator.push(move);
    }
    let totalPurchased = acumulator
      .map((amount) => amount.dollar)
      .reduce((acc, dollar) => acc + dollar, initialValue);
    // console.log(totalPurchased);
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

const debitCreditCurrencys = (pesos, dollar) => {
  pesos = parseFloat(pesos);
  dollar = parseFloat(dollar);

  localStorage.setItem(
    "dinero en cuenta pesos",
    ($pesosAccount.value =
      // parseFloat($pesosAccount.value / 10) * 10 + parseFloat(pesos / 10) * 10)
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
let $seeMovementBtn = document.getElementById("see_movement__btn");

$seeMovementBtn.addEventListener("click", () => {
  movementBox.innerHTML = "";
  seeMovements();
});

let movementBox = document.getElementById("see_movements__box");
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
    balancDollarH3 = document.createElement("H3");
    balancPesosH3 = document.createElement("H3");

    dateH3.innerHTML = `Día: <span>${movement.date}</span>`;
    dollarH3.innerHTML = `Dolares: <span>$${
      Math.round(movement.dollar * 100) / 100
    }</span>`;
    pesosH3.innerHTML = `Pesos: <span>$${
      Math.round(movement.pesos * 100) / 100
    }</span>`;
    balancDollarH3.innerHTML = `Cuenta dolares: <span>$${
      Math.round(movement.balanceDollarAccount * 100) / 100
    }</span>`;
    balancPesosH3.innerHTML = `Cuenta pesos: <span>$${
      Math.round(movement.balancePesosAccount * 100) / 100
    }</span>`;

    newDiv.appendChild(dateH3);
    newDiv.appendChild(dollarH3);
    newDiv.appendChild(pesosH3);
    newDiv.appendChild(balancDollarH3);
    newDiv.appendChild(balancPesosH3);
    movementBox.appendChild(newDiv);
  }
};
