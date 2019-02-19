import { Component, h } from "preact";
import { capitalize } from "services/strings";
import postMessage from "services/postMessage";
import "./style.scss";

interface InterfaceIFrame {
  handle: string,
  iframeRef?: HTMLIFrameElement,
  chatURL: string,
  parentElement?: string | HTMLElement,
  styles?: string,
  metaFields?: object,
  isDrawerOpen: boolean,
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
      iframeRef,
      setIFrameLoaded
    } = this.props;

    setIFrameLoaded();

    const toSend = {
      ...(styles ? { styles } : {}),
      ...(!parentElement ? { showCloseButton: true  } : {})
    };

    postMessage(iframeRef, toSend, chatURL);
  }

  handleSetRef(ref: HTMLIFrameElement) {
    const { setIFrameRef } = this.props;

    setIFrameRef(ref);
  }

  render() {
    const {
      chatURL,
      handle,
      isDrawerOpen
    } = this.props;

    return (
      <iframe
        name="ada-embed-iframe"
        className="ada-embed-iframe"
        src={chatURL}
        title={`${capitalize(handle)} Support Chat`}
        onLoad={this.onLoad}
        ref={this.handleSetRef}
        tabIndex={isDrawerOpen ? 0 : -1}
      />
    );
  }
}
