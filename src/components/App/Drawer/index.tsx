import classnames from "classnames";
import Client from "models/Client";
import { Component, h } from "preact";
import { isIE9OrBelow } from "services/browsers";
import IFrame from "../IFrame";
import "./style.scss";

interface InterfaceDrawer {
  client: Client,
  handle: string,
  isDrawerOpen: boolean,
  iframeRef?: HTMLIFrameElement,
  chatURL: string,
  useMobileOverlay: boolean,
  drawerHasBeenOpened: boolean,
  toggleChat(): void,
  setIFrameRef(ref: HTMLIFrameElement): void,
  setIFrameLoaded(): void
}

export default class Drawer extends Component<InterfaceDrawer> {
  isIE9OrBelow: boolean;

  constructor(props: InterfaceDrawer) {
    super(props);

    this.isIE9OrBelow = isIE9OrBelow();
  }

  render() {
    const {
      isDrawerOpen,
      toggleChat,
      useMobileOverlay,
      drawerHasBeenOpened
    } = this.props;

    return (
      <div
        className={classnames(
          "ada-chaperone-drawer",
          {
            "ada-chaperone-drawer--hidden": !isDrawerOpen,
            "ada-chaperone-drawer--isIE9": this.isIE9OrBelow,
            "ada-chaperone-drawer--mobile-overlay": useMobileOverlay
          }
        )}
      >
        <div
          className="ada-chaperone-drawer__mask"
          onClick={toggleChat}
          role="button"
        />
        <div
          className="ada-chaperone-drawer__iframe-container"
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
