import classnames from "classnames";
import Client from "models/Client";
import DialogueSvg from "icons/Dialogue.svg";
import { Component, h } from "preact";
import "./style.scss";

interface InterfaceButton {
  client: Client,
  showIntroEmoji: boolean,
  toggleChat(): void
}

export default class Button extends Component<InterfaceButton> {
  render(props: InterfaceButton) {
    const { toggleChat, client, showIntroEmoji } = props;

    return (
      <div className="ada-chaperone-button-container">
        <button
          title="Open Support Chat"
          accessKey="1"
          className="ada-chaperone-button"
          onClick={toggleChat}
          style={{
            backgroundColor: client.tint
          }}
        >
          <DialogueSvg
            className={
              classnames("ada-chaperone-button__icon", {
                "ada-chaperone-button__icon--hide": showIntroEmoji
              })
            }
          />
          {showIntroEmoji && (
            <img
              alt=""
              role="presentation"
              src={client.intro.body}
              className={
                classnames("ada-chaperone-button__emoji", {
                  "ada-chaperone-button__emoji--show": showIntroEmoji
                })
              }
            />
          )}
        </button>
      </div>
    );
  }
}
