import "cypress-localstorage-commands";

const URL = "http://127.0.0.1:8080";

const DOLAR_BOXES = 4;

const MONTH_LIMIT = 200;

const BANKS_NUMBER = 14;

const MIN_DEPOSIT = 500;

const MIN_DEPOSIT_DAYS = 30;

context("Home simulador Banco", () => {
  before(() => {
    cy.visit(URL);
  });
  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it("se asegura que no haya dinero en la cuenta", () => {
    cy.get("#pesos-account").should("have.value", "");
  });

  it("se asegura que genere monto aleatorio de dinero", () => {
    cy.get("#generate-btn").then(($btn) => {
      cy.get($btn).click();
      cy.get("#pesos-account")
        .invoke("val")
        .then(($pesosValue) => {
          cy.get("#localStorage-btn").click();
          cy.get($btn).click();
          cy.get("#pesos-account").should("not.have.value", $pesosValue);
        });
    });
    cy.get("#generate-btn").should("have.css", "display", "none");
  });

  it("refresca la pagina y se asegura que el dinero sea el mismo", () => {
    cy.get("#pesos-account")
      .invoke("val")
      .then(($pesosValue) => {
        cy.visit(URL);
        cy.get("#pesos-account").should("have.value", $pesosValue);
      });
  });
});

context("Compra U$S simulador banco", () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it("renderiza los 4 valores del dolar", () => {
    cy.get(".bank-card").should("have.length", DOLAR_BOXES);
  });

  it("clickea en compra U$S", () => {
    cy.get(".nav-item").contains("Compra U$S").click();
  });

  it("vende 1000 pesos y verifica que se descuente el monto", () => {
    cy.get("#pesos-amount").click();

    cy.get("#pesos-account")
      .invoke("val")
      .then(($pesosValue) => {
        cy.get("#exchange").type("1000");
        cy.get("button").contains("Comprar").click();
        cy.get("button").contains("Confirmar").click();

        cy.get("#pesos-account").should("have.value", $pesosValue - 1000);
      });
  });

  it("intenta comprar mas que el monto disponible", () => {
    cy.get("#pesos-amount").click();

    cy.get("#pesos-account")
      .invoke("val")
      .then(($pesosValue) => {
        cy.get("#exchange")
          .clear()
          .type(parseFloat($pesosValue) + 1);
        cy.get("button").contains("Comprar").click();

        cy.get("#alert_exchange").should(
          "contain",
          "*Excede la cantidad en su cuenta"
        );
      });
  });

  it("compra 10 dolares y verifica que se acredite el monto", () => {
    cy.get("#dollar-amount").click();

    cy.get("#dollar-account")
      .invoke("val")
      .then(($dollarValue) => {
        cy.get("#exchange").clear().type("10");
        cy.get("button").contains("Comprar").click();
        cy.get("button").contains("Confirmar").click();
        cy.get("#dollar-account").should(
          "have.value",
          parseFloat($dollarValue) + 10
        );
      });
  });

  it("intenta comprar mas del cupo mensual permitido", () => {
    cy.get("#dollar-amount").click();

    cy.get("#exchange").clear().type(MONTH_LIMIT);
    cy.get("button").contains("Comprar").click();

    cy.get("#alert_exchange").should(
      "contain",
      "*Excede el límite mensual permitido"
    );
  });
});

context("Venta U$S simulador banco", () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });
  it("clickea en vender U$S", () => {
    cy.get(".nav-item").contains("Vender U$S").click();
  });

  it("vende 100 pesos y verifica que se acredite el monto", () => {
    cy.get("#pesos-amount").click();

    cy.get("#pesos-account")
      .invoke("val")
      .then(($pesosValue) => {
        cy.get("#exchange").type("100");
        cy.get("button").contains("Vender").click();
        cy.get("button").contains("Confirmar").click();

        cy.get("#pesos-account").should(
          "have.value",
          parseFloat($pesosValue) + 100
        );
      });
  });

  it("intenta vender mas que el monto disponible", () => {
    cy.get("#dollar-amount").click();

    cy.get("#dollar-account")
      .invoke("val")
      .then(($dollarValue) => {
        cy.get("#exchange")
          .clear()
          .type(parseFloat($dollarValue) + 1);
        cy.get("button").contains("Vender").click();

        cy.get("#alert_exchange").should(
          "contain",
          "*Excede la cantidad en su cuenta"
        );
      });
  });

  it("vende 10 dolares y verifica que se acredite el monto", () => {
    cy.get("#dollar-amount").click();

    cy.get("#dollar-account")
      .invoke("val")
      .then(($dollarValue) => {
        cy.get("#exchange").clear().type("10");
        cy.get("button").contains("Vender").click();
        cy.get("button").contains("Confirmar").click();
        cy.get("#dollar-account").should(
          "have.value",
          parseFloat($dollarValue) - 10
        );
      });
  });
});

