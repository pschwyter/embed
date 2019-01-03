import { Component } from "preact";
import classnames from "classnames";
import "./style.scss";

export default class Drawer extends Component {
  /**
   * @param {Object} props
   * @returns {ReactElement}
   */
  render(props) {
    const { handle, isDrawerOpen, toggleDrawer } = props;

    return (
      <div
        class={classnames(
          "ada-chaperone-drawer",
          {
            "ada-chaperone-drawer--hidden": !isDrawerOpen
          }
        )}
      >
        <div 
          class="ada-chaperone-drawer__mask"
          onClick={toggleDrawer}
        />
        <iframe 
          class="ada-chaperone-drawer__iframe"
          src={`https://${handle}.ada.support/chat/`} 
        />
      </div>
    );
  }
}
