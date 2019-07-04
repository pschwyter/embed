import {
  DEFAULT_BUTTON_POSITION
} from "constants/configuration";
import App from "./App";
import { Component, h } from "preact";
import Client from "models/Client";
import { InterfaceStartOptions as InterfaceAppWrapper } from "src/index";

export interface InterfaceState extends InterfaceAppWrapper {
  // The Client record
  client: Client,

  // The src for the Chat iFrame
  chatURL: string,

  // Render IntroBlurb when true
  showIntro: boolean,

  // Indicates whether intro has been shown (for web interactions analytics)
  introShown: boolean,

  // Programtically puts Chat into private mode
  privateMode?: boolean,

  // Open / close the Chat Drawer
  isDrawerOpen: boolean,

  // Number of unread Chat messages
  unreadMessages: number,

  // Set to true once iFramed onload event triggered
  isIFrameLoaded: boolean,

  // It should be loaded if rollout returns true, or if a parentElement is being used
  shoudLoadEmbedUI: boolean,

  // Indicates if iFrame has been reset
  resetChatHistory: boolean,

  // Set to true if fetchUnread request is successful
  hasConnectedChat: boolean,

  // The Chat iFrame ref
  iframeRef: HTMLIFrameElement,

  // Used to force the Chat iFrame (and Drawer) to re-render when Reset action called
  forceIFrameReRender: boolean,

  // Set to true if Drawer has been opened at least once
  drawerHasBeenOpened: boolean,

  // This is a task queue to be executed once the iFrame has been loaded
  afterIFrameLoadsTasks: CustomEvent[],

  // The button position for drag and drop
  buttonPosition: { x: number, y: number }
}

/**
 * Some properties such as handle, styles, metaFields, etc., are added using Preact's
 * `createElement`. (This is similar to React's `createElement` method documented here:
 * https://reactjs.org/docs/react-api.html#createelement).
 * As such, we are unable to change them using setState. To ensure all state can be changed,
 * input props and state are normalized within the AppWrapper component, and passed to App.
 * InterfaceState for AppWrapper is an exact match of InterfaceApp.
 */
export default class AppWrapper extends Component<InterfaceAppWrapper, InterfaceState> {
  static defaultProps = {
    mobileOverlay: true
  };

  constructor(props: InterfaceAppWrapper) {
    super(props);

    // Rename private to privateMode
    const {  private: privateMode } = props;

    this.state = {
      ...props,
      privateMode,
      client: null,
      chatURL: null,
      iframeRef: null,
      showIntro: false,
      unreadMessages: 0,
      introShown: false,
      isDrawerOpen: false,
      isIFrameLoaded: false,
      resetChatHistory: false,
      hasConnectedChat: false,
      shoudLoadEmbedUI: false,
      afterIFrameLoadsTasks: [],
      forceIFrameReRender: true,
      drawerHasBeenOpened: false,
      buttonPosition: DEFAULT_BUTTON_POSITION
    };

    this.setAppState = this.setAppState.bind(this);
  }

  setAppState(hash: object, callback?: () => void) {
    this.setState(hash, callback);
  }

  render() {
    return <App setAppState={this.setAppState} {...this.state} />;
  }
}
