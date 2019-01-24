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
  interface Window { adaEmbed: any; }
}

function dispatchAdaEvent(type: string, data?: object) {
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
  document.getElementById("ada-embed").dispatchEvent(event);
}

/**
 * Render the Ada iFrame into the client's specified parentElement
 */
function setUpFrameParent(elementOrElementReference) {
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
}

function adaEmbed(method: string, options?: any) {
  switch (method) {
    case ADA_EVENT_START:
      const { parentElement } = options;
      let renderElement = document.body;

      if (parentElement) {
        renderElement = setUpFrameParent(parentElement);
      }

      render(h(App, options), renderElement);
      break;
    case ADA_EVENT_STOP:
      const adaNode = document.getElementById("ada-embed");
      adaNode.parentNode.removeChild(adaNode);
      break;
    case ADA_EVENT_TOGGLE:
      dispatchAdaEvent(ADA_EVENT_TOGGLE);
      break;
    case ADA_EVENT_SET_META_FIELDS:
      dispatchAdaEvent(ADA_EVENT_SET_META_FIELDS, options);
      break;
    case ADA_EVENT_RESET:
      dispatchAdaEvent(ADA_EVENT_RESET);
      break;
    case ADA_EVENT_DELETE_HISTORY:
      dispatchAdaEvent(ADA_EVENT_DELETE_HISTORY);
      break;
    default:
      break;
  }
}

window.adaEmbed = adaEmbed;
