import { Component } from "preact";
import classnames from "classnames";
import "./style.scss";

export default class Drawer extends Component {
  /**
   * @param {Object} props
   * @returns {ReactElement}
   */
  render(props) {
    const { handle, isDrawerOpen } = props;

    return (
      <iframe 
        class={classnames(
          "ADA-CHAPERONE-Drawer",
          {
            "ADA-CHAPERONE-Drawer--hidden": !isDrawerOpen
          }
        )}
        src={`https://${handle}.ada.support/chat/`} 
      />
    );
  }
}
