import { Component } from "preact";
import "./style.scss";

export default class Button extends Component {
  render(props) {
    return (
      <button
        title="Open Support Chat"
        accessKey="1"
        tabIndex="0"
        className="ADA-CHAPERONE-Button"
      >
        BUTTON
      </button>
    );
  }
}
