import classnames from "classnames";
import { Component, h } from "preact";
import { isIE9OrBelow } from "../../../services/browsers";
import "./style.scss";

interface InterfaceDrawer {
  handle: string,
  isDrawerOpen: boolean,
  chatURL: string,
  useMobileOverlay: boolean,
  openChat(): void
}

interface InterfaceState {
  drawerHasBeenOpened: boolean
}

export default class Drawer extends Component<InterfaceDrawer, InterfaceState> {
  isIE9OrBelow: boolean;

  constructor(props: InterfaceDrawer) {
    super(props);

    this.state = {
      drawerHasBeenOpened: false
    };

    this.isIE9OrBelow = isIE9OrBelow();
  }

  componentWillReceiveProps(nextProps: InterfaceDrawer) {
    const { isDrawerOpen } = this.props;
    const { drawerHasBeenOpened } = this.state;

    if (isDrawerOpen !== nextProps.isDrawerOpen && !drawerHasBeenOpened) {
      this.setState({
        drawerHasBeenOpened: true
      });
    }
  }

  render() {
    const {
      handle,
      isDrawerOpen,
      openChat,
      chatURL,
      useMobileOverlay
    } = this.props;
    const { drawerHasBeenOpened } = this.state;

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
          onClick={openChat}
        />
        <div className="ada-chaperone-drawer__iframe-container">
          {drawerHasBeenOpened && (
            <iframe
              className="ada-chaperone-drawer__iframe"
              src={chatURL}
              title={`${handle} chat support`}
            />
          )}
        </div>
      </div>
    );
  }
}
