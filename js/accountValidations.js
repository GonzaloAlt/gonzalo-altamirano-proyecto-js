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
/* Validaciones de montos en cuenta */

const accountSellValidations = (pesosAmount, dollarAmount) => {
  if (!checkDollarAccountMoney(dollarAmount)) {
    alertExchange("*Excede la cantidad en su cuenta");
    return false;
  }
  if (!minAmount(dollarAmount)) {
    alertExchange("*Ingrese monto mayor a 0");
    return false;
  }
  return pesosAmount, dollarAmount;
};
const checkDollarAccountMoney = (amountReq) => {
  return parseFloat(amountReq) <=
    parseFloat(localStorage.getItem("dinero en cuenta dolares"))
    ? true
    : false;
};
