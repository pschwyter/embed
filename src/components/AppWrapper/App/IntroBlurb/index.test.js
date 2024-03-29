/* eslint-env node, jest */

import "jsdom-global/register";
import { shallow } from "preact-render-spy";
import IntroBlurb from "./index";

function setup(propsOverride = {}) {
  const defaultsProps = {
    client: {
      tint: "#000",
      intro: {
        duration: 1000,
        delay: 1000
      },
      chatButton: {
        size: 72,
        icon_path: "https://static.ada.support/images/286ca5d2-5311-467a-a5f5-5051ad710db4.svg",
        icon_type: "default",
        background_color: "#3ED1FF"
      }
    },
    toggleChat: jest.fn(),
    onShow: jest.fn()
  };

  const props = Object.assign(defaultsProps, propsOverride);
  const PRSWrapper = shallow(<IntroBlurb {...props} />);

  return {
    props,
    PRSWrapper
  };
}

describe("<IntroBlurb />", () => {
  it("should match snapshot", done => {
    const { PRSWrapper } = setup();

    setTimeout(() => {
      expect(PRSWrapper).toMatchSnapshot();
      done();
    }, 0);
  });

  it("should have a tabIndex of -1 if the blurb dismiss button is not visible", () => {
    const { PRSWrapper } = setup();
    PRSWrapper.setState({animateIntroOut: true})
    const messageElement = PRSWrapper.find(".ada-embed-intro-blurb__dismiss-button");

    expect(messageElement.attr("tabIndex")).toEqual(-1);
  });

  it("should have role alert and aria-live assertive on the blurb message", () => {
    const { PRSWrapper } = setup();
    const messageElement = PRSWrapper.find(".ada-embed-intro-blurb__message");

    expect(messageElement.attr("role")).toEqual("alert");
    expect(messageElement.attr("aria-live")).toEqual("assertive");
  })

  it("should open chat when clicking the blurb message", () => {
    const { PRSWrapper, props } = setup();
    const messageElement = PRSWrapper.find(".ada-embed-intro-blurb__message");

    messageElement.simulate("click");
    expect(props.toggleChat.mock.calls.length).toBe(1);
  });

  it("should not have class properties if isDraggable is true", () => {
    const { PRSWrapper } = setup({isDraggable: true, dragPosition: {x: 10, y: 10}});

    expect(PRSWrapper.find(".ada-embed-intro-blurb--not-draggablee").length).toBe(0);
  });

  it("when draggable custom styling should change right and bottom properties", () => {
    const { PRSWrapper } = setup({isDraggable: true, dragPosition: {x: 10, y: 10}});

    expect(PRSWrapper.find(".ada-embed-intro-blurb").attr("style")).toEqual({"bottom": 10, "right": 90});
  });
});
