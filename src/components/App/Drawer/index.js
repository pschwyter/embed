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

    this.isIE9OrBelow = isIE9OrBelow();
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
      mobileOverlay
    } = props;

    return (
      <div
        className={classnames(
          "ada-chaperone-drawer",
          {
            "ada-chaperone-drawer--hidden": !isDrawerOpen,
            "ada-chaperone-drawer--isIE9": this.isIE9OrBelow,
            "ada-chaperone-drawer--mobile-overlay": mobileOverlay
          }
        )}
      >
        <div
          className="ada-chaperone-drawer__mask"
          onClick={openChat}
        />
        <iframe
          className="ada-chaperone-drawer__iframe"
          src={chatURL}
          title={`${handle} chat support`}
        />
      </div>
    );
  }
}
