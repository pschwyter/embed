import { Component } from "preact";
import "./style.scss";

export default class Drawer extends Component {
  render(props) {
    const { handle } = props;

    return (
      <iframe class="ADA-CHAPERONE-Drawer" src={`https://${handle}.ada.support/chat/`} />
    );
  }
}
