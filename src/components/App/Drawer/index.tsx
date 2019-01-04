import { h, Component } from "preact";
import classnames from "classnames";
import { isIE9OrBelow } from "../../../services/browsers";
import "./style.scss";

interface DrawerInterface {
  handle: string,
  isDrawerOpen: boolean,
  openChat(): void,
  chatURL: string,
  useMobileOverlay: boolean
}

interface State {
  drawerHasBeenOpened: boolean
}

export default class Drawer extends Component<DrawerInterface, State> {
  isIE9OrBelow: boolean

  constructor(props: DrawerInterface) {
    super(props);

    this.state = {
      drawerHasBeenOpened: false
    };

    this.isIE9OrBelow = isIE9OrBelow();
  }

  componentWillReceiveProps(nextProps: DrawerInterface) {
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
