/* ------------------------------PARA HACER---------------------------------
COMPRA DE CUPO MENSUAL DE DOLARES
1. Comprar en banco seleccionado.
2. Limitar la compra a $200.
3. Guardar compra en el localStorage para no sobrepasar esos $200 mensuales.
4. Calcular impuestos *1.65.
5. Botón para limpiar el localStorage.
*/
const buyLimit = 200;
let officialDollarPrice = {
  buy: 110.68,
  sell: 110.68,
}; /* hardcodeado hasta vincular valor de API */
const impuestoPais = officialDollarPrice.sell * 0.3;
const impuestoGanancias = officialDollarPrice.sell * 0.35;
const dollarTax = impuestoPais + impuestoGanancias;

const buyDollars = (amount, currencyType) => {
  calculateAmount(amount, currencyType);
  if (checkAccountMoney(pesosAmount)) {
    limitAmount(dollarAmount)
      ? generateCharges(dollarAmount)
      : console.log("Excede el límite mensual permitido");
  } else {
    console.log("Excede la cantidad en su cuenta");
  }
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
const generateCharges = (dollarAmount) => {
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

const setBuyDate = () => {
  let buyDate = new Date();
  console.log(buyDate.toLocaleDateString());
  let reBuyDate = new Date(buyDate.setMonth(buyDate.getMonth() + 1));
  reBuyDate = new Date(reBuyDate.setDate(1));
  console.log(reBuyDate.toLocaleDateString());
};

const checkAccountMoney = (amountReq) => {
  return amountReq <= $pesosAccount.value ? true : false;
};
