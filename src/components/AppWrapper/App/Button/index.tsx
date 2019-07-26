import classnames from "classnames";
import Client from "models/Client";
import DialogueSvg from "icons/Dialogue.svg";
import SVG from "react-inlinesvg";
import { Component, h } from "preact";
import "./style.scss";

const NOTIFICATION_BADGE_SIZE_RATIO = 0.386;
const NOTIFICATION_BADGE_BOTTOM_RATIO = 0.705;
const NOTIFICATION_BADGE_RIGHT_RATIO = -0.09;
const NOTIFICATION_BADGE_BORDER_RATIO = 0.352;

interface InterfaceButton {
  client: Client,
  showIntroEmoji: boolean,
  showNotification: boolean,
  isDraggable: boolean,
  toggleChat(): void
}

export default class Button extends Component<InterfaceButton> {
  state = {
    customIconHasLoaded: false
  };

  setCustomIconHasLoaded = () => {
    this.setState({ customIconHasLoaded: true });
  }

  get notificationStyles() {
    const { client } = this.props;
    const buttonSize = client.chatButton.size;
    const heightAndWidth = Math.ceil(buttonSize * NOTIFICATION_BADGE_SIZE_RATIO);

    return {
      height: heightAndWidth,
      width: heightAndWidth,
      bottom: buttonSize * NOTIFICATION_BADGE_BOTTOM_RATIO,
      right: buttonSize * NOTIFICATION_BADGE_RIGHT_RATIO,
      borderWidth: heightAndWidth * NOTIFICATION_BADGE_BORDER_RATIO
    };
  }

  render(props: InterfaceButton) {
    const { customIconHasLoaded } = this.state;
    const {
      toggleChat, client, showIntroEmoji,
      showNotification, isDraggable
    } = props;

    const useCustomIcon = client.chatButton.icon_type === "custom" || null;
    const chatButtonURL = useCustomIcon ? client.chatButton.icon_path : "static/icons/Dialogue.svg";
    const buttonSize = client.chatButton.size;

    const adaEmbedButtonContainerClassName = classnames("ada-embed-button-container", {
      "ada-embed-button-container--loading": useCustomIcon && !customIconHasLoaded,
      "ada-embed-button-container--not-draggable": !isDraggable
    });
    const chatButtonIconClassname = classnames("ada-embed-button__icon", {
      "ada-embed-button__icon--hide": showIntroEmoji
    });

    return (
      <div className={adaEmbedButtonContainerClassName}>
        <button
          title="Open Support Chat"
          accessKey="1"
          className="ada-embed-button"
          onClick={toggleChat}
          style={{
            width: buttonSize,
            height: buttonSize,
            backgroundColor: client.chatButton.background_color
          }}
        >
          { useCustomIcon ?
            <SVG
              src={chatButtonURL}
              className={chatButtonIconClassname}
              onLoad={this.setCustomIconHasLoaded}
              cacheGetRequests={true}
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
        {showNotification && (
          <div
            className="ada-embed-notification"
            alt="New Message"
            role="alert"
            style={this.notificationStyles}
          />
        )}
      </div>
    );
  }
}
