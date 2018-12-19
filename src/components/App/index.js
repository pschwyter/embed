import { h, Component } from "preact";
import Drawer from "./Drawer";
import Button from "./Button";
import "./style.scss";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDrawerOpen: false
    }
  }

  render(props) {
    const { handle } = props;

    return (
      <div>
        <Drawer handle={handle} />
        <Button />
      </div>
    );
  }
}
