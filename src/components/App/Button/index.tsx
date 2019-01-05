import { Component, h } from "preact";
import "./style.scss";

interface InterfaceButton {
  openChat(): void
}

export default class Button extends Component<InterfaceButton> {
  render(props: InterfaceButton) {
    const { openChat } = props;

    return (
      <button
        title="Open Support Chat"
        accessKey="1"
        className="ada-chaperone-button"
        onClick={openChat}
      >
        BUTTON
      </button>
    );
  }
}
