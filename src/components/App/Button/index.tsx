import classnames from "classnames";
import Client from "models/Client";
import { Component, h } from "preact";
import "./style.scss";

interface InterfaceButton {
  client: Client,
  showIntroEmoji: boolean,
  openChat(): void
}

export default class Button extends Component<InterfaceButton> {
  render(props: InterfaceButton) {
    const { openChat, client, showIntroEmoji } = props;

    return (
      <div className="ada-chaperone-button-container">
        <button
          title="Open Support Chat"
          accessKey="1"
          className="ada-chaperone-button"
          onClick={openChat}
          style={{
            backgroundColor: client.tint
          }}
        >
          <div
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
