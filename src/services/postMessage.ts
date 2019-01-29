export default function postMessage(iFrameRef: HTMLIFrameElement, toSend: any, chatURL: string) {
  const adaNameSpacedObject = {
    ada: toSend
  };
  iFrameRef.contentWindow.postMessage(adaNameSpacedObject, chatURL);
}
