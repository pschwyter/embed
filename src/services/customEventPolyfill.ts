interface InterfaceEventParams {
  detail: object,
  bubbles: boolean,
  cancelable: boolean
}

export default (() => {
  if (typeof window.CustomEvent === "function") return false; // If not IE

  // tslint:disable-next-line:function-name
  function CustomEvent(event: string, params: InterfaceEventParams) {
    const newParams = params || { bubbles: false, cancelable: false, detail: undefined };
    const evt = document.createEvent("CustomEvent");
    evt.initCustomEvent(event, newParams.bubbles, newParams.cancelable, newParams.detail);
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();
