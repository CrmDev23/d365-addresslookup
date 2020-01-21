import React, { Component } from "react";
import MealsShowcase from "./components/MealsContainer";
import { Fabric } from "office-ui-fabric-react/lib/Fabric";

class App extends Component {
  render() {
    return (
      <Fabric>
        <MealsShowcase />
      </Fabric>
    );
  }
}

export default App;
