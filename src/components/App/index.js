import { Component } from "preact";
import Drawer from "./Drawer";
import Button from "./Button";
import "./style.scss";

export default class App extends Component {
  /**
   * @param {Object} props
   */
  constructor(props) {
    super(props);

    const { mobileOverlay } = props;

    this.state = {
      isDrawerOpen: false
    };

    this.openChat = this.openChat.bind(this);
    this.isInMobile = (
      navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i) !== null
    );
    this.openChatInNewWindow = !mobileOverlay && this.isInMobile;
  }

  /**
   * Open/close the Drawer component, or open a new window if in mobile
   */
  openChat() {
    const { isDrawerOpen } = this.state;
    const nextIsDrawerOpen = !isDrawerOpen;

    // Open Chat in a new window if mobile
    if (this.openChatInNewWindow) {
      window.open(this.constructURL());

      return;
    }

    this.setState({
      isDrawerOpen: nextIsDrawerOpen
    });
  }

  /**
   * Generate the Chat App URL
   * @returns {String}
   */
  constructURL() {
    const {
      handle,
      cluster: _cluster,
      private: _private,
      language: _language
    } = this.props;
    const cluster = _cluster ? `.${_cluster}` : "";
    const privateMode = _private ? "?private=1" : "";
    const hasPrivateMode = privateMode.length ? "&" : "?";
    const language = _language ? `${hasPrivateMode}language=${_language}` : "";

    return `https://${handle}${cluster}.ada.support/chat/${privateMode}${language}`;
  }

  /**
   * @param {Object} props
   * @returns {ReactElement}
   */
  render(props) {
    const { handle, mobileOverlay } = props;
    const { isDrawerOpen } = this.state;

    return (
      <div>
        {/* Do not render Drawer if Chat will be opened in new window */}
        {!this.openChatInNewWindow && (
          <Drawer
            handle={handle}
            isDrawerOpen={isDrawerOpen}
            openChat={this.openChat}
            chatURL={this.constructURL()}
            useMobileOverlay={mobileOverlay && this.isInMobile}
          />
        )}
        <Button
          openChat={this.openChat}
        />
      </div>
    );
  }
}
