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
    const { handle, isDrawerOpen, toggleDrawer } = props;

    return (
      <div
        className={classnames(
          "ada-chaperone-drawer",
          {
            "ada-chaperone-drawer--hidden": !isDrawerOpen,
            "ada-chaperone-drawer--isIE9": this.isIE9OrBelow
          }
        )}
      >
        <div
          className="ada-chaperone-drawer__mask"
          onClick={toggleDrawer}
        />
        <iframe
          className="ada-chaperone-drawer__iframe"
          src={`https://${handle}.ada.support/chat/`}
          title={`${handle} chat support`}
        />
      </div>
    );
  }
}
