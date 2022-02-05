let $pesosAccount = document.getElementById("pesos-account");
let $generateBtn = document.getElementById("generate-btn");
let $localStorageBtn = document.getElementById("localStorage-btn");

$pesosAccount.value = localStorage.getItem("dinero en cuenta");
$generateBtn.style.display = localStorage.getItem("boton oculto");

let generateMoney = () => {
  return Math.round(Math.random() * (20000000 - 10000) + 10000) / 100;
};

$generateBtn.addEventListener("click", () => {
  localStorage.setItem(
    "dinero en cuenta",
    ($pesosAccount.value = generateMoney())
  );
  localStorage.setItem("boton oculto", ($generateBtn.style.display = "none"));
});
console.log(localStorage);

$localStorageBtn.addEventListener("click", () => {
  localStorage.clear();
  $pesosAccount.value = "";
  $generateBtn.style.display = "inline-block";
  console.log(localStorage);
});
