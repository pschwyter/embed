/* eslint-env node, jest */

import "jsdom-global/register";
import { shallow } from "preact-render-spy";
import IFrame from "./index";

function setup(propsOverride = {}) {
  const defaultsProps = {
    client: {
      tint: "#000"
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
