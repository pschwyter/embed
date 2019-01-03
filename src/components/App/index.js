import { Component } from "preact";
import Drawer from "./Drawer";
import Button from "./Button";
import "./style.scss";

export default class App extends Component {
  /**
   * @param {Object} props
   */
  constructor(props) {
    super(props);

    this.state = {
      isDrawerOpen: false
    };

    this.toggleDrawer = this.toggleDrawer.bind(this);
  }

  /**
   * Open/close the Drawer component
   */
  toggleDrawer() {
    const { isDrawerOpen } = this.state;
    const nextIsDrawerOpen = !isDrawerOpen;

    this.setState({
      isDrawerOpen: nextIsDrawerOpen
    });
  }

  /**
   * @param {Object} props
   * @returns {ReactElement}
   */
  render(props) {
    const { handle } = props;
    const { isDrawerOpen } = this.state;

    return (
      <div>
        <Drawer
          handle={handle}
          isDrawerOpen={isDrawerOpen}
          toggleDrawer={this.toggleDrawer}
        />
        <Button
          toggleDrawer={this.toggleDrawer}
        />
      </div>
    );
  }
}
