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
