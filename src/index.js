import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store";
import { initializeIcons } from "@uifabric/icons";
import { Fabric } from "office-ui-fabric-react/lib/Fabric";

initializeIcons();

ReactDOM.render(
  <Provider store={store}>
    <Fabric>
      <App />
    </Fabric>
  </Provider>,
  document.getElementById("root")
);
