import classnames from "classnames";
import Client from "models/Client";
import DialogueSvg from "icons/Dialogue.svg";
import SVG from "react-inlinesvg";
import { Component, h } from "preact";
import "./style.scss";

const CHAT_BUTTON_PADDING_SIZE_RATIO = 6.28;

interface InterfaceButton {
  client: Client,
  showIntroEmoji: boolean,
  toggleChat(): void
}

export default class Button extends Component<InterfaceButton> {
  render(props: InterfaceButton) {
    const { toggleChat, client, showIntroEmoji } = props;

    const useCustomIcon = client.chatButton.icon_type === "custom" || null;
    const chatButtonURL = useCustomIcon ? client.chatButton.icon_path : "static/icons/Dialogue.svg";

    const chatButtonIconClassname = classnames("ada-embed-button__icon", {
      "ada-embed-button__icon--hide": showIntroEmoji
    })

    return (
      <div className="ada-embed-button-container">
        <button
          title="Open Support Chat"
          accessKey="1"
          className="ada-embed-button"
          onClick={toggleChat}
          style={{
            width: client.chatButton.size,
            height: client.chatButton.size,
            backgroundColor: client.chatButton.background_color
          }}
        >
          { useCustomIcon ? 
            <SVG
              src={chatButtonURL}
              className={chatButtonIconClassname}
              cacheGetRequests
            /> :
            <DialogueSvg
              className={chatButtonIconClassname}
            />
          }
          {showIntroEmoji && (
            <img
              alt=""
              role="presentation"
              src={client.intro.body}
              className={
                classnames("ada-embed-button__emoji", {
                  "ada-embed-button__emoji--show": showIntroEmoji
                })
              }
            />
          )}
        </button>
      </div>
    );
  }
}
