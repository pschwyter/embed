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
      }
    },
    toggleChat: jest.fn()
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

  it("should have a tabIndex of 0 and aria-live assertive on the blurb message", () => {
    const { PRSWrapper, props } = setup();
    const messageElement = PRSWrapper.find(".ada-chaperone-intro-blurb__message");

    expect(messageElement.attr("tabIndex")).toEqual(0);
    expect(messageElement.attr("aria-live")).toEqual("assertive");
  });

  it("should open chat when clicking the blurb message", () => {
    const { PRSWrapper, props } = setup();
    const messageElement = PRSWrapper.find(".ada-chaperone-intro-blurb__message");

    messageElement.simulate("click");
    expect(props.toggleChat.mock.calls.length).toBe(1);
  });
});
