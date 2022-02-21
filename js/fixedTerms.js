/*Crear funcion que:
1. Dispare matchExpDate() al ingresar al simulador.
2. Retorne el resto entre las 00:00hs y la hora actual.
3. Haga un setTimeOut con el valor anterior y vuelva a llamar a matchExpDate().
*/

//Tasas de interés hardcodeadas, no encuentro API para tomar datos.

const rates = [
  { days: 30, onlineRate: 34 },
  { days: 60, onlineRate: 37 },
  { days: 90, onlineRate: 37 },
  { days: 180, onlineRate: 37 },
  { days: 365, onlineRate: 39 },
];

const daysYear = 365;
let DateTime = luxon.DateTime;
let fixedTerms = [];

class FixedTerm {
  constructor(pesos, days, interest, rate, constitutionDate, expirationDate) {
    this.pesos = pesos;
    this.days = days;
    this.interest = interest;
    this.rate = rate;
    this.constitutionDate = constitutionDate;
    this.expirationDate = expirationDate;
  }
}

const renderRates = () => {
  $ratesBox = document.getElementById("rates_box");

  for (const rate of rates) {
    $newDiv = document.createElement("DIV");
    $daysH3 = document.createElement("H3");
    $onlineRate = document.createElement("H3");

    $daysH3.innerHTML = `Días: ${rate.days}`;
    $onlineRate.innerHTML = `Tasa online: ${rate.onlineRate}%`;

    $ratesBox.appendChild($newDiv);
    $newDiv.appendChild($daysH3);
    $newDiv.appendChild($onlineRate);
  }
};
renderRates();
/*-------------------------------------------------------------------- */
const getFixedTerm = () => {
  alertExchange("");
  inputAmount = document.getElementById("fixed_term_amount").value;
  inputDays = document.getElementById("fixed_term_days").value;
  if (accountFixedTermsValidations(inputAmount)) {
    ({ days, onlineRate: rate } = matchDayRate(inputDays));
    percent = interestPercent(inputDays, rate);
    interest = interestAmount(inputAmount, percent);
    showFixTermCharges(inputAmount, inputDays, interest, rate);
  }
};

/*-------------------------------------------------------------------- */
const matchDayRate = (days) => {
  const lastRate = rates[rates.length - 1];
  let value;
  Object.keys(rates).reduce(
    (pv, cv) => {
      if (days >= pv.days && days < rates[cv].days) {
        value = pv;
      } else if (days >= lastRate.days) {
        value = lastRate;
      }
      pv = rates[cv];
      return pv;
    },
    { days: 0 }
  );
  return value;
};
/*-------------------------------------------------------------------- */
const interestPercent = (days, rate) => {
  return (rate / 100 / daysYear) * days;
};
const interestAmount = (amount, percent) => {
  return parseFloat(amount) * parseFloat(percent);
};

const finalAmount = (interest, amount) => {
  return parseFloat(interest) + parseFloat(amount);
};
/*-------------------------------------------------------------------- */
const accountFixedTermsValidations = (pesosAmount) => {
  if (checkPesosAccountMoney(pesosAmount)) {
  } else {
    alertExchange("*Excede la cantidad en su cuenta");
    return false;
  }
  if (minFixedTermAmount(pesosAmount)) {
  } else {
    alertExchange("*Ingrese monto mayor a $500");
    return false;
  }
  if (minDaysValidation(inputDays)) {
  } else {
    alertExchange("El plazo debe ser mayor o igual a 30");
    return false;
  }
  return pesosAmount;
};

const minFixedTermAmount = (pesosAmount) => {
  return parseFloat(pesosAmount) >= 500 ? true : false;
};
const minDaysValidation = (days) => {
  return days >= 30 ? true : false;
};
/*-------------------------------------------------------------------- */
const generateFixedTermMove = (pesos, days, interest, rate) => {
  pesos = parseFloat(pesos);
  days = parseFloat(days);
  interest = parseFloat(interest);
  rate = parseFloat(rate);
  let today = DateTime.local();
  let newday = today.plus({ days: days });

  fixedTerm = new FixedTerm(
    pesos,
    days,
    interest,
    rate,
    today.setLocale("arg").toLocaleString(),
    newday.setLocale("arg").toLocaleString()
  );

  fixedTerms.push(fixedTerm);
  localStorage.setItem("plazos fijos conformados", JSON.stringify(fixedTerms));
};

