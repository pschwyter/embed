import { Component, h } from "preact";
import Button from "./Button";
import Drawer from "./Drawer";
import "./style.scss";

interface InterfaceApp {
  chatURL: string,
  cluster: string,
  handle: string,
  language: string,
  mobileOverlay: boolean,
  private: string,
  useMobileOverlay: boolean
}

interface InterfaceState {
  isDrawerOpen: boolean
}

export default class App extends Component<InterfaceApp, InterfaceState> {
  isInMobile: boolean;
  openChatInNewWindow: boolean;

  constructor(props: InterfaceApp) {
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
   */
  constructURL() {
    const {
      handle,
      cluster,
      private: privateMode,
      language
    } = this.props;
    const clusterString = cluster ? `.${cluster}` : "";
    const newPrivateMode = privateMode ? "?private=1" : "";
    const hasPrivateMode = newPrivateMode.length ? "&" : "?";
    const languageString = language ? `${hasPrivateMode}language=${language}` : "";

    return `https://${handle}${clusterString}.ada.support/chat/${newPrivateMode}${languageString}`;
  }

  /**
   *
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
