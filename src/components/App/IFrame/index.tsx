import Client from "models/Client";
import { Component, h } from "preact";
import { capitalize } from "services/strings";
import "./style.scss";

interface InterfaceIFrame {
  client: Client,
  greetingHandle?: string,
  handle: string,
  iframeRef?: HTMLIFrameElement,
  chatURL: string,
  parentElement?: string | HTMLElement,
  styles?: string,
  metaFields?: object,
  setIFrameRef(ref: HTMLIFrameElement): void,
  setIFrameLoaded(): void
}

export default class IFrame extends Component<InterfaceIFrame> {
  constructor(props: InterfaceIFrame) {
    super(props);

    this.onLoad = this.onLoad.bind(this);
    this.handleSetRef = this.handleSetRef.bind(this);
  }

  onLoad() {
    const {
      chatURL,
      parentElement,
      styles,
      greetingHandle,
      client,
      iframeRef,
      metaFields,
      setIFrameLoaded
    } = this.props;

    setIFrameLoaded();

    const followUpResponseId = client.intro && client.intro.response_id;

    const toSend = {
      ...(styles ? { styles } : {}),
      ...(metaFields ? { metaFields } : {}),
      ...(greetingHandle ? { greetingHandle } : {}),
      ...(!parentElement ? { showCloseButton: true  } : {}),
      ...(followUpResponseId ? { followUpResponseId } : {})
    };

    iframeRef.contentWindow.postMessage(toSend, chatURL);
  }

  handleSetRef(ref: HTMLIFrameElement) {
    const { setIFrameRef } = this.props;

    setIFrameRef(ref);
  }

  render() {
    const {
      chatURL,
      handle
    } = this.props;

    return (
      <iframe
        name="ada-chaperone-iframe"
        className="ada-chaperone-iframe"
        src={chatURL}
        title={`${capitalize(handle)} Support Chat`}
        onLoad={this.onLoad}
        ref={this.handleSetRef}
      />
    );
  }
}
