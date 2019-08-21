import Client from "models/Client";
import { Component, h, render } from "preact";
import checkRollout from "services/checkRollout";
import httpRequest from "services/httpRequest";
import postMessage from "services/postMessage";
import constructURL from "services/constructURL";
import { showZendeskWidget } from "services/zendesk";
import { draggability as Draggability } from "./Draggable";
import classnames from "classnames";
import Button from "./Button";
import IntroBlurb from "./IntroBlurb";
import Drawer from "./Drawer";
import IFrame from "./IFrame";
import {
  ADA_EVENT_BLUR,
  ADA_EVENT_FOCUS,
  ADA_EVENT_RESET,
  ADA_EVENT_TOGGLE,
  ADA_EVENT_GET_INFO,
  ADA_EVENT_GIVE_INFO,
  ADA_EVENT_DELETE_HISTORY,
  ADA_EVENT_SET_META_FIELDS
} from "constants/events";
import { InterfaceState as AppWrapperInterfaceState } from "components/AppWrapper";
import "./style.scss";
import { store, retrieve, removeStore } from "services/store";
import { CHATTER_TOKEN, CHATTER_CREATED, CHATTER_ZD_SESSION } from "constants/store";

interface UnreadMessage {
  amount: number
}

interface InterfaceApp extends AppWrapperInterfaceState {
  setAppState(hash: object, callback?: () => void): void
}

export default class App extends Component<InterfaceApp> {
  isInMobile: boolean;
  openChatInNewWindow: boolean;
  APIURL: string;
  connectorURL: string;
  adaModalElement: HTMLDivElement;
  appRef: HTMLDivElement;
  documentBodyOverflow: string;
  documentBodyPosition: string;
  documentBodyTop: string;
  documentBodyBottom: string;
  documentBodyLeft: string;
  documentBodyRight: string;
  pageYOffset: number;
  chatterToken: string;
  chatterCreated: string;
  chatterZDSession: string;

  constructor(props: InterfaceApp) {
    super(props);

    const {
      mobileOverlay,
      handle,
      cluster,
      domain
    } = props;

    this.toggleChat = this.toggleChat.bind(this);
    this.isInMobile = (
      navigator.userAgent.match(/(iPhone)|(iPod)|(android)|(webOS)/i) !== null
    );
    this.openChatInNewWindow = !mobileOverlay && this.isInMobile;

    this.setIFrameRef = this.setIFrameRef.bind(this);
    this.receiveMessage = this.receiveMessage.bind(this);
    this.handleAdaEvent = this.handleAdaEvent.bind(this);
    this.handleIntroShown = this.handleIntroShown.bind(this);
    this.setIFrameLoaded = this.setIFrameLoaded.bind(this);
    this.updateButtonPosition = this.updateButtonPosition.bind(this);
    this.lockDocumentBodyFromScrolling = this.lockDocumentBodyFromScrolling.bind(this);

    this.documentBodyOverflow = window.document.body.style.overflow;
    this.documentBodyPosition = window.document.body.style.position;
    this.documentBodyTop = window.document.body.style.top;
    this.documentBodyBottom = window.document.body.style.bottom;
    this.documentBodyLeft = window.document.body.style.left;
    this.documentBodyRight = window.document.body.style.right;

    const route = "connect";
    this.connectorURL = constructURL(
      { handle, cluster, route, domain },
      false
    );

    this.APIURL = constructURL(this.URLParams, true);
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
    const { client, chatURL } = this.props;

    // Ensure that event origin is the same as the Chat URL
    if (chatURL && !chatURL.startsWith(event.origin)) { return; }

    const {
      liveHandoff,
      zendeskLiveHandoff,
      chatter,
      analytics,
      closeChat,
      chatterIds,
      newMessages,
      created,
      zdSession
    } = event.data;

    const {
      isDrawerOpen,
      liveHandoffCallback,
      chatterTokenCallback,
      analyticsCallback
    } = this.props;

    if (liveHandoff && liveHandoffCallback) {
      liveHandoffCallback(liveHandoff);
    } else if (zendeskLiveHandoff) {
      showZendeskWidget(zendeskLiveHandoff, this.toggleChat);
    } else if (chatter) {
      store(client, CHATTER_TOKEN, chatter);
      this.chatterToken = chatter;

      if (chatterTokenCallback) {
        chatterTokenCallback(chatter);
      }
    } else if (analytics && analyticsCallback) {
      analyticsCallback(analytics);
    } else if (closeChat && isDrawerOpen) {
      this.toggleChat();
    } else if (chatterIds) {
      this.fetchChatterAndSetup(chatterIds);
    } else if (newMessages) {
      this.handleNewMessages(newMessages);
    } else if (zdSession) {
      store(client, CHATTER_ZD_SESSION, zdSession);
      this.chatterZDSession = zdSession;
    }

    if (created) {
      store(client, CHATTER_CREATED, created);
      this.chatterCreated = created;
    }
  }

