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
const buyDollars = async (amount, currencyType) => {
  calculateAmount(amount, currencyType);
  alertExchange("");
  if (accountValidations(pesosAmount, dollarAmount)) {
    // showCharges(dollarAmount);
    debitCreditCurrencys(pesosAmount, dollarAmount);
  } else return;
};
const accountValidations = (pesosAmount, dollarAmount) => {
  if (checkAccountMoney(pesosAmount)) {
  } else {
    alertExchange("*Excede la cantidad en su cuenta");
    return false;
  }
  if (minAmount(dollarAmount)) {
  } else {
    alertExchange("*Ingrese monto mayor a 0");
    return false;
  }
  if (limitBuyPerMonth(dollarAmount)) {
  } else {
    alertExchange("*Excede el límite mensual permitido");
    return false;
  }
  if (limitAmount(dollarAmount)) {
  } else {
    alertExchange("*Excede el límite mensual permitido");
    return false;
  }
  return pesosAmount, dollarAmount;
};
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
const checkAccountMoney = (amountReq) => {
  return parseFloat(amountReq) <= $pesosAccount.value ? true : false;
};
/*Funcion llamada desde el DOM- CAMBIAR!!!*/
let checkCurrency = () => {
  let buyAmountSelection = [];
  $currencies = document.querySelectorAll(".buy-amount");
  for (let i = 0; i < $currencies.length; i++) {
    const $currency = $currencies[i];
    if ($currency.checked) buyAmountSelection.push($currency);
  }
  buyAmountSelection[0].id == "dollar-amount"
    ? buyDollars(document.getElementById("exchange").value, "dollar")
    : buyDollars(document.getElementById("exchange").value, "pesos");
};
const limitAmount = (dollarAmount) => {
  return dollarAmount <= buyLimit ? true : false;
};
const minAmount = (dollarAmount) => {
  return dollarAmount > 0 ? true : false;
};
/*-------------------------------------------------------------------- */
const showCharges = (dollarAmount) => {
  console.log(`Dolares: ${dollarAmount}`);
  console.log(
    `Pesos sin impuestos: ${officialDollarPrice.sell * dollarAmount}`
  );
  console.log(`Impuesto pais: ${impuestoPais * dollarAmount}`);
  console.log(`Impuesto a las ganancias: ${impuestoGanancias * dollarAmount}`);
  console.log(
    `Total pesos a debitar:${
      impuestoPais * dollarAmount +
      officialDollarPrice.sell * dollarAmount +
      impuestoGanancias * dollarAmount
    } `
  );
};
/*-------------------------------------------------------------------- */
const setBuyDate = () => {
  let buyDate = new Date();
  // console.log(buyDate.toLocaleDateString());
  let reBuyDate = new Date(buyDate.setMonth(buyDate.getMonth() + 1));
  reBuyDate = new Date(reBuyDate.setDate(1));
  reBuyDate = reBuyDate.toLocaleDateString();
  // console.log(reBuyDate.toLocaleDateString());
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
      if (move.date == newDate) acumulator.push(move);
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
    ($pesosAccount.value = $pesosAccount.value - pesos)
  );
  // let buyDate = new Date();
  // let reBuyDate = new Date(buyDate.setMonth(buyDate.getMonth() + 1));
  // reBuyDate = new Date(reBuyDate.setDate(1));
  // reBuyDate = reBuyDate.toLocaleDateString();
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
    for (const mov of movementsRefresh) {
      movements.push(mov);
    }
  }
};
saveStorageMovements();
/*-------------------------------------------------------------------- */

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
// const addPurchases = (amountReq) => {
//   let initialValue = setInitialValue(amountReq);
// let initialValue = amountReq;

// let addValue = addPurchases2(initialValue);
// return addValue;
//   return initialValue;
// };
// const addPurchases2 = (initialValue) => {
//   let totalPurchased = currencyPurchased
//     .map((amount) => amount.dollar)
//     .reduce((acc, dollar) => acc + dollar, initialValue);
//   return totalPurchased;
// };
