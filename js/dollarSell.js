/* ---------ACLARACIÓN!!--------- 
Al hacer la venta de dolares, estos se venden al precio oficial 
sin el 65% de impuestos que se perciben al momento de la compra */

const sellDollars = (amount, currencyType) => {
  calculateSellAmount(amount, currencyType);

  alertExchange("");

  if (accountSellValidations(pesosAmount, dollarAmount)) {
    showSellCharges(dollarAmount);
  } else return;
};

/*-------------------------------------------------------------------- */
/* Calculos según moneda elegida */

const calculateSellAmount = (amount, currencyType) => {
  currencyType == "dollar"
    ? calculateSellDollarAmount(amount)
    : calculateSellPesosAmount(amount);
  return pesosAmount;
};
const calculateSellDollarAmount = (amount) => {
  dollarAmount = amount;
  return (pesosAmount = officialDollarPrice.buy * dollarAmount);
};
const calculateSellPesosAmount = (amount) => {
  pesosAmount = amount;
  return (dollarAmount = pesosAmount / officialDollarPrice.buy);
};
/*-------------------------------------------------------------------- */
/* Muestra los cargos y llama a debitCreditCurrencys() si se aceptan */

const showSellCharges = (dollarAmount) => {
  const $charges = document.getElementById("charges");
  $charges.innerHTML = "";
  $newDiv = document.createElement("DIV");
  $newDiv.className = "generated_charges";

  $dollarH3 = document.createElement("H3");
  $pesosH3 = document.createElement("H3");

  $buttonAccept = document.createElement("BUTTON");
  $buttonDecline = document.createElement("BUTTON");

  $dollarH3.innerHTML = `Dolares vendidos: <span>$${dollarAmount}</span>`;
  $pesosH3.innerHTML = `Pesos recibidos: <span>$${
    officialDollarPrice.buy * dollarAmount
  }</span>`;

  $buttonAccept.innerHTML = `Confirmar`;

  $buttonDecline.innerHTML = `Cancelar`;

  $newDiv.appendChild($dollarH3);
  $newDiv.appendChild($pesosH3);
  $newDiv.appendChild($buttonAccept);
  $newDiv.appendChild($buttonDecline);
  $charges.appendChild($newDiv);
  $buttonAccept.addEventListener("click", () => {
    $charges.innerHTML = "";
    debitCreditCurrencys(pesosAmount, -dollarAmount);
    return true;
  });
  $buttonDecline.addEventListener("click", () => {
    $charges.innerHTML = "";
    return false;
  });
};
