import Client from "models/Client";
import { Component, h, render } from "preact";
import checkRollout from "services/checkRollout";
import httpRequest from "services/httpRequest";
import postMessage from "services/postMessage";
import constructURL from "services/constructURL";
import Button from "./Button";
import IntroBlurb from "./IntroBlurb";
import Drawer from "./Drawer";
import IFrame from "./IFrame";
import {
  ADA_EVENT_RESET,
  ADA_EVENT_TOGGLE,
  ADA_EVENT_DELETE_HISTORY,
  ADA_EVENT_SET_META_FIELDS,
  ADA_EVENT_FOCUS
} from "constants/events";
import "./style.scss";

interface InterfaceApp {
  cluster?: string,
  customStyles?: string,
  greetingHandle?: string,
  handle: string,
  language?: string,
  metaFields?: object,
  mobileOverlay?: boolean,
  parentElement?: string | HTMLElement,
  private?: boolean,
  styles?: string,
  useMobileOverlay?: boolean,
  liveHandoffCallback(liveHandoff: any): any,
  showZendeskWidget(zendeskLiveHandoff: any): any,
  chatterTokenCallback(chatter: string): any,
  analyticsCallback(analytics: any): any
}

interface InterfaceState {
  client: Client,
  drawerHasBeenOpened: boolean,
  isDrawerOpen: boolean,
  shoudLoadChaperoneUI: boolean,
  showIntro: boolean,
  iframeRef: HTMLIFrameElement
}

export default class App extends Component<InterfaceApp, InterfaceState> {
  isInMobile: boolean;
  openChatInNewWindow: boolean;
  chatURL: string;
  APIURL: string;

  constructor(props: InterfaceApp) {
    super(props);

    const { mobileOverlay } = props;

    this.state = {
      client: null,
      drawerHasBeenOpened: false,
      isDrawerOpen: false,
      shoudLoadChaperoneUI: false,
      showIntro: false,
      iframeRef: null
    };

    this.openChat = this.openChat.bind(this);
    this.isInMobile = (
      navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i) !== null
    );
    this.openChatInNewWindow = !mobileOverlay && this.isInMobile;

    this.receiveMessage = this.receiveMessage.bind(this);
    this.handleAdaEvent = this.handleAdaEvent.bind(this);
    this.setIFrameRef = this.setIFrameRef.bind(this);

