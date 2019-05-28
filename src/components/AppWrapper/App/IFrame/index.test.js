/* eslint-env node, jest */

import "jsdom-global/register";
import { shallow } from "preact-render-spy";
import IFrame from "./index";

function setup(propsOverride = {}) {
  const defaultsProps = {
    client: {
      tint: "#000"
    },
    chatButton: {
      size: 72,
      icon_path: "https://static.ada.support/images/286ca5d2-5311-467a-a5f5-5051ad710db4.svg",
      icon_type: "default",
      background_color: "#3ED1FF"
    },
    handle: "nic",
    chatURL: "https://nic.ca.ada.support/chat/",
    setIFrameRef: jest.fn()
  };

  const props = Object.assign(defaultsProps, propsOverride);
  const PRSWrapper = shallow(<IFrame {...props} />);

  return {
    props,
    PRSWrapper
  };
}

describe("<IFrame />", () => {
  it("should match snapshot", () => {
    const { PRSWrapper } = setup();

    expect(PRSWrapper).toMatchSnapshot();
  });
});
