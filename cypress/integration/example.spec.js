describe("native ESM TypeScript example", () => {
  it("hides, reveals and can be disabled and re-enabled", () => {
    cy.visit("./examples/typescript/index.html");
    cy.get("header").should("have.class", "headroom--top");
    cy.scrollTo(0, 300);
    cy.get("header").should("have.class", "headroom--unpinned");
    cy.scrollTo(0, 150);
    cy.get("header").should("have.class", "headroom--pinned");
    cy.get("#toggle").click();
    cy.get("header").should("not.have.class", "headroom");
    cy.get("#toggle").click();
    cy.get("header").should("have.class", "headroom");
  });
});
