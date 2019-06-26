/**
 * Polyfills
 */

// Polyfill Object.assign IE 9
import "core-js/modules/es6.object.assign";

// Custom Events Polyfill
import "services/customEventPolyfill";

import {
  ADA_EVENT_STOP,
  ADA_EVENT_RESET,
  ADA_EVENT_START,
  ADA_EVENT_TOGGLE,
  ADA_EVENT_GET_INFO,
  ADA_EVENT_GIVE_INFO,
  ADA_EVENT_DELETE_HISTORY,
  ADA_EVENT_SET_META_FIELDS
} from "constants/events";
import { h, render } from "preact";
import AppWrapper from "./components/AppWrapper";

// Import global styles
import "./style/application.scss";

interface InterfacePrototype { prototype: any; }

declare global {
  interface Window {
    adaEmbed: any;
    adaSettings: object;
    $zopim: any;
    Event: Event & InterfacePrototype;
    CustomEvent: any;
  }
}

/**
 * Intial inputs passed in by client during instantiation
 */
export interface InterfaceStartOptions {
  // The bot handle
  handle: string,

  // Custom styles to be passed to Chat
  styles?: string,

  // Used to specify a custom domain (eg. ada-dev)
  domain?: string,

  // Production cluster (Eg. att, ca)
  cluster?: string,

  // Language to be passed to Chat
  language?: string,

  // Programtically puts Chat into private mode
  private?: boolean,

  // A custom greeting id to be passed to Chat
  greeting?: string,

  // Toggles the Drawer mask on and off
  hideMask?: boolean,

  // Chatter meta data
  metaFields?: object,

  // If true Chat button can be drag and dropped
  dragAndDrop?: boolean,

  // If true will overlay Chat on top of site content on mobile
  mobileOverlay?: boolean,

  // A parentElement for Chat to be rendered into instead of the default Drawer
  parentElement?: string | HTMLElement,

  // Callback triggered when embed loaded (specifically, when #ada-embed element is rendered)
  adaReadyCallback?(): any,

  // Triggered when "analytics" postMessage event received
  analyticsCallback?(analytics: any): any,

  // Triggered when "liveHandoff" postMessage event received
  liveHandoffCallback?(liveHandoff: any): any,

  // Triggered when "chatter" postMessage event received
  chatterTokenCallback?(chatter: string): any
}

interface InterfaceResetOptions {
  language?: string,
  greeting?: string,
  metaFields?: object,
  resetChatHistory?: boolean
}

/**
 * Represents the status of the Embed app, as returned by ADA_EVENT_GIVE_INFO event
 */
let statusObject = {};

/**
 * Returns the ada-embed element if Embed has started
 */
const getEmbedElement = () => document.getElementById("ada-embed");

/**
 * Dispatch a custom Ada Event to be used inside the Embed Preact app
 */
const dispatchAdaEvent = (type: string, data?: object) => {
  const embedElement = getEmbedElement();
  if (!adaEmbed) { return; }

  const event = new CustomEvent(
    "ada-event",
    {
      detail: {
        type,
        data
      },
      bubbles: true,
      cancelable: true
    }
  );

  if (!embedElement) {
    throw Error(
      "Actions cannot be called until Embed has been instantiated. " +
      "Try running `adaEmbed.start({...})`."
    );
  }

  embedElement.dispatchEvent(event);
};

/**
 * Render the Ada iFrame into the client's specified parentElement
 */
const setUpFrameParent = (elementOrElementReference?: HTMLElement|string) => {
  let targetElement: HTMLElement;

  if (typeof elementOrElementReference === "string") {
    targetElement = document.getElementById(elementOrElementReference);
  } else if (elementOrElementReference instanceof HTMLElement) {
    targetElement = elementOrElementReference;
  }

  if (!targetElement) {
    throw Error("parentElement requires a string or HTMLElement");
  }

  return targetElement;
};

/**
 * Ada Embed methods
 */
const adaEmbed = Object.freeze({
  /**
   * Setup Ada Embed
   */
  [ADA_EVENT_START]: (options: InterfaceStartOptions) => {
    const { parentElement } = options;
    const adaNode = getEmbedElement();

    let renderElement = document.body;

    if (parentElement) {
      renderElement = setUpFrameParent(parentElement);
    }

    if (adaNode) {
      throw Error("Ada Embed has already been rendered.");
    } else {
      // Add event listener
      document.addEventListener("ada-event-outward", handleEventFromPreactApp, false);

      render(h(AppWrapper, options), renderElement);
    }
  },

  /**
   * Destroy Ada Embed
   */
  [ADA_EVENT_STOP]: () => {
    const adaNode = getEmbedElement();

    if (adaNode) {
      // Remove event listener
      document.removeEventListener("ada-event-outward", handleEventFromPreactApp, false);

      adaNode.parentNode.removeChild(adaNode);
    } else {
      throw Error("An instance Ada Embed was not found.");
    }
  },

  /**
   * Toggle the Chat Drawer open / closed
   */
  [ADA_EVENT_TOGGLE]: () => {
    dispatchAdaEvent(ADA_EVENT_TOGGLE);
  },

  /**
   * Update the meta fields (useful for settings meta data after setup)
   */
  [ADA_EVENT_SET_META_FIELDS]: (options: object) => {
    dispatchAdaEvent(ADA_EVENT_SET_META_FIELDS, { metaFields: options });
  },

  /**
   * Reset Chat (delete history and refresh)
   */
  [ADA_EVENT_RESET]: (options: InterfaceResetOptions) => {
    dispatchAdaEvent(ADA_EVENT_RESET, options);
  },

  /**
   * Delete Chat history
   */
  [ADA_EVENT_DELETE_HISTORY]: () => {
    dispatchAdaEvent(ADA_EVENT_DELETE_HISTORY);
  },

  /**
   * Get Embed status
   */
  [ADA_EVENT_GET_INFO]: () => {
    dispatchAdaEvent(ADA_EVENT_GET_INFO);
    return statusObject;
  }
});

/**
 * Handle Custom Events coming from the Preact application
 */
function handleEventFromPreactApp(event: CustomEvent) {
  const { detail } = event;
  const { type, data } = detail;

  if (type === ADA_EVENT_GIVE_INFO) {
    statusObject = data;
  }
}

window.adaEmbed = adaEmbed;

// Needs to self execute when page loads
const embedScriptRef = document.getElementById("__ada");
const dataHandle  = embedScriptRef.getAttribute("data-handle");
const dataLazy = embedScriptRef.getAttribute("data-lazy");
const dataDomain = embedScriptRef.getAttribute("data-domain");
const adaSettings = Object.assign({ handle: dataHandle, domain: dataDomain }, window.adaSettings);

if (dataLazy === undefined || dataLazy === null) {
  if (/comp|inter|loaded/.test(document.readyState)) {
    // Start embed if the DOM has loaded
    adaEmbed.start(adaSettings);
  } else {
    // If DOM has not loaded, create an event listener to start embed when it has loaded
    document.addEventListener("DOMContentLoaded", () => {
      adaEmbed.start(adaSettings);
    });
  }
}
