import Client from "models/Client";
import { Component, h, render } from "preact";
import checkRollout from "services/checkRollout";
import httpRequest from "services/httpRequest";
import postMessage from "services/postMessage";
import constructURL from "services/constructURL";
import { showZendeskWidget } from "services/zendesk";
import Button from "./Button";
import IntroBlurb from "./IntroBlurb";
import Drawer from "./Drawer";
import IFrame from "./IFrame";
import {
  ADA_EVENT_RESET,
  ADA_EVENT_TOGGLE,
  ADA_EVENT_DELETE_HISTORY,
  ADA_EVENT_SET_META_FIELDS,
  ADA_EVENT_FOCUS,
  ADA_EVENT_BLUR
} from "constants/events";
import "./style.scss";

interface InterfaceApp {
  client: Client,
  handle: string,
  styles?: string,
  cluster?: string,
  language?: string,
  private?: boolean,
  greeting?: string,
  hideMask?: boolean,
  metaFields?: object,
  mobileOverlay?: boolean,
  useMobileOverlay?: boolean,
  parentElement?: string | HTMLElement,
  adaReadyCallback(): any,
  analyticsCallback(analytics: any): any,
  liveHandoffCallback(liveHandoff: any): any,
  chatterTokenCallback(chatter: string): any,
}

interface InterfaceState {
  client: Client,
  drawerHasBeenOpened: boolean,
  isDrawerOpen: boolean,
  shoudLoadEmbedUI: boolean,
  showIntro: boolean,
  iframeRef: HTMLIFrameElement,
  isIFrameLoaded: boolean,
  afterIFrameLoadsTasks: CustomEvent[],
  chatter: string,
  unreadMessages: number,
  hasConnectedChat: boolean
}

interface UnreadMessage {
  amount: number
}

export default class App extends Component<InterfaceApp, InterfaceState> {
  static defaultProps = {
    mobileOverlay: true
  };

  isInMobile: boolean;
  openChatInNewWindow: boolean;
  chatURL: string;
  APIURL: string;
  connectorURL: string;

  constructor(props: InterfaceApp) {
    super(props);

    const { mobileOverlay, handle } = props;

    this.state = {
      client: null,
      drawerHasBeenOpened: false,
      isDrawerOpen: false,
      shoudLoadEmbedUI: false,
      showIntro: false,
      iframeRef: null,
      isIFrameLoaded: false,
      afterIFrameLoadsTasks: [],
      chatter: null,
      unreadMessages: 0,
      hasConnectedChat: false
    };

    this.toggleChat = this.toggleChat.bind(this);
    this.isInMobile = (
      navigator.userAgent.match(/(iPhone)|(iPod)|(android)|(webOS)/i) !== null
    );
    this.openChatInNewWindow = !mobileOverlay && this.isInMobile;

    this.setIFrameRef = this.setIFrameRef.bind(this);
    this.receiveMessage = this.receiveMessage.bind(this);
    this.handleAdaEvent = this.handleAdaEvent.bind(this);
    this.setIFrameLoaded = this.setIFrameLoaded.bind(this);
    this.triggerAdaReadyCallback = this.triggerAdaReadyCallback.bind(this);

    const route = "connect";
    this.connectorURL = constructURL(
      { handle, route },
      false
    );

    this.APIURL = constructURL(this.URLParams, true);
    this.chatURL = null;
  }

