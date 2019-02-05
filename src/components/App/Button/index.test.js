/* eslint-env node, jest */

import "jsdom-global/register";
import { shallow } from "preact-render-spy";
import Button from "./index";

function setup(propsOverride = {}) {
  const defaultsProps = {
    client: {
      tint: "#000",
      intro: {
        body: "http://test.com/yolo.svg"
      }
    }
  };

  const props = Object.assign(defaultsProps, propsOverride);
  const PRSWrapper = shallow(<Button {...props} />);

  return {
    props,
    PRSWrapper
  };
}

describe("<Button />", () => {
  it("should match snapshot", () => {
    const { PRSWrapper } = setup();
    expect(PRSWrapper).toMatchSnapshot();
  });

  it("should show the intro emoji, as well as hide the default icon, when showIntroEmoji is set to true", () => {
    const { PRSWrapper } = setup({
      showIntroEmoji: true
    });

    expect(PRSWrapper.find(".ada-embed-button__emoji").length).toBe(1);
    expect(PRSWrapper.find(".ada-embed-button__icon--hide").length).toBe(1);
  });

  it("it should have the background colour set to the client tint colour", () => {
    const { PRSWrapper } = setup();

    expect(PRSWrapper.find(".ada-embed-button").attr("style")).toEqual({"backgroundColor": "#000"});
  });

  it("should have an accessKey of 1", () => {
    const { PRSWrapper } = setup();

    expect(PRSWrapper.find(".ada-embed-button").attr("accessKey")).toEqual("1");
  });
});
