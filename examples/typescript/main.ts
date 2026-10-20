import Headroom from "headroom.js";

const header = document.querySelector<HTMLElement>("header");
if (!header) {
  throw new Error("The demo requires a header element.");
}

const headroom = new Headroom(header, { tolerance: 5, offset: 60 }).init();
const toggle = document.querySelector<HTMLButtonElement>("#toggle");
if (toggle) {
  toggle.addEventListener("click", () => {
    if (headroom.initialised) {
      headroom.destroy();
      toggle.textContent = "Enable header behaviour";
    } else {
      headroom.init();
      toggle.textContent = "Disable header behaviour";
    }
  });
}
window.addEventListener("pagehide", () => headroom.destroy(), { once: true });
