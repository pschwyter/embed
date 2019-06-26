import classnames from "classnames";
import { Component, h } from "preact";
import { isIE9OrBelow } from "services/browsers";
import IFrame from "../IFrame";
import "./style.scss";

interface InterfaceDrawer {
  handle: string,
  isDrawerOpen: boolean,
  iframeRef?: HTMLIFrameElement,
  chatURL: string,
  useMobileOverlay?: boolean,
  hideMask?: boolean,
  drawerHasBeenOpened: boolean,
  introShown: boolean,
  toggleChat(): void,
  setIFrameRef(ref: HTMLIFrameElement): void,
  setIFrameLoaded(): void,
  transitionEndCallback(): void
}

export default class Drawer extends Component<InterfaceDrawer> {
  isIE9OrBelow: boolean;
  drawerRef: any;

  constructor(props: InterfaceDrawer) {
    super(props);

    this.isIE9OrBelow = isIE9OrBelow();
  }

  componentDidMount() {
    this.drawerRef.addEventListener("transitionend", this.props.transitionEndCallback, false);
  }

  componentWillUnmount() {
    this.drawerRef.removeEventListener("transitionend", this.props.transitionEndCallback, false);
  }

  render() {
    const {
      hideMask,
      toggleChat,
      isDrawerOpen,
      useMobileOverlay,
      drawerHasBeenOpened
    } = this.props;

    return (
      <div
        className={classnames(
          "ada-embed-drawer",
          {
            "ada-embed-drawer--hidden": !isDrawerOpen,
            "ada-embed-drawer--isIE9": this.isIE9OrBelow,
            "ada-embed-drawer--mobile-overlay": useMobileOverlay
          }
        )}
        ref={c => this.drawerRef = c}
      >
        {!hideMask &&
          <div
            className="ada-embed-drawer__mask"
            onClick={toggleChat}
            role="button"
          />
        }
        <div
          className="ada-embed-drawer__iframe-container"
          role="dialog"
          aria-modal={isDrawerOpen}
          aria-hidden={!isDrawerOpen}
        >
          {drawerHasBeenOpened && (
            <IFrame
              {...this.props}
            />
          )}
        </div>
      </div>
    );
  }
}
