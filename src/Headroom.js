import { isBrowser, isSupported } from "./features";
import trackScroll from "./trackScroll";

var removedCallbacks = {
  onPin: "pin", onUnpin: "unpin", onTop: "top", onNotTop: "not-top",
  onBottom: "bottom", onNotBottom: "not-bottom"
};

function assertEventOptions(options) {
  // Reject even undefined/inherited keys so an obsolete hook cannot disappear silently.
  Object.keys(removedCallbacks).forEach(function(name) {
    if (name in Object(options)) {
      throw new TypeError(
        "Headroom callback option " + name + " was removed; use headroom:" +
        removedCallbacks[name] + " with element.addEventListener()."
      );
    }
  });
}

function emit(instance, state) {
  // Use the element's realm, including when it belongs to an iframe.
  var view = instance.elem.ownerDocument.defaultView || window;
  instance.elem.dispatchEvent(new view.CustomEvent("headroom:" + state, {
    detail: { headroom: instance }, bubbles: true, cancelable: false, composed: false
  }));
}

function normalizeUpDown(t) {
  return t === Object(t) ? t : { down: t, up: t };
}

/**
 * UI enhancement for fixed headers.
 * Hides header when scrolling down
 * Shows header when scrolling up
 * @constructor
 * @param {HTMLElement} elem the header element
 * @param {Object} options options for the widget; subscribe to state events on elem
 * @throws {TypeError} when removed callback keys are supplied in options or defaults
 */
function Headroom(elem, options) {
  options = options || {};
  assertEventOptions(Headroom.options);
  assertEventOptions(options);
  Object.assign(this, Headroom.options, options);
  this.classes = Object.assign({}, Headroom.options.classes, options.classes);

  this.elem = elem;
  this.tolerance = normalizeUpDown(this.tolerance);
  this.offset = normalizeUpDown(this.offset);
  this.initialised = false;
  this.frozen = false;
  this.generation = 0;
}
Headroom.prototype = {
  constructor: Headroom,

  /**
   * Start listening to scrolling
   * @public
   */
  init: function() {
    if (Headroom.isSupported && !this.initialised) {
      this.generation++;
      this.addClass("initial");
      this.initialised = true;

      // defer event registration to handle browser
      // potentially restoring previous scroll position
      this.initTimeout = setTimeout(
        function(self) {
          self.initTimeout = null;
          self.scrollTracker = trackScroll(
            self.scroller,
            { offset: self.offset, tolerance: self.tolerance },
            self.update.bind(self)
          );
          // Store the tracker before listeners run: a listener may destroy us.
          self.scrollTracker.update();
        },
        100,
        this
      );
    }

    return this;
  },

  /**
   * Destroy the widget, clearing up after itself
   * @public
   */
  destroy: function() {
    this.generation++;
    clearTimeout(this.initTimeout);
    this.initTimeout = null;
    this.initialised = false;
    Object.keys(this.classes).forEach(this.removeClass, this);
    if (this.scrollTracker) {
      this.scrollTracker.destroy();
      this.scrollTracker = null;
    }
  },

  /**
   * Unpin the element
   * @public
   */
  unpin: function() {
    if (this.hasClass("pinned") || !this.hasClass("unpinned")) {
      this.addClass("unpinned");
      this.removeClass("pinned");

      emit(this, "unpin");
    }
  },

  /**
   * Pin the element
   * @public
   */
  pin: function() {
    if (this.hasClass("unpinned")) {
      this.addClass("pinned");
      this.removeClass("unpinned");

      emit(this, "pin");
    }
  },

  /**
   * Freezes the current state of the widget
   * @public
   */
  freeze: function() {
    this.frozen = true;
    this.addClass("frozen");
  },

  /**
   * Re-enables the default behaviour of the widget
   * @public
   */
  unfreeze: function() {
    this.frozen = false;
    this.removeClass("frozen");
  },

  top: function() {
    if (!this.hasClass("top")) {
      this.addClass("top");
      this.removeClass("notTop");

      emit(this, "top");
    }
  },

  notTop: function() {
    if (!this.hasClass("notTop")) {
      this.addClass("notTop");
      this.removeClass("top");

      emit(this, "not-top");
    }
  },

  bottom: function() {
    if (!this.hasClass("bottom")) {
      this.addClass("bottom");
      this.removeClass("notBottom");

      emit(this, "bottom");
    }
  },

  notBottom: function() {
    if (!this.hasClass("notBottom")) {
      this.addClass("notBottom");
      this.removeClass("bottom");

      emit(this, "not-bottom");
    }
  },

  shouldUnpin: function(details) {
    var scrollingDown = details.direction === "down";

    return scrollingDown && !details.top && details.toleranceExceeded;
  },

  shouldPin: function(details) {
    var scrollingUp = details.direction === "up";

    return (scrollingUp && details.toleranceExceeded) || details.top;
  },

  addClass: function(className) {
    this.elem.classList.add.apply(
      this.elem.classList,
      this.classes[className].split(" ")
    );
  },

  removeClass: function(className) {
    this.elem.classList.remove.apply(
      this.elem.classList,
      this.classes[className].split(" ")
    );
  },

  hasClass: function(className) {
    return this.classes[className].split(" ").every(function(cls) {
      return this.classList.contains(cls);
    }, this.elem);
  },

  update: function(details) {
    var generation = this.generation;
    if (!this.initialised || details.isOutOfBounds) {
      // Ignore bouncy scrolling in OSX
      return;
    }

    if (this.frozen === true) {
      return;
    }

    if (details.top) {
      this.top();
    } else {
      this.notTop();
    }

    // Event listeners may synchronously destroy, restart or freeze the widget.
    if (!this.initialised || this.generation !== generation || this.frozen === true) {
      return;
    }

    if (details.bottom) {
      this.bottom();
    } else {
      this.notBottom();
    }

    if (!this.initialised || this.generation !== generation || this.frozen === true) {
      return;
    }

    if (this.shouldUnpin(details)) {
      this.unpin();
    } else if (this.shouldPin(details)) {
      this.pin();
    }
  }
};

/**
 * Default options
 * @type {Object}
 */
Headroom.options = {
  tolerance: {
    up: 0,
    down: 0
  },
  offset: 0,
  scroller: isBrowser() ? window : null,
  classes: {
    frozen: "headroom--frozen",
    pinned: "headroom--pinned",
    unpinned: "headroom--unpinned",
    top: "headroom--top",
    notTop: "headroom--not-top",
    bottom: "headroom--bottom",
    notBottom: "headroom--not-bottom",
    initial: "headroom"
  }
};

Headroom.isSupported = isSupported();

// Keep existing support overrides working without two flags drifting apart.
Object.defineProperty(Headroom, "cutsTheMustard", {
  configurable: true,
  enumerable: true,
  get: function() {
    return Headroom.isSupported;
  },
  set: function(value) {
    Headroom.isSupported = value;
  }
});

export default Headroom;
