/* eslint-env node, jest */

import "jsdom-global/register";
import { shallow } from "preact-render-spy";
import App from "./index";
import IFrame from "./IFrame";

function setup(propsOverride = {}) {
  const defaultsProps = {
    handle: "nic",
    setAppState: jest.fn()
  };

  const props = Object.assign(defaultsProps, propsOverride);
  const PRSWrapper = shallow(<App {...props} />);

  return {
    props,
    PRSWrapper
  };
}

jest.mock("services/httpRequest");

describe("<App />", () => {
  it("should match snapshot", done => {
    const { PRSWrapper } = setup();

    // We need to wrap in setTimeout and use 'done' because setState is operated asynchronously with preact-render-spy
    setTimeout(() => {
      expect(PRSWrapper).toMatchSnapshot();
      done();
    }, 0);
  });

  it("should no longer render connector iframe if hasConnectedChat is true", done => {
    const { PRSWrapper } = setup({
      hasConnectedChat: true
    });

    setTimeout(() => {
      expect(PRSWrapper.find(".ada-connector-iframe").length).toBe(0);
      done();
    }, 0);
  });

  it("should position the iFrame inside parentElement if specified", done => {
    let dummyElement = document.createElement("div");

    const { PRSWrapper } = setup({
      parentElement: dummyElement,
      shoudLoadEmbedUI: true,
      forceIFrameReRender: true
    });

    setTimeout(() => {
      expect(PRSWrapper.find(<IFrame />).length).toBeTruthy();
      done();
    }, 0);
  });

  it("should apply a class of 'ada-embed-app--inside-parent' when a parentElement is specified", done => {
    const { PRSWrapper } = setup({
      parentElement: "parent-element"
    });

    setTimeout(() => {
      expect(PRSWrapper.find(".ada-embed-app--inside-parent").length).toBe(1);
      done();
    }, 0);
  });

  it("should not have the class 'ada-embed-app--inside-parent' when no parentElement specified", done => {
    const { PRSWrapper } = setup();

    setTimeout(() => {
      expect(PRSWrapper.find(".ada-embed-app--inside-parent").length).toBe(0);
      done();
    }, 0);
  });
});
