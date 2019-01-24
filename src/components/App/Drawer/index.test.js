/* eslint-env node, jest */

import "jsdom-global/register";
import { shallow } from "preact-render-spy";
import Drawer from "./index";

function setup(propsOverride = {}) {
  const defaultsProps = {
    client: {
      tint: "#000"
    },
    handle: "nic",
    isDrawerOpen: true,
    chatURL: "https://nic.ca.ada.support/chat/",
    useMobileOverlay: true,
    drawerHasBeenOpened: true,
    openChat: jest.fn(),
    setIFrameRef: jest.fn()
  };

  const props = Object.assign(defaultsProps, propsOverride);
  const PRSWrapper = shallow(<Drawer {...props} />);

  return {
    props,
    PRSWrapper
  };
}

describe("<Drawer />", () => {
  it("should match snapshot", () => {
    const { PRSWrapper } = setup();

    expect(PRSWrapper).toMatchSnapshot();
  });

  it("should hide the drawer when isDrawerOpen is set to false", () => {
    const { PRSWrapper } = setup({
      isDrawerOpen: false
    });

    expect(PRSWrapper.find(".ada-chaperone-drawer--hidden").length).toBe(1);
  });

  it("should use special styling when useMobileOverlay is true", () => {
    const { PRSWrapper } = setup({
      useMobileOverlay: true
    });

    expect(PRSWrapper.find(".ada-chaperone-drawer--mobile-overlay").length).toBe(1);
  });
});
