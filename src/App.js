import React, { Component } from "react";
import { Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import UnitList from "./containers/UnitList";
import ProductionList from "./containers/ProductionList";
import BuildMenu from "./containers/BuildMenu";
import BuildSummary from "./containers/BuildSummary";

import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      allUnits: [],
      build: [],
    };
  }
  componentDidMount() {
    this.fetchUnits();
  }

  fetchUnits = async () => {
    const resp = await fetch("http://localhost:3000/units");
    const units = await resp.json();
    this.setState({ allUnits: units });
  };

  render() {
    return (
      <React.Fragment>
        <h2 className="ui header" style={{ margin: "0.5em" }}>
          <div className="content">Empires Macro-Manager</div>
        </h2>
        <div className="ui segment" style={{ margin: "0.5em", minHeight: "80vh" }}>
          <div className="ui grid">
            <div className="row" style={{ padding: "0em" }}>
              <NavBar />
            </div>
            <div className="row" style={{ padding: "0em" }}>
              <div className="column" style={{ flex: 4 }}>
                <div className="ui segment" style={{ border: "0px solid red", boxShadow: "none", margin: "0.5em" }}>
                  <Route exact path="/menu/:listType" render={rProps => <UnitList units={this.state.allUnits} {...rProps} />} />
                  <Route exact path="/builds" render={() => <BuildMenu />} />
                </div>
              </div>

              <BuildSummary build={this.state.build} />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
