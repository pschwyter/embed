import habitat from "preact-habitat";
import Widget from "./components/App";

// Import global styles
import "./style/application.scss";

let _habitat = habitat(Widget);

_habitat.render({
  selector: '[data-widget-host="habitat"]',
  clean: true
});
