describe("lifecycle cleanup", () => {
  beforeEach(() => {
    cy.visit("./cypress/fixtures/index.html");
    cy.clock();
  });

  it("can be destroyed before initialisation and more than once", () => {
    cy.window().then(win => {
      const hr = new win.Headroom(win.document.querySelector("header"));
      expect(() => hr.destroy()).not.to.throw();
      expect(() => hr.destroy()).not.to.throw();
    });
  });

  it("cancels deferred initialisation when destroyed immediately", () => {
    cy.window().then(win => {
      win.hr = new win.Headroom(win.document.querySelector("header")).init();
      expect(() => win.hr.destroy()).not.to.throw();
    });
    cy.tick(200);
    cy.get("header").should("have.attr", "class", "");
    cy.window().its("hr.initialised").should("equal", false);
  });

  it("registers one listener after an immediate destroy and re-init", () => {
    cy.window().then(win => {
      cy.spy(win, "addEventListener").as("addListener");
      win.hr = new win.Headroom(win.document.querySelector("header")).init();
      win.hr.destroy();
      win.hr.init();
      win.hr.init();
    });
    cy.tick(100);
    cy.get("@addListener").then(spy => {
      expect(spy.getCalls().filter(call => call.args[0] === "scroll")).to.have.length(1);
    });
    cy.window().then(win => {
      win.hr.destroy();
      expect(() => win.hr.destroy()).not.to.throw();
    });
    cy.get("header").should("have.attr", "class", "");
  });

  it("allows an event listener to destroy the instance during initialisation", () => {
    cy.window().then(win => {
      cy.spy(win, "removeEventListener").as("removeListener");
      const header = win.document.querySelector("header");
      header.addEventListener("headroom:top", event => event.detail.headroom.destroy());
      win.hr = new win.Headroom(header).init();
    });
    cy.tick(100);
    cy.window().its("hr.initialised").should("equal", false);
    cy.get("header").should("have.attr", "class", "");
    cy.get("@removeListener").then(spy => {
      expect(spy.getCalls().filter(call => call.args[0] === "scroll")).to.have.length(1);
    });
  });

  it("cancels a queued animation frame and stops later scroll updates", () => {
    cy.window().then(win => {
      win.hr = new win.Headroom(win.document.querySelector("header")).init();
    });
    cy.tick(100);
    cy.window().then(win => {
      cy.stub(win, "requestAnimationFrame").returns(42);
      cy.spy(win, "cancelAnimationFrame").as("cancelFrame");
      win.dispatchEvent(new win.Event("scroll"));
      win.hr.destroy();
      win.dispatchEvent(new win.Event("scroll"));
      expect(win.requestAnimationFrame.callCount).to.equal(1);
    });
    cy.get("@cancelFrame").should("have.been.calledWith", 42);
    cy.get("header").should("have.attr", "class", "");
  });

  it("stops an old update when a listener destroys and re-initialises", () => {
    cy.window().then(win => {
      let restarted = false;
      const header = win.document.querySelector("header");
      header.addEventListener("headroom:top", event => {
        if (!restarted) {
          restarted = true;
          event.detail.headroom.destroy();
          event.detail.headroom.init();
        }
      });
      header.addEventListener("headroom:not-bottom", cy.stub().as("notBottom"));
      win.hr = new win.Headroom(header).init();
    });
    cy.tick(100);
    cy.get("header").should("have.attr", "class", "headroom");
    cy.get("@notBottom").its("callCount").should("equal", 0);
    cy.tick(100);
    cy.get("@notBottom").its("callCount").should("equal", 1);
    cy.window().then(win => win.hr.destroy());
  });
});
