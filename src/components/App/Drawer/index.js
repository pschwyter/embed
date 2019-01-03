import { Component } from "preact";
import classnames from "classnames";
import { isIE9OrBelow } from "services/browsers";
import "./style.scss";

export default class Drawer extends Component {
  /**
   * @param {Object} props
   */
  constructor(props) {
    super(props);

    this.state = {
      drawerHasBeenOpened: false
    };

    this.isIE9OrBelow = isIE9OrBelow();
  }

  /**
   * @param {Object} nextProps
   */
  componentWillReceiveProps(nextProps) {
    const { isDrawerOpen } = this.props;
    const { drawerHasBeenOpened } = this.state;

    if (isDrawerOpen !== nextProps.isDrawerOpen && !drawerHasBeenOpened) {
      this.setState({
        drawerHasBeenOpened: true
      });
    }
  }

  /**
   * @param {Object} props
   * @returns {ReactElement}
   */
  render(props) {
    const {
      handle,
      isDrawerOpen,
      openChat,
      chatURL,
      useMobileOverlay
    } = props;
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
              className="ada-chaperone-drawer__iframe-container__iframe"
              src={chatURL}
              title={`${handle} chat support`}
            />
          )}
        </div>
      </div>
    );
  }
}