  componentDidMount() {
    this.fetchClientAndSetup();
    this.initiateAdaEventListener();
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  /**
   * Bind the message event listener to global scope
   */
  initiateMessageListener() {
    window.addEventListener("message", this.receiveMessage, false);
  }

  /**
   * Bind the ada event listener to global scope
   */
  initiateAdaEventListener() {
    document.addEventListener("ada-event", this.handleAdaEvent, false);
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
    if (originURL && !originURL.startsWith(event.origin)) { return; }

    const {
      liveHandoff,
      zendeskLiveHandoff,
      chatter,
      analytics,
      closeChat,
      chatterIds,
      newMessages
    } = event.data;

    const {
      liveHandoffCallback,
      chatterTokenCallback,
      analyticsCallback
    } = this.props;

    const { isDrawerOpen } = this.state;

    if (liveHandoff && liveHandoffCallback) {
      liveHandoffCallback(liveHandoff);
    } else if (zendeskLiveHandoff) {
      showZendeskWidget(zendeskLiveHandoff, this.toggleChat);
    } else if (chatter && chatterTokenCallback) {
      chatterTokenCallback(chatter);
      this.setState({ chatter });
    } else if (analytics && analyticsCallback) {
      analyticsCallback(analytics);
    } else if (closeChat && isDrawerOpen) {
      this.toggleChat();
    } else if (chatterIds) {
      this.fetchChatterAndSetup(chatterIds);
    } else if (newMessages) {
      this.handleNewMessages(newMessages);
    }
  }

  /**
   * Fetch chatter token from local/session storage via the connector's postMessage
   * and store the appropriate ID
   */
  fetchChatterAndSetup(chatterIds: string) {
    const {
      client
    } = this.state;
    const persistence = client.persistence === "normal" ? "local" : client.persistence;
    if (chatterIds[persistence]) {
      this.setState({
        chatter: chatterIds[persistence]
      }, () => this.fetchUnread());
    }
  }

  get URLParams() {
    const {
      handle,
      cluster,
      language,
      greeting,
      private: privateMode,
      metaFields
    } = this.props;

    return {
      handle,
      cluster,
      language,
      greeting,
      privateMode,
      metaFields
    };
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
      const followUpResponseId = client.intro && client.intro.response_id;

      this.chatURL = constructURL(
        Object.assign(this.URLParams, { followUpResponseId }),
        false
      );

      this.setState({
        client: new Client(client)
      }, () => {
        const { rollout, chat: chatIsOn } = client;

        if (!chatIsOn) {
          console.warn("Sorry, please turn on the web chat integration in your bot's settings");
          return;
        }

        // It should be loaded if rollout returns true, or if a parentElement is being used
        const shoudLoadEmbedUI = Boolean(parentElement) || checkRollout(rollout, handle);

        this.setState({
          shoudLoadEmbedUI
        }, () => {
          if (shoudLoadEmbedUI) {
            this.initiateMessageListener();

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
    }, (error) => {
      console.warn(error);
      throw Error("An error occurred while retrieving the client");
    });
  }

  fetchUnread() {
    const { chatter, drawerHasBeenOpened } = this.state;
    const route = `chatters/${chatter}/notification_status`;
    const url = constructURL(
      Object.assign(this.URLParams, { route }),
      true
    );
    httpRequest({
      url
    }).then((response) => {
      // Set unread amount, connected to connector on chat
      // and open chat if in (active/pending) live state
      this.setState({
        unreadMessages: response.unread_amount,
        hasConnectedChat: true,
        drawerHasBeenOpened: drawerHasBeenOpened || response.is_live_state
      });
    }, (error) => {
      console.warn(error);
      throw Error("An error occurred while retrieving the client");
    });
  }

  /**
   * Event hanlder for custom Ada events
   */
  handleAdaEvent(event: CustomEvent) {
    const { iframeRef, isIFrameLoaded, afterIFrameLoadsTasks } = this.state;
    const { detail } = event;
    const { type, data } = detail;

    if (type === ADA_EVENT_TOGGLE) {
      this.toggleChat();
      return;
    }

    if (!isIFrameLoaded) {
      afterIFrameLoadsTasks.push(event);

      this.setState({
        afterIFrameLoadsTasks
      });

      return;
    }

    switch (type) {
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
   * Handles incoming messages from Chat
   */
  handleNewMessages(messages: UnreadMessage) {
    const { unreadMessages } = this.state;

    this.setState({
      unreadMessages: unreadMessages + messages.amount
    });
  }

  /**
   * Handles clearing unread messages on both Embed and API
   */
  handleClearUnreadMessages() {
    const { chatter } = this.state;
    this.setState({
      unreadMessages: 0
    });

    if (!chatter) return;
    // Send request to API to clear unread messages
    const route = `chatters/${chatter}/live_chat_unread_amount`;
    const url = constructURL(
      Object.assign(this.URLParams, { route }),
      true
    );
    httpRequest({
      url,
      method: "DELETE"
    });
  }

  /**
   * Open/close the Drawer component, or open a new window if in mobile
   */
  toggleChat() {
    const { isDrawerOpen, iframeRef } = this.state;
    const nextIsDrawerOpen = !isDrawerOpen;

    // Clear unread messages
    this.handleClearUnreadMessages();

    // Open Chat in a new window if mobile
    if (this.openChatInNewWindow) {
      window.open(this.chatURL);

      return;
    }

    this.setState({
      isDrawerOpen: nextIsDrawerOpen,
      drawerHasBeenOpened: true
    }, () => {
      if (iframeRef) {
        if (nextIsDrawerOpen) {
          // To ensure the input bar is always focused in Chat when the drawer is opened
          iframeRef.contentWindow.focus();
          postMessage(iframeRef, ADA_EVENT_FOCUS, this.chatURL);
        } else {
          postMessage(iframeRef, ADA_EVENT_BLUR, this.chatURL);

          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
        }
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

  setIFrameLoaded() {
    const { afterIFrameLoadsTasks } = this.state;

    this.setState({
      isIFrameLoaded: true,
      afterIFrameLoadsTasks: []
    }, () => {
      afterIFrameLoadsTasks.forEach((event) => {
        this.handleAdaEvent(event);
      });
    });
  }

  triggerAdaReadyCallback() {
    const { adaReadyCallback } = this.props;
    if (adaReadyCallback) { adaReadyCallback(); }
  }

  /**
   * To be rendered when user is using parentElement config
   */
  renderIFrameForParentElement() {
    const {
      client,
      iframeRef,
      isDrawerOpen
    } = this.state;

    return (
      <IFrame
        {...this.props}
        iframeRef={iframeRef}
        chatURL={this.chatURL}
        isDrawerOpen={isDrawerOpen}
        setIFrameRef={this.setIFrameRef}
        setIFrameLoaded={this.setIFrameLoaded}
      />
    );
  }

  /**
   * Standard config render (no parentElement)
   */
  renderStandardConfigElements() {
    const { mobileOverlay, hideMask } = this.props;
    const {
      isDrawerOpen,
      drawerHasBeenOpened,
      client,
      showIntro,
      iframeRef,
      unreadMessages,
      hasConnectedChat
    } = this.state;

    return (
      <div>
        {/* Do not render Drawer if Chat will be opened in new window */}
        {!this.openChatInNewWindow && (
          <Drawer
            {...this.props}
            hideMask={hideMask}
            iframeRef={iframeRef}
            chatURL={this.chatURL}
            isDrawerOpen={isDrawerOpen}
            toggleChat={this.toggleChat}
            setIFrameRef={this.setIFrameRef}
            setIFrameLoaded={this.setIFrameLoaded}
            drawerHasBeenOpened={drawerHasBeenOpened}
            useMobileOverlay={mobileOverlay && this.isInMobile}
          />
        )}
        {!isDrawerOpen && (
          <Button
            client={client}
            toggleChat={this.toggleChat}
            showIntroEmoji={
              showIntro &&
              client.intro.style.toLowerCase() === "emoji" &&
              !drawerHasBeenOpened
            }
            showNotification={unreadMessages > 0}
          />
        )}
        {showIntro && client.intro.style.toLowerCase() === "text" && !drawerHasBeenOpened && (
          <IntroBlurb
            client={client}
            toggleChat={this.toggleChat}
            isInMobile={this.isInMobile}
          />
        )}
        {/* This iFrame is here to connect with /chat/connect/ and pull the chatter's ID from
            both local and session storage through postMessage. Once the message is received
            hasConnectedChat will be set to true and the iFrame will no longer be rendered.
            For more info @Kiwi or @Nic*/}
        {!hasConnectedChat && (
          <iframe
            name="ada-embed-connector-iframe"
            className="ada-embed-connector-iframe"
            src={this.connectorURL}
            title="Ada Embed Connector"
            style="display: none;"
          />
        )}
      </div>
    );
  }

  get elementToRender() {
    const { parentElement } = this.props;
    const {
      shoudLoadEmbedUI
    } = this.state;

    if (!shoudLoadEmbedUI) {
      return (null);
    }

    if (parentElement) {
      return this.renderIFrameForParentElement();
    }

    return this.renderStandardConfigElements();
  }

  render() {
    return (
      <div id="ada-embed" className="ada-embed-app" ref={this.triggerAdaReadyCallback}>
        {this.elementToRender}
      </div>
    );
  }
}
