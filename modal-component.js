class ModalElement extends HTMLElement {
  static get observedAttributes() {
    return [
      "position",
      "open",
      "overlay",
      "opacity-overlay",
      "z-index",
      "z-index-overlay",
      "offset",
    ];
  }
  constructor() {
    super().attachShadow({ mode: "open" }).innerHTML = `
    <style>
      .wrapper {
        --offset: 0px;
        --z-index: 1;
        z-index: 1 /* The orders of modals*/;
      }
      .wrapper:not(.open) {
        visibility: hidden;
      }
    
      .wrapper .overlay {
        display: none;
        position: fixed;
	z-index: var(--z-index-overlay);
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, var(--opacity-overlay));
      }
      .wrapper[data-overlay] .overlay {
        display: block;
      }
      .modal {
        position: fixed;
        top: 50%;
        left: 50%;
	z-index: var(--z-index);
        background: white;
        opacity: 0;
        left: 0;
        top: 0;
      }
      .wrapper.open .modal {
        opacity: 1;
      }
      .wrapper[data-position="right"] .modal {
        right: var(--offset);
        top: 0;
        left: unset;
        transform: translateX(100%);
      }
      .wrapper.open[data-position="right"] .modal {
        transform: translateX(0%);
      }
      .wrapper[data-position="left"] .modal {
        left: var(--offset);
        top: 0;
        transform: translateX(-100%);
      }
      .wrapper[data-position="left"].open .modal {
        transform: translateX(0%);
      }
      .wrapper[data-position]:not([data-position="center"]) .modal {
        transition: all 250ms ease-out;
      }
      .wrapper[data-position="center"] .modal {
        transition: opacity 150ms ease-out;
      }
      .wrapper.open[data-position="center"] .modal {
        transform: translate(-50%, -50%);
        left: 50%;
        top: 50%;
      }
    </style>
    <div class="wrapper">
      <div class="overlay"></div>
      <div class="modal">
	<slot/>
      </div>
    </div>

    `;
    this.close = this.close.bind(this);
    this.toggle = this.toggle.bind(this);
    this.open = this.open.bind(this);
    this.setOffset = this.setOffset.bind(this);
    this.setPosition = this.setPosition.bind(this);
    this.setZIndexOverlay = this.setZIndexOverlay.bind(this);
    this.setOpacityOverlay = this.setOpacityOverlay.bind(this);
    this.setOverLay = this.setOverLay.bind(this);
    this.setOffset = this.setOffset.bind(this);
  }
  connectedCallback() {
    const { shadowRoot } = this;
    shadowRoot.querySelector(".overlay").addEventListener("click", this.close);
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue != oldValue) {
      switch (name) {
        case "open":
          this.toggle(newValue !== null);
          break;
        case "position":
          this.setPosition(newValue);
          break;
        case "overlay":
          this.setOverLay(newValue !== null);
          break;
        case "opacity-overlay":
          this.setOpacityOverlay(newValue);
          break;
        case "z-index":
          this.setZIndex(newValue);
          break;
        case "z-index-overlay":
          this.setZIndexOverlay(newValue);
          break;
        case "offset":
          this.setOffset(newValue);
          break;
      }
    }
  }
  toggle(value) {
    if (value) {
      this.open();
    } else {
      this.close();
    }
  }
  open() {
    const { shadowRoot } = this;
    const wrapper = shadowRoot.querySelector(".wrapper");
    this.setAttribute("open", "");
    wrapper.classList.add("open");
  }
  close() {
    const { shadowRoot } = this;
    const wrapper = shadowRoot.querySelector(".wrapper");
    this.setAttribute("open", "");
    wrapper.classList.remove("open");
    const closeEvent = new Event("close");
    this.dispatchEvent(closeEvent);
  }
  setPosition(newPosition) {
    const { shadowRoot } = this;
    const wrapper = shadowRoot.querySelector(".wrapper");
    wrapper.setAttribute("data-position", newPosition);
  }
  setOverLay(newOverlay) {
    const { shadowRoot } = this;
    const wrapper = shadowRoot.querySelector(".wrapper");
    wrapper.setAttribute("data-overlay", newOverlay);
  }
  setOpacityOverlay(newOpacityOverlay) {
    const { shadowRoot } = this;
    const wrapper = shadowRoot.querySelector(".wrapper");
    wrapper.style.setProperty("--opacity-overlay", newOpacityOverlay);
  }
  setZIndex(newZIndex) {
    const { shadowRoot } = this;
    const wrapper = shadowRoot.querySelector(".wrapper");
    wrapper.style.setProperty("--z-index", newZIndex);
  }
  setZIndexOverlay(newZIndexOverlay) {
    const { shadowRoot } = this;
    const wrapper = shadowRoot.querySelector(".wrapper");
    wrapper.style.setProperty("--z-index-overlay", newZIndexOverlay);
  }
  setOffset(offset) {
    const { shadowRoot } = this;
    const wrapper = shadowRoot.querySelector(".wrapper");
    wrapper.style.setProperty("--offset", offset);
  }
  disconnectedCallback() {}
}
customElements.define("modal-element", ModalElement);
