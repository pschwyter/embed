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
          "ada-chaperone-Drawer",
          {
            "ada-chaperone-Drawer--hidden": !isDrawerOpen
          }
        )}
      >
        <div 
          class="ada-chaperone-Drawer__mask"
          onClick={toggleDrawer}
        />
        <iframe 
          class="ada-chaperone-Drawer__iframe"
          src={`https://${handle}.ada.support/chat/`} 
        />
      </div>
    );
  }
}
