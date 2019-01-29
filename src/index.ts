import {
  ADA_EVENT_STOP,
  ADA_EVENT_RESET,
  ADA_EVENT_START,
  ADA_EVENT_TOGGLE,
  ADA_EVENT_DELETE_HISTORY,
  ADA_EVENT_SET_META_FIELDS
} from "constants/events";
import { h, render } from "preact";
import App from "./components/App";

// Import global styles
import "./style/application.scss";

declare global {
  interface Window {
    adaEmbed: any;
    adaSettings: object;
  }
}

/**
 * Dispatch a custom Ada Event to be used inside the Embed Preact app
 */
const dispatchAdaEvent = (type: string, data?: object) => {
  const embedElement = document.getElementById("ada-embed");
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
  [ADA_EVENT_START]: (options: any) => {
    const { parentElement } = options;
    let renderElement = document.body;

    if (parentElement) {
      renderElement = setUpFrameParent(parentElement);
    }

    render(h(App, options), renderElement);
  },

  /**
   * Destroy Ada Embed
   */
  [ADA_EVENT_STOP]: () => {
    const adaNode = document.getElementById("ada-embed");
    adaNode.parentNode.removeChild(adaNode);
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
  [ADA_EVENT_SET_META_FIELDS]: (options: any) => {
    dispatchAdaEvent(ADA_EVENT_SET_META_FIELDS, options);
  },

  /**
   * Reset Chat (delete history and refresh)
   */
  [ADA_EVENT_RESET]: () => {
    dispatchAdaEvent(ADA_EVENT_RESET);
  },

  /**
   * Delete Chat history
   */
  [ADA_EVENT_DELETE_HISTORY]: () => {
    dispatchAdaEvent(ADA_EVENT_DELETE_HISTORY);
  }
});

window.adaEmbed = adaEmbed;

// Needs to self execute when page loads
const embedScriptRef = document.getElementById("__ada");
const adaSettings = Object.assign({ handle: embedScriptRef.dataset.handle }, window.adaSettings);

if (embedScriptRef.dataset.lazy === undefined) {
  adaEmbed.start(adaSettings);
}
