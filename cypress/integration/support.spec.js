describe("support flag migration", () => {
  beforeEach(() => {
    cy.visit("./cypress/fixtures/index.html");
    cy.clock();
  });

  it("exposes both boolean names in a supported browser", () => {
    cy.window().then(win => {
      expect(win.Headroom.isSupported).to.equal(true);
      expect(win.Headroom.cutsTheMustard).to.equal(true);
    });
  });

  for (const flag of ["isSupported", "cutsTheMustard"]) {
    it(`honours ${flag} overrides and resumes tracking when re-enabled`, () => {
      cy.window().then(win => {
        cy.spy(win, "addEventListener").as("addListener");
        win.Headroom[flag] = false;
        expect(win.Headroom.isSupported).to.equal(false);
        expect(win.Headroom.cutsTheMustard).to.equal(false);
        win.hr = new win.Headroom(win.document.querySelector("header"));
        expect(win.hr.init()).to.equal(win.hr);
        expect(win.hr.initialised).to.equal(false);
      });
      cy.tick(200);
      cy.get("header").should("not.have.class", "headroom");
      cy.get("@addListener").then(spy => {
        expect(spy.getCalls().filter(call => call.args[0] === "scroll")).to.have.length(0);
      });
      cy.window().then(win => {
        win.Headroom[flag] = true;
        expect(win.Headroom.isSupported).to.equal(true);
        expect(win.Headroom.cutsTheMustard).to.equal(true);
        win.hr.init();
      });
      cy.tick(100);
      cy.get("header").should("have.class", "headroom--top");
      cy.get("@addListener").then(spy => {
        expect(spy.getCalls().filter(call => call.args[0] === "scroll")).to.have.length(1);
      });
      cy.window().then(win => win.hr.destroy());
    });
  }
});