const saveStorageFixedTerms = () => {
  if (localStorage.getItem("plazos fijos conformados")) {
    let fixedTermsRefresh = JSON.parse(
      localStorage.getItem("plazos fijos conformados")
    );
    fixedTerms.push(...fixedTermsRefresh);
  }
};
saveStorageFixedTerms();
/*-------------------------------------------------------------------- */
const matchExpDate = () => {
  let movStorage = JSON.parse(localStorage.getItem("plazos fijos conformados"));
  let today = DateTime.local();
  today = today.setLocale("arg").toLocaleString();

  movStorage.map((mov, index) => {
    if (today === mov.expirationDate) return depositTerm(mov, index);
  });
};

const depositTerm = (mov, index) => {
  let totalAmount = (mov.pesos + mov.interest).toFixed(2);
  fixedTerms.splice(index, 1);
  localStorage.setItem("plazos fijos conformados", JSON.stringify(fixedTerms));
  debitCreditCurrencys(totalAmount, 0);
};
/*-------------------------------------------------------------------- */
const timer = () => {
  if (localStorage.getItem("plazos fijos conformados") != "") {
    matchExpDate();
    milliseconds = getMilliseconds();

    setInterval(() => {
      timer();
    }, milliseconds);
  }
};

const getMilliseconds = () => {
  let today = DateTime.local();
  let newday = today.plus({ days: 1 });
  newday = newday
    .set({ hour: 00, minutes: 00, seconds: 00, milliseconds: 00 })
    .setLocale("arg")
    .toISO();
  let result = DateTime.fromISO(newday).diffNow();
  return result.values.milliseconds;
};

timer();

/*-------------------------------------------------------------------- */
const showFixTermCharges = (pesosAmount, days, interest, rate) => {
  const $charges = document.getElementById("charges");

  let today = DateTime.local();
  let newday = today.plus({ days: days });

  $charges.innerHTML = "";
  $newDiv = document.createElement("DIV");
  $newDiv.className = "generated_charges";

  $pesosH3 = document.createElement("H3");
  $daysH3 = document.createElement("H3");
  $rateH3 = document.createElement("H3");
  $interestH3 = document.createElement("H3");
  $constitutionDate = document.createElement("H3");
  $expirationDatetH3 = document.createElement("H3");

  $buttonAccept = document.createElement("BUTTON");
  $buttonDecline = document.createElement("BUTTON");

  $pesosH3.innerHTML = `Capital: <span>$${pesosAmount}</span>`;
  $daysH3.innerHTML = `Plazo: <span>${days} días</span>`;
  $rateH3.innerHTML = `Tasa de interés (T.N.A): <span>${rate}%</span>`;
  $interestH3.innerHTML = `Intereses: <span>$${interest.toFixed(2)}</span>`;
  $constitutionDate.innerHTML = `Fecha de constitución: <span>${today
    .setLocale("arg")
    .toLocaleString()}</span>`;
  $expirationDatetH3.innerHTML = `Fecha de vencimiento: <span>${newday
    .setLocale("arg")
    .toLocaleString()}</span>`;

  $buttonAccept.innerHTML = `Constituir`;

  $buttonDecline.innerHTML = `Cancelar`;

  $newDiv.appendChild($pesosH3);
  $newDiv.appendChild($daysH3);
  $newDiv.appendChild($rateH3);
  $newDiv.appendChild($interestH3);
  $newDiv.appendChild($constitutionDate);
  $newDiv.appendChild($expirationDatetH3);

  $newDiv.appendChild($buttonAccept);
  $newDiv.appendChild($buttonDecline);
  $charges.appendChild($newDiv);
  $buttonAccept.addEventListener("click", () => {
    $charges.innerHTML = "";
    debitCreditCurrencys(-pesosAmount, 0);
    generateFixedTermMove(pesosAmount, days, interest, rate);
    return true;
  });
  $buttonDecline.addEventListener("click", () => {
    $charges.innerHTML = "";
    return false;
  });
};
