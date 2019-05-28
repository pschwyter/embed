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
      },
      chatButton: {
        size: 72,
        icon_path: "https://static.ada.support/images/286ca5d2-5311-467a-a5f5-5051ad710db4.svg",
        icon_type: "default",
        background_color: "#3ED1FF"
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

  it("it should have the background colour set to the chatButton backgroundColor", () => {
    const { PRSWrapper } = setup();

    expect(PRSWrapper.find(".ada-embed-button").attr("style")["backgroundColor"]).toEqual("#3ED1FF");
  });

  it("should have an accessKey of 1", () => {
    const { PRSWrapper } = setup();

    expect(PRSWrapper.find(".ada-embed-button").attr("accessKey")).toEqual("1");
  });

  it("should show the notification icon when showNotification is set to true", () => {
    const { PRSWrapper } = setup({
      showNotification: true
    });

    expect(PRSWrapper.find(".ada-embed-notification").length).toBe(1);
  });

  it("should not have class properties if isDraggable is true", () => {
    const { PRSWrapper } = setup({isDraggable: true});

    expect(PRSWrapper.find(".ada-embed-button-container--not-draggable").length).toBe(0);
  });
});
