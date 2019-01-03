import { Component } from "preact";
import "./style.scss";

export default class Button extends Component {
  render(props) {
    const { toggleDrawer } = props;

    return (
      <button
        title="Open Support Chat"
        accessKey="1"
        tabIndex="0"
        className="ada-chaperone-button"
        onClick={toggleDrawer}
      >
        BUTTON
      </button>
    );
  }
}