context("Cotizaciones simulador banco", () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it("clickea en vender U$S", () => {
    cy.get(".nav-item").contains("Cotizaciones").click();
  });

  it("clickea en seleccionar bancos", () => {
    cy.get("#select_banks").click();
  });

  it(`se asegura que haya ${BANKS_NUMBER} bancos`, () => {
    cy.get(".bank").should("have.length", BANKS_NUMBER);
  });

  it("se asegura que se rendericen las cotizaciones", () => {
    cy.get(".bank").check();
    cy.get("#search-btn").click();
    cy.wait(5000);
    cy.get(".exchange_container__banklist_searches")
      .find("li")
      .should("have.length", BANKS_NUMBER);
  });
});

context("Plazo fijo simulador banco", () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it("clickea en plazo fijo", () => {
    cy.get(".nav-item").contains("Plazo fijo").click();
  });

  it("se asegura que las tasas sean renderizadas", () => {
    cy.get("#rates_box").find("div").should("have.length", 5);
  });

  it(`se asegura el importe mínimo de $${MIN_DEPOSIT}`, () => {
    cy.get("#fixed_term_amount").clear().type("499");

    cy.get("button").contains("Constituir Plazo Fijo").click();

    cy.get("#alert_exchange").should(
      "contain",
      `*Ingrese monto mayor a $${MIN_DEPOSIT}`
    );
  });

  it(`se asegura el plazo mínimo de ${MIN_DEPOSIT_DAYS}`, () => {
    cy.get("#fixed_term_amount").clear().type("500");
    cy.get("#fixed_term_days").clear().type("29");

    cy.get("button").contains("Constituir Plazo Fijo").click();

    cy.get("#alert_exchange").should(
      "contain",
      `El plazo debe ser mayor o igual a ${MIN_DEPOSIT_DAYS}`
    );
  });

  it("constituye un plazo fijo", () => {
    cy.clock(Date.UTC(2022, 4, 1), ["Date"]);
    cy.get("#fixed_term_amount").clear().type(MIN_DEPOSIT);
    cy.get("#fixed_term_days").clear().type(MIN_DEPOSIT_DAYS);

    cy.get("button").contains("Constituir Plazo Fijo").click();
    cy.get(".generated_charges").find("button").first().click();
  });

  it("se asegura que exista el movimiento", () => {
    cy.get("#see_fixedTerms__btn").click();
    cy.get(".see_fixedTerms__box__info").should("exist");
  });

  it("se asegura que se deposite el monto una vez finalizado el plazo", () => {
    cy.get("#pesos-account")
      .invoke("val")
      .then(($pesosValue) => {
        cy.clock(Date.UTC(2022, 5, 5), ["Date"]);
        cy.visit(`${URL}/pages/fixedTerms.html`);
        cy.get("#pesos-account").should(
          "have.value",
          parseFloat($pesosValue) + 514.79
        );
      });
  });
});

context("Verifica que haya 6 movimientos", () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });
  it("se asegura que esten los movimientos", () => {
    cy.visit(URL);

    cy.get("#see_movement__btn").click();
    cy.get(".see_movements__box__info").should("have.length", 6);
  });
});

context("Compra dolares mes siguiente", () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it("clickea en compra U$S", () => {
    cy.get(".nav-item").contains("Compra U$S").click();
  });

  it(`compra ${MONTH_LIMIT} en el nuevo mes`, () => {
    cy.clock(Date.UTC(2022, 5, 5), ["Date"]);
    cy.get("#dollar-amount").click();

    cy.get("#exchange").clear().type(MONTH_LIMIT);
    cy.get("button").contains("Comprar").click();
    cy.get("button").contains("Confirmar").click();
  });

  it("verifica que se haya acreditado el monto", () => {
    cy.get("#dollar-account")
      .invoke("val")
      .then(parseFloat)
      .should("be.gte", MONTH_LIMIT);
  });
});