  /**
   * Fetch chatter token from local/session storage via the connector's postMessage
   * and store the appropriate ID
   */
  fetchChatterAndSetup(chatterIds: string) {
    const {
      client
    } = this.props;
    const persistence = client.persistence === "normal" ? "local" : client.persistence;
    if (chatterIds[persistence]) {
      this.props.setAppState({
        chatter: chatterIds[persistence]
      }, () => this.fetchUnread());
    }
  }

  /**
   * Set the chatURL in state. We only want to update the ChatURL when Embed
   * initially loaded, or when reset. Otherwise, state changes can cause the Chat
   * iFrame to erroneously reload mid lifecycle.
   */
  setChatURL() {
    const {
      /** @type Client */
      client,
      setAppState
    } = this.props;

    const chatterToken = this.chatterToken;
    const chatterCreated = this.chatterCreated;
    const chatterZDSession = this.chatterZDSession;

    const chatURL = constructURL({
      ...this.URLParams,
      chatterToken,
      chatterCreated,
      chatterZDSession,
      followUpResponseId: client.intro && client.intro.response_id
    }, false);

    setAppState({
      chatURL
    });
  }

  get URLParams() {
    const {
      handle,
      domain,
      cluster,
      language,
      greeting,
      metaFields,
      introShown,
      privateMode,
      resetChatHistory
    } = this.props;

    return {
      handle,
      cluster,
      language,
      greeting,
      resetChatHistory,
      domain,
      privateMode,
      introShown,
      metaFields,
      initialURL: window.location.href
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

      this.props.setAppState({
        client: new Client(client)
      }, () => {
        const { rollout, chat: chatIsOn } = client;

        if (!chatIsOn) {
          console.warn("Sorry, please turn on the web chat integration in your bot's settings");
          return;
        }

        // Load Chatter info from storage
        this.chatterToken = retrieve(client, CHATTER_TOKEN);
        this.chatterCreated = retrieve(client, CHATTER_CREATED);
        this.chatterZDSession = retrieve(client, CHATTER_ZD_SESSION);

        // Need to set chatURL after getting client, but before setting shouldLoadEmbedUI
        this.setChatURL();

        // It should be loaded if rollout returns true, or if a parentElement is being used
        const shoudLoadEmbedUI = Boolean(parentElement) || checkRollout(rollout, handle);

        this.props.setAppState({
          shoudLoadEmbedUI
        }, () => {
          // AdaReadyCallback should only get triggered once Client has returned,
          // and once tokens have been retrieved.
          //
          // We need a setTimeout here to "pause" to allow rendering to catch up.
          // This was causing an issue where adaEmbed.reset() could not be called from
          // the adaReadyCallback.
          setTimeout(() => {
            this.triggerAdaReadyCallback();
          }, 0);

          if (shoudLoadEmbedUI) {
            this.initiateMessageListener();

            if (client.intro) {
              setTimeout(() => {
                this.props.setAppState({
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
    const route = `chatters/${this.chatterToken}/notification_status`;
    const url = constructURL(
      Object.assign(this.URLParams, { route }),
      true
    );
    httpRequest({
      url
    }).then((response) => {
      const { drawerHasBeenOpened } = this.props;
      // Set unread amount, connected to connector on chat
      // and open chat if in (active/pending) live state
      this.props.setAppState({
        unreadMessages: response.unread_amount,
        hasConnectedChat: true,
        drawerHasBeenOpened: drawerHasBeenOpened || response.is_live_state
      });
    }, (error) => {
      console.warn(error);
      throw Error("An error occurred while retrieving the client");
    });
  }

  clearChatterInfo() {
    const { client } = this.props;

    this.chatterToken = null;
    this.chatterCreated = null;
    this.chatterZDSession = null;
    // Remove Chatter token and created from storage
    removeStore(client, CHATTER_TOKEN);
    removeStore(client, CHATTER_CREATED);
    removeStore(client, CHATTER_ZD_SESSION);
  }

  /**
   * Event hanlder for custom Ada events
   */
  handleAdaEvent(event: CustomEvent) {
    const {
      chatURL,
      iframeRef,
      isDrawerOpen,
      parentElement,
      isIFrameLoaded,
      drawerHasBeenOpened,
      afterIFrameLoadsTasks
    } = this.props;
    const { detail } = event;
    const { type, data } = detail;
    const eventRequiresIFrame =
      [ADA_EVENT_SET_META_FIELDS, ADA_EVENT_DELETE_HISTORY].indexOf(type) > -1;

    if (eventRequiresIFrame) {
      if (!isIFrameLoaded) {
        afterIFrameLoadsTasks.push(event);

        this.props.setAppState({
          afterIFrameLoadsTasks
        });
      } else {
        switch (type) {
          case ADA_EVENT_SET_META_FIELDS:
            postMessage(iframeRef, data, chatURL);
            return;

          case ADA_EVENT_DELETE_HISTORY:
            // Remove the stored chatter info
            this.clearChatterInfo();
            postMessage(iframeRef, ADA_EVENT_DELETE_HISTORY, chatURL);
            return;
        }
      }
    } else {
      switch (type) {
        case ADA_EVENT_TOGGLE:
          this.toggleChat();
          return;

        case ADA_EVENT_RESET:
          const {
            resetChatHistory = true,
            metaFields = {},
            language = "",
            greeting = ""
          } = data || {};

          // Remove the stored chatter info
          this.clearChatterInfo();

          /**
           * In order to reset Chat we need to remove the IFrame component and re-render it.
           * To do this, we set `forceIFrameReRender` to `false`, then immediately back to `true`.
           * We can simulatenously set new values for language, greeting, and metaFields.
           */
          this.props.setAppState({
            language,
            greeting,
            metaFields,
            resetChatHistory,
            forceIFrameReRender: false
          }, () => {
            // Need to reset the chatURL before we re-open to ensure new query params are set
            this.setChatURL();

            this.props.setAppState({
              forceIFrameReRender: true
            });
          });
          return;

        case ADA_EVENT_GET_INFO:
          const outwardEvent = new CustomEvent(
            "ada-event-outward",
            {
              detail: {
                type: ADA_EVENT_GIVE_INFO,
                data: {
                  isDrawerOpen,
                  hasActiveChatter: Boolean(this.chatterToken),
                  hasClosedChat: drawerHasBeenOpened && !isDrawerOpen,
                  isChatOpen: isDrawerOpen || Boolean(isIFrameLoaded && parentElement)
                }
              },
              bubbles: true,
              cancelable: true
            }
          );
          this.appRef.dispatchEvent(outwardEvent);
          return;
      }
    }
  }

  /**
   * Handles incoming messages from Chat
   */
  handleNewMessages(messages: UnreadMessage) {
    const { unreadMessages } = this.props;

    this.props.setAppState({
      unreadMessages: unreadMessages + messages.amount
    });
  }

  /**
   * Handles clearing unread messages on both Embed and API
   */
  handleClearUnreadMessages() {
    this.props.setAppState({
      unreadMessages: 0
    });

    if (!this.chatterToken) return;
    // Send request to API to clear unread messages
    const route = `chatters/${this.chatterToken}/live_chat_unread_amount`;
    const url = constructURL(
      Object.assign(this.URLParams, { route }),
      true
    );
    httpRequest({
      url,
      method: "DELETE"
    });
  }

  updateButtonPosition(x: number, y: number) {
    this.props.setAppState({
      buttonPosition: { x, y }
    });
  }

  /**
   */
  handleIntroShown() {
    this.props.setAppState({
      introShown: true
    });
  }

  /**
   * Lock the document body from scrolling. If we don't do this,
   * there are SERIOUS issues on iOS.
   */
  lockDocumentBodyFromScrolling(event) {
    const { isDrawerOpen } = this.props;
    const nextIsDrawerOpen = !isDrawerOpen;

    if (!this.isInMobile || nextIsDrawerOpen || event.propertyName !== "transform") {
      return;
    }

    // save current page position so we can scroll back there
    this.pageYOffset = window.pageYOffset;

    window.document.body.style.overflow = "hidden";
    window.document.body.style.position = "fixed";
    window.document.body.style.top = "0";
    window.document.body.style.bottom = "0";
    window.document.body.style.left = "0";
    window.document.body.style.right = "0";
  }

  /**
   * Set back intial values from client document body
   */
  unlockDocumentBodyFromScrolling() {
    window.document.body.style.overflow = this.documentBodyOverflow;
    window.document.body.style.position = this.documentBodyPosition;
    window.document.body.style.top = this.documentBodyTop;
    window.document.body.style.bottom = this.documentBodyBottom;
    window.document.body.style.left = this.documentBodyLeft;
    window.document.body.style.right = this.documentBodyRight;

    // scroll the page back to where it was before chat opened
    window.scrollTo(0, this.pageYOffset);
  }

  /**
   * Open/close the Drawer component, or open a new window if in mobile
   */
  toggleChat() {
    const { isDrawerOpen, iframeRef, chatURL } = this.props;
    const nextIsDrawerOpen = !isDrawerOpen;

    // Clear unread messages
    this.handleClearUnreadMessages();

    // Open Chat in a new window if mobile
    if (this.openChatInNewWindow) {
      window.open(chatURL);

      return;
    }

    // Unlock body from scrolling on mobile
    // locking happens in an event listener in the Drawer component
    if (this.isInMobile) {
      if (!nextIsDrawerOpen) {
        // Unlock body from scrolling
        this.unlockDocumentBodyFromScrolling();
      }
    }

    this.props.setAppState({
      isDrawerOpen: nextIsDrawerOpen,
      drawerHasBeenOpened: true
    }, () => {
      if (iframeRef) {
        if (nextIsDrawerOpen) {
          // To ensure the input bar is always focused in Chat when the drawer is opened
          iframeRef.contentWindow.focus();
          postMessage(iframeRef, ADA_EVENT_FOCUS, chatURL);
        } else {
          postMessage(iframeRef, ADA_EVENT_BLUR, chatURL);

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
    this.props.setAppState({
      iframeRef: ref
    });
  }

  setIFrameLoaded() {
    const { afterIFrameLoadsTasks } = this.props;

    this.props.setAppState({
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
      iframeRef,
      isDrawerOpen,
      introShown
    } = this.props;

    return (
      <IFrame
        {...this.props}
        iframeRef={iframeRef}
        isDrawerOpen={isDrawerOpen}
        setIFrameRef={this.setIFrameRef}
        setIFrameLoaded={this.setIFrameLoaded}
        introShown={introShown}
      />
    );
  }

  /**
   * Standard config render (no parentElement)
   */
  renderStandardConfigElements() {
    const { mobileOverlay, hideMask, dragAndDrop } = this.props;
    const {
      client,
      showIntro,
      iframeRef,
      introShown,
      isDrawerOpen,
      buttonPosition,
      unreadMessages,
      hasConnectedChat,
      drawerHasBeenOpened
    } = this.props;

    return (
      <div>
        {/* Do not render Drawer if Chat will be opened in new window */}
        {!this.openChatInNewWindow && (
          <Drawer
            {...this.props}
            hideMask={hideMask}
            iframeRef={iframeRef}
            introShown={introShown}
            isDrawerOpen={isDrawerOpen}
            toggleChat={this.toggleChat}
            setIFrameRef={this.setIFrameRef}
            setIFrameLoaded={this.setIFrameLoaded}
            drawerHasBeenOpened={drawerHasBeenOpened}
            useMobileOverlay={mobileOverlay && this.isInMobile}
            transitionEndHandler={this.lockDocumentBodyFromScrolling}
          />
        )}
        <Draggability
          x={buttonPosition.x}
          y={buttonPosition.y}
          updatePosition={this.updateButtonPosition}
          isDraggable={dragAndDrop}
        >
          {showIntro && client.intro.style.toLowerCase() === "text" && !drawerHasBeenOpened && (
            <IntroBlurb
              client={client}
              toggleChat={this.toggleChat}
              isInMobile={this.isInMobile}
              isDraggable={dragAndDrop}
              onShow={this.handleIntroShown}
            />
          )}
          {(!isDrawerOpen || dragAndDrop) && (
            <Button
              client={client}
              toggleChat={this.toggleChat}
              showIntroEmoji={
                showIntro &&
                client.intro.style.toLowerCase() === "emoji" &&
                !drawerHasBeenOpened
              }
              showNotification={unreadMessages > 0}
              isDraggable={dragAndDrop}
            />
          )}
        </Draggability>
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
      shoudLoadEmbedUI,
      forceIFrameReRender
    } = this.props;

    if (!shoudLoadEmbedUI || !forceIFrameReRender) {
      return null;
    }

    if (parentElement) {
      return this.renderIFrameForParentElement();
    }

    return this.renderStandardConfigElements();
  }

  render() {
    const { parentElement } = this.props;

    return (
      <div
        id="ada-embed"
        className={classnames("ada-embed-app",
          {
            "ada-embed-app--inside-parent": parentElement
          }
        )}
        ref={elem => this.appRef = elem}
      >
        {this.elementToRender}
      </div>
    );
  }
}
