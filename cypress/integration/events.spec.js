const transitions = [
  ["unpin", "unpinned", "pinned", "unpin"],
  ["pin", "pinned", "unpinned", "pin"],
  ["top", "top", "notTop", "top"],
  ["notTop", "notTop", "top", "not-top"],
  ["bottom", "bottom", "notBottom", "bottom"],
  ["notBottom", "notBottom", "bottom", "not-bottom"]
];

describe("element events", () => {
  beforeEach(() => {
    cy.visit("./cypress/fixtures/index.html");
    cy.clock();
  });

  it("emits all six transitions synchronously after classes, once per change", () => {
    cy.window().then(win => {
      const header = win.document.querySelector("header");
      const hr = new win.Headroom(header);
      const received = [];
      for (const [method, state, opposite, name] of transitions) {
        header.addEventListener(`headroom:${name}`, event => {
          expect(event).to.be.instanceOf(win.CustomEvent);
          expect(event.target).to.equal(header);
          expect(event.detail).to.have.all.keys("headroom");
          expect(event.detail.headroom).to.equal(hr);
          expect(event.bubbles).to.equal(true);
          expect(event.composed).to.equal(false);
          expect(event.cancelable).to.equal(false);
          event.preventDefault();
          expect(event.defaultPrevented).to.equal(false);
          expect(hr.hasClass(state)).to.equal(true);
          expect(hr.hasClass(opposite)).to.equal(false);
          received.push(name);
        });
        hr[method]();
        hr[method]();
        expect(received).to.have.length(transitions.findIndex(t => t[0] === method) + 1);
      }
      hr.destroy();
      expect(received).to.have.length(6);
    });
  });

  it("starts with top/bottom notifications and preserves scroll-state order", () => {
    cy.window().then(win => {
      const header = win.document.querySelector("header");
      win.events = [];
      for (const [, , , name] of transitions) {
        header.addEventListener(`headroom:${name}`, () => win.events.push(name));
      }
      win.hr = new win.Headroom(header).init();
    });
    cy.tick(100);
    cy.window().then(win => {
      expect(win.events).to.deep.equal(["top", "not-bottom"]);
      expect(win.hr.hasClass("pinned")).to.equal(false);
      expect(win.hr.hasClass("unpinned")).to.equal(false);
    });
    cy.clock().invoke("restore");
    cy.scrollTo("bottom");
    cy.window().should(win => {
      expect(win.events.slice(2)).to.deep.equal(["not-top", "bottom", "unpin"]);
    });
    cy.window().then(win => win.hr.destroy());
  });

  it("bubbles to document but stays inside a shadow root", () => {
    cy.window().then(win => {
      const delegated = cy.stub();
      win.document.addEventListener("headroom:unpin", delegated);
      const header = win.document.querySelector("header");
      const hr = new win.Headroom(header);
      hr.unpin();
      expect(delegated.callCount).to.equal(1);
      expect(delegated.firstCall.args[0].target).to.equal(header);
      const host = win.document.createElement("div");
      win.document.body.appendChild(host);
      const shadow = host.attachShadow({ mode: "open" });
      const child = win.document.createElement("header");
      shadow.appendChild(child);
      const inside = cy.stub();
      shadow.addEventListener("headroom:unpin", inside);
      new win.Headroom(child).unpin();
      expect(inside.callCount).to.equal(1);
      expect(delegated.callCount).to.equal(1);
      win.document.removeEventListener("headroom:unpin", delegated);
      hr.destroy();
      host.remove();
    });
  });

  for (const name of ["top", "not-bottom"]) {
    it(`stops obsolete state work after a ${name} listener destroys and re-initialises`, () => {
      cy.window().then(win => {
        const header = win.document.querySelector("header");
        win.later = cy.stub();
        header.addEventListener("headroom:pin", win.later);
        header.addEventListener(`headroom:${name}`, event => {
          event.detail.headroom.destroy();
          event.detail.headroom.init();
          event.detail.headroom.unpin();
        }, { once: true });
        win.hr = new win.Headroom(header).init();
      });
      cy.tick(100);
      cy.get("header").should("have.class", "headroom").and("have.class", "headroom--unpinned");
      cy.get("header").should("not.have.class", "headroom--pinned");
      cy.window().then(win => expect(win.later.callCount).to.equal(0));
      cy.tick(100);
      cy.get("header").should("have.class", "headroom--top");
      cy.window().then(win => expect(win.later.callCount).to.equal(1));
      cy.window().then(win => win.hr.destroy());
    });
  }

  for (const name of ["top", "not-bottom"]) {
    it(`freeze inside a ${name} listener stops later states, while manual methods still emit`, () => {
      cy.window().then(win => {
        const header = win.document.querySelector("header");
        header.addEventListener(`headroom:${name}`, event => event.detail.headroom.freeze(), { once: true });
        win.hr = new win.Headroom(header);
        win.hr.unpin();
        win.hr.init();
      });
      cy.tick(100);
      cy.get("header").should("have.class", "headroom--top").and("have.class", "headroom--frozen");
      cy.get("header").should("have.class", "headroom--unpinned").and("not.have.class", "headroom--pinned");
      if (name === "top") {
        cy.get("header").should("not.have.class", "headroom--not-bottom");
      }
      cy.window().then(win => {
        const pin = cy.stub();
        win.hr.elem.addEventListener("headroom:pin", pin);
        win.hr.pin();
        expect(pin.callCount).to.equal(1);
        win.hr.unfreeze();
        win.hr.destroy();
      });
    });
  }

  it("leaves active dispatch and application listeners intact across destruction", () => {
    cy.window().then(win => {
      const header = win.document.querySelector("header");
      const hr = new win.Headroom(header);
      const first = () => hr.destroy();
      const second = cy.stub();
      const delegated = cy.stub();
      header.addEventListener("headroom:unpin", first);
      header.addEventListener("headroom:unpin", second);
      win.document.addEventListener("headroom:unpin", delegated);
      hr.unpin();
      hr.unpin();
      expect(second.callCount).to.equal(2);
      expect(delegated.callCount).to.equal(2);
      header.removeEventListener("headroom:unpin", first);
      header.removeEventListener("headroom:unpin", second);
      win.document.removeEventListener("headroom:unpin", delegated);
      hr.unpin();
      expect(second.callCount).to.equal(2);
      hr.destroy();
    });
  });

  it("uses iframe-owned event constructors and supports detached documents", () => {
    cy.get("iframe").then(([iframe]) => {
      const frameWindow = iframe.contentWindow;
      const header = frameWindow.document.createElement("header");
      frameWindow.document.body.appendChild(header);
      const received = cy.stub();
      header.addEventListener("headroom:unpin", received);
      cy.window().then(win => {
        new win.Headroom(header).unpin();
        expect(received.callCount).to.equal(1);
        expect(received.firstCall.args[0]).to.be.instanceOf(frameWindow.CustomEvent);
        const detached = win.document.implementation.createHTMLDocument("Synthetic fixture");
        const element = detached.createElement("header");
        const listener = cy.stub();
        element.addEventListener("headroom:unpin", listener);
        new win.Headroom(element).unpin();
        expect(listener.callCount).to.equal(1);
      });
    });
  });

  it("reports listener errors without throwing through dispatch or skipping later listeners", () => {
    cy.on("uncaught:exception", error => {
      // Cypress adds an application-error prefix to the original message.
      if (error.message.includes("Synthetic listener failure")) {
        return false;
      }
    });
    cy.visit("./cypress/fixtures/listener-error.html");
    cy.window().then(win => {
      const header = win.document.querySelector("header");
      const error = win.listenerFailure;
      const reported = cy.stub();
      const handleError = event => {
        if (event.error === error) {
          event.preventDefault();
          reported();
        }
      };
      win.addEventListener("error", handleError);
      header.addEventListener("headroom:unpin", win.throwListener, { once: true });
      const later = cy.stub();
      header.addEventListener("headroom:unpin", later);
      const hr = new win.Headroom(header);
      expect(() => hr.unpin()).not.to.throw();
      expect(reported.callCount).to.equal(1);
      expect(later.callCount).to.equal(1);
      win.removeEventListener("error", handleError);
      hr.destroy();
    });
  });
});
