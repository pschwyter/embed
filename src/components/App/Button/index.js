import { Component } from "preact";
import "./style.scss";

export default class Button extends Component {
  render(props) {
    const { openChat } = props;

    return (
      <button
        title="Open Support Chat"
        accessKey="1"
        tabIndex="0"
        className="ada-chaperone-button"
        onClick={openChat}
      >
        BUTTON
      </button>
    );
  }
}
