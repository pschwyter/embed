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
    toggleChat: jest.fn(),
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

    expect(PRSWrapper.find(".ada-embed-drawer--hidden").length).toBe(1);
  });

  it("should use special styling when useMobileOverlay is true", () => {
    const { PRSWrapper } = setup({
      useMobileOverlay: true
    });

    expect(PRSWrapper.find(".ada-embed-drawer--mobile-overlay").length).toBe(1);
  });

  describe("iFrame container", () => {
    it("should show aria-modal `true` when drawer is opened, and ara-hidden should be `false`", () => {
      const { PRSWrapper } = setup({
        isDrawerOpen: true
      });
  
      expect(PRSWrapper.find(".ada-embed-drawer__iframe-container").attr("aria-modal")).toBeTruthy();
      expect(PRSWrapper.find(".ada-embed-drawer__iframe-container").attr("aria-hidden")).toBeFalsy();
    });
  
    it("should show aria-modal `false` when drawer is closed, and aria-hidden should be `true`", () => {
      const { PRSWrapper } = setup({
        isDrawerOpen: false
      });
  
      expect(PRSWrapper.find(".ada-embed-drawer__iframe-container").attr("aria-modal")).toBeFalsy();
      expect(PRSWrapper.find(".ada-embed-drawer__iframe-container").attr("aria-hidden")).toBeTruthy();
    });
  
    it("should have a role of dialog", () => {
      const { PRSWrapper } = setup();
  
      expect(PRSWrapper.find(".ada-embed-drawer__iframe-container").attr("role")).toBe("dialog");
    });
  });

  describe("iFrame container", () => {
    it("should show aria-modal `true` when drawer is opened, and ara-hidden should be `false`", () => {
      const { PRSWrapper } = setup({
        isDrawerOpen: true
      });
  
      expect(PRSWrapper.find(".ada-embed-drawer__iframe-container").attr("aria-modal")).toBeTruthy();
      expect(PRSWrapper.find(".ada-embed-drawer__iframe-container").attr("aria-hidden")).toBeFalsy();
    });
  
    it("should show aria-modal `false` when drawer is closed, and aria-hidden should be `true`", () => {
      const { PRSWrapper } = setup({
        isDrawerOpen: false
      });
  
      expect(PRSWrapper.find(".ada-embed-drawer__iframe-container").attr("aria-modal")).toBeFalsy();
      expect(PRSWrapper.find(".ada-embed-drawer__iframe-container").attr("aria-hidden")).toBeTruthy();
    });
  
    it("should have a role of dialog", () => {
      const { PRSWrapper } = setup();
  
      expect(PRSWrapper.find(".ada-embed-drawer__iframe-container").attr("role")).toBe("dialog");
    });
  });
});
