import classnames from "classnames";
import Client from "models/Client";
import { Component, h } from "preact";
import "./style.scss";

interface InterfaceIntroBlurb {
  client: Client,
  isInMobile: boolean,
  openChat(): void
}

interface InterfaceState {
  animateIntroIn: boolean,
  animateIntroOut: boolean
}

export default class IntroBlurb extends Component<InterfaceIntroBlurb, InterfaceState> {
  constructor(props: InterfaceIntroBlurb) {
    super(props);

    this.state = {
      animateIntroIn: false,
      animateIntroOut: false
    };

    this.dismissIntro = this.dismissIntro.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleOpenChat = this.handleOpenChat.bind(this);
  }

  componentDidMount() {
    const { client } = this.props;

    this.setState({
      animateIntroIn: true
    });

    setTimeout(() => {
      this.dismissIntro();
    }, (client.intro.duration + client.intro.delay) * 1000);
  }

  /**
   * Set animateIntroOut state to trigger animation
   */
  dismissIntro() {
    this.setState({
      animateIntroOut: true
    });
  }

  /**
   * Open chat and dismiss the intro
   */
  handleOpenChat() {
    const { openChat } = this.props;

    this.dismissIntro();
    openChat();
  }

  /**
   * Key press event handler
   */
  handleKeyPress(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      this.handleOpenChat();
    }
  }

  render(props: InterfaceIntroBlurb) {
    const { client, isInMobile } = props;
    const { animateIntroIn, animateIntroOut } = this.state;

    return (
      <div
        className={
          classnames(
            "ada-chaperone-intro-blurb",
            {
              "ada-chaperone-intro-blurb--hide": animateIntroOut,
              "ada-chaperone-intro-blurb--show": animateIntroIn
            }
          )
        }
      >
        <p
          className="ada-chaperone-intro-blurb__message"
          aria-live="assertive"
          role="alert"
          onClick={this.handleOpenChat}
          onKeyPress={this.handleKeyPress}
          tabIndex={0}
        >
          {client.intro.body}
        </p>
        <button
          className={classnames(
            "ada-chaperone-intro-blurb__dismiss-button", {
              "ada-chaperone-intro-blurb__dismiss-button--mobile-show": isInMobile
            }
          )}
          title="Dismiss Intro"
          onClick={this.dismissIntro}
        />
      </div>
    );
  }
}
