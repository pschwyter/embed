/* eslint-env node, jest */

import "jsdom-global/register";
import { shallow } from "preact-render-spy";
import App from "./index";
import IFrame from "./IFrame";

function setup(propsOverride = {}) {
  const defaultsProps = {
    handle: "nic"
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

  it("should set shoudLoadEmbedUI to true if checkRollout returns true, and there is no parentElement", done => {
    const { PRSWrapper } = setup();

    setTimeout(() => {
      expect(PRSWrapper.state().shoudLoadEmbedUI).toBeTruthy();
      done();
    }, 0);
  });

  it("should no longer render connector iframe if hasConnectedChat is true", done => {
    const { PRSWrapper } = setup();
    PRSWrapper.setState({
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
      parentElement: dummyElement
    });

    setTimeout(() => {
      expect(PRSWrapper.find(<IFrame />).length).toBeTruthy();
      done();
    }, 0);
  });
});
