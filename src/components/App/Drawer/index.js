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
          "ADA-CHAPERONE-Drawer",
          {
            "ADA-CHAPERONE-Drawer--hidden": !isDrawerOpen
          }
        )}
      >
        <div 
          class="ADA-CHAPERONE-Drawer__mask"
          onClick={toggleDrawer}
        />
        <iframe 
          class="ADA-CHAPERONE-Drawer__iframe"
          src={`https://${handle}.ada.support/chat/`} 
        />
      </div>
    );
  }
}