    const urlParams = {
      handle: props.handle,
      cluster: props.cluster,
      language: props.language,
      private: props.private,
      metaFields: props.metaFields
    };
    this.chatURL = constructURL(urlParams, false, this.openChatInNewWindow);
    this.APIURL = constructURL(urlParams, true, false);
  }

  componentDidMount() {
    this.fetchClientAndSetup();
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  /**
   * Bind the event listeners to global scope
   */
  initiateListeners() {
    document.addEventListener("ada-event", this.handleAdaEvent, false);
    window.addEventListener("message", this.receiveMessage, false);
  }

  /**
   * Remove the event listeners to global scope
   */
  removeListeners() {
    document.removeEventListener("ada-event", this.handleAdaEvent, false);
    window.removeEventListener("message", this.receiveMessage, false);
  }

  /**
   * Handle incoming post message events from Chat
   */
  receiveMessage(event: MessageEvent) {
    const originURL = this.chatURL;
    // Ensure that event origin is the same as the Chat URL
    if (!originURL.startsWith(event.origin)) { return; }

    const { liveHandoff, zendeskLiveHandoff, chatter, analytics } = event.data;
    const {
      liveHandoffCallback,
      showZendeskWidget,
      chatterTokenCallback,
      analyticsCallback
    } = this.props;

    if (liveHandoff && liveHandoffCallback) {
      liveHandoffCallback(liveHandoff);
    } else if (zendeskLiveHandoff && showZendeskWidget) {
      showZendeskWidget(zendeskLiveHandoff);
    } else if (chatter && chatterTokenCallback) {
      chatterTokenCallback(chatter);
    } else if (analytics && analyticsCallback) {
      analyticsCallback(analytics);
    }
  }

  /**
   * Fetch the client model and set state accordingly
   */
  fetchClientAndSetup() {
    const { handle, parentElement } = this.props;

    httpRequest({
      url: this.APIURL
    }).then((response) => {
      const { client } = response;

      this.setState({
        client: new Client(client)
      }, () => {
        const { rollout, chat: chatIsOn } = client;

        if (!chatIsOn) {
          console.warn("Sorry, please turn on the web chat integration in your bot's settings");
          return;
        }

        // It should be loaded if rollout returns true, or if a parentElement is being used
        const shoudLoadChaperoneUI = Boolean(parentElement) || checkRollout(rollout, handle);

        this.setState({
          shoudLoadChaperoneUI
        }, () => {
          if (shoudLoadChaperoneUI) {
            this.initiateListeners();

            if (client.intro) {
              setTimeout(() => {
                this.setState({
                  showIntro: true
                });
              }, client.intro.delay * 1000);
            }
          }
        });
      });
    }, () => {
      throw (Error("An error occurred while retrieving the client"));
    });
  }

  /**
   * Event hanlder for custom Ada events
   */
  handleAdaEvent(event: CustomEvent) {
    const { iframeRef } = this.state;
    const { detail } = event;
    const { type, data } = detail;

    switch (type) {
      case ADA_EVENT_TOGGLE:
        this.openChat();
        break;
      case ADA_EVENT_SET_META_FIELDS:
        postMessage(iframeRef, data, this.chatURL);
        break;
      case ADA_EVENT_RESET:
        postMessage(iframeRef, ADA_EVENT_RESET, this.chatURL);
        break;
      case ADA_EVENT_DELETE_HISTORY:
        postMessage(iframeRef, ADA_EVENT_DELETE_HISTORY, this.chatURL);
        break;
    }
  }

  /**
   * Open/close the Drawer component, or open a new window if in mobile
   */
  openChat() {
    const { isDrawerOpen, iframeRef } = this.state;
    const nextIsDrawerOpen = !isDrawerOpen;

    // Open Chat in a new window if mobile
    if (this.openChatInNewWindow) {
      window.open(this.chatURL);

      return;
    }

    this.setState({
      isDrawerOpen: nextIsDrawerOpen,
      drawerHasBeenOpened: true
    }, () => {
      if (iframeRef && nextIsDrawerOpen) {
        // To ensure the input bar is always focused in Chat when the drawer is opened
        iframeRef.contentWindow.focus();
        postMessage(iframeRef, ADA_EVENT_FOCUS, this.chatURL);
      }
    });
  }

  /**
   * Set the iFrame ref on the parent
   */
  setIFrameRef(ref: HTMLIFrameElement) {
    this.setState({
      iframeRef: ref
    });
  }

  /**
   * To be rendered when user is using parentElement config
   */
  renderIFrameForParentElement() {
    const {
      client,
      iframeRef
    } = this.state;

    return (
      <div id="ada-embed" className="ada-chaperone-app">
        <IFrame
          {...this.props}
          client={client}
          iframeRef={iframeRef}
          chatURL={this.chatURL}
          setIFrameRef={this.setIFrameRef}
        />
      </div>
    );
  }

  /**
   * Standard config render (no parentElement)
   */
  renderStandardConfigElements() {
    const { mobileOverlay } = this.props;
    const {
      isDrawerOpen,
      drawerHasBeenOpened,
      client,
      showIntro,
      iframeRef
    } = this.state;

    return (
      <div id="ada-embed" className="ada-chaperone-app">
        {/* Do not render Drawer if Chat will be opened in new window */}
        {!this.openChatInNewWindow && (
          <Drawer
            {...this.props}
            client={client}
            iframeRef={iframeRef}
            chatURL={this.chatURL}
            openChat={this.openChat}
            isDrawerOpen={isDrawerOpen}
            setIFrameRef={this.setIFrameRef}
            drawerHasBeenOpened={drawerHasBeenOpened}
            useMobileOverlay={mobileOverlay && this.isInMobile}
          />
        )}
        {!isDrawerOpen && (
          <Button
            client={client}
            openChat={this.openChat}
            showIntroEmoji={
              showIntro &&
              client.intro.style.toLowerCase() === "emoji" &&
              !drawerHasBeenOpened
            }
          />
        )}
        {showIntro && client.intro.style.toLowerCase() === "text" && !drawerHasBeenOpened && (
          <IntroBlurb
            client={client}
            openChat={this.openChat}
            isInMobile={this.isInMobile}
          />
        )}
      </div>
    );
  }

  render(props: InterfaceApp) {
    const { parentElement } = props;
    const {
      shoudLoadChaperoneUI
    } = this.state;

    if (!shoudLoadChaperoneUI) { return (null); }

    return Boolean(parentElement) ?
      this.renderIFrameForParentElement() :
      this.renderStandardConfigElements();
  }
}
