import React, { Component, Fragment } from "react";
import "./App.css";
import MealsShowcase from "./components/MealsContainer";

class App extends Component {
  render() {
    return (
      <Fragment>
        <MealsShowcase />
        <MealsShowcase />
      </Fragment>
    );
  }
}

export default App;
