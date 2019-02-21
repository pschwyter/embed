/* eslint-env node, jest */

import "jsdom-global/register";
import { shallow } from "preact-render-spy";
import Drawer from "./index";

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

  it("should hide the mask when 'hideMask' is true", () => {
    const { PRSWrapper: PRSWrapperMask } = setup({
      hideMask: false
    });

    const { PRSWrapper: PRSWrapperNoMask } = setup({
      hideMask: true
    });

    expect(PRSWrapperMask.find(".ada-embed-drawer__mask").length).toBe(1);
    expect(PRSWrapperNoMask.find(".ada-embed-drawer__mask").length).toBe(0);
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
