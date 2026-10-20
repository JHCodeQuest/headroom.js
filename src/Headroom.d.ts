declare namespace Headroom {
  interface UpDown {
    up: number;
    down: number;
  }

  interface Classes {
    initial: string;
    pinned: string;
    unpinned: string;
    top: string;
    notTop: string;
    bottom: string;
    notBottom: string;
    frozen: string;
  }

  interface Options {
    tolerance?: number | UpDown;
    offset?: number | UpDown;
    scroller?: Window | HTMLElement;
    classes?: Partial<Classes>;
  }

  /** State notification payload. Subscribe on the element before init(). */
  interface EventDetail {
    headroom: Headroom;
  }

  interface EventMap {
    "headroom:pin": CustomEvent<EventDetail>;
    "headroom:unpin": CustomEvent<EventDetail>;
    "headroom:top": CustomEvent<EventDetail>;
    "headroom:not-top": CustomEvent<EventDetail>;
    "headroom:bottom": CustomEvent<EventDetail>;
    "headroom:not-bottom": CustomEvent<EventDetail>;
  }

  interface Defaults {
    tolerance: number | UpDown;
    offset: number | UpDown;
    scroller: Window | HTMLElement | null;
    classes: Classes;
  }

  interface ScrollDetails {
    scrollY: number;
    lastScrollY: number;
    direction: "up" | "down";
    distance: number;
    isOutOfBounds: boolean;
    top: boolean;
    bottom: boolean;
    toleranceExceeded: boolean;
  }
}

/** Dependency-free fixed-header behaviour. Call destroy() when unmounting. */
declare class Headroom {
  constructor(element: HTMLElement, options?: Headroom.Options);
  static options: Headroom.Defaults;
  /** Feature-detection snapshot at module load; writable override used by init(). */
  static isSupported: boolean;
  /** @deprecated Use isSupported. Reads and writes share the same value. */
  static cutsTheMustard: boolean;
  elem: HTMLElement;
  initialised: boolean;
  frozen: boolean;
  tolerance: Headroom.UpDown;
  offset: Headroom.UpDown;
  scroller: Window | HTMLElement | null;
  classes: Headroom.Classes;
  /** Adds classes immediately; scroll tracking starts after a short delay. */
  init(): this;
  /** Cancels pending setup/scroll work and removes classes. Safe to repeat. */
  destroy(): void;
  pin(): void;
  unpin(): void;
  freeze(): void;
  unfreeze(): void;
  top(): void;
  notTop(): void;
  bottom(): void;
  notBottom(): void;
  addClass(className: keyof Headroom.Classes): void;
  removeClass(className: keyof Headroom.Classes): void;
  hasClass(className: keyof Headroom.Classes): boolean;
  shouldPin(details: Headroom.ScrollDetails): boolean;
  shouldUnpin(details: Headroom.ScrollDetails): boolean;
  update(details: Headroom.ScrollDetails): void;
}

declare global {
  interface HTMLElementEventMap extends Headroom.EventMap {}
  interface DocumentEventMap extends Headroom.EventMap {}
}

export default Headroom;
