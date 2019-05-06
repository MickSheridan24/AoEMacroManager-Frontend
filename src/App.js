import React, { Component } from "react";
import { Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import UnitList from "./containers/UnitList";
import BuildMenu from "./containers/BuildMenu";
import BuildSummary from "./containers/BuildSummary";

import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      allUnits: [],
      buildCounter: 0,
      builds: [{ name: "", description: "", units: [] }],
      currentBuild: 0,
    };
  }
  componentDidMount() {
    this.initialRequests();
  }

  setImage = unit => {
    let string = unit.name.toLowerCase();
    string = string.replace(/ /g, "_");
    let ret = "";
    try {
      ret = require(`./icons/${string}.png`);
    } catch (error) {
      if (unit.unit_type === "Technology") {
        ret = require("./icons/unique_tech_1.png");
      }
    }
    unit.image = ret;
  };
  initialRequests = async () => {
    await this.fetchUnits();
    await this.fetchBuilds();
  };
  fetchUnits = async () => {
    const resp = await fetch("http://localhost:3000/units");
    const units = await resp.json();
    units.forEach(unit => {
      this.setImage(unit);
    });
    this.setState({ allUnits: units });
  };
  fetchBuilds = async () => {
    const resp = await fetch("http://localhost:3000/builds");
    const builds = await resp.json();
    this.setState({ builds: builds }, () => console.log(this.state));
  };
  fetchBuild = async id => {
    const req = await fetch(`http://localhost:3000/builds/${id}`);
    const build = await req.json();
    const index = this.state.builds.indexOf(this.state.builds.find(b => b.id === id));
    const builds = [...this.state.builds];
    builds[index] = build;
    this.setState({ builds: [...builds] });
  };

  //Needs to be brought to date
  reorderBuild = (unit, unitIndex, targetIndex) => {
    let newOrder = [...this.state.build];
    newOrder.splice(targetIndex + 1, 0, unit);
    if (targetIndex >= unitIndex) {
      newOrder.splice(unitIndex, 1);
    } else {
      newOrder.splice(unitIndex + 1, 1);
    }
    this.setState({ build: newOrder });
  };

  //Needs to be brought to date
  addUnit = async u => {
    let unit = { ...u };
    const unitId = unit.id;
    const buildId = this.state.builds[this.state.currentBuild].id;

    const req = await fetch("http://localhost:3000/build_units", {
      method: "POST",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify({ unit_id: unitId, build_id: buildId }),
    });
    const newEntry = await req.json();
    console.log(newEntry);
    this.fetchBuild(buildId);
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
                  <Route exact path="/menu/:listType" render={rProps => <UnitList handleAddUnit={this.addUnit} units={this.state.allUnits} {...rProps} />} />
                  <Route exact path="/builds" render={() => <BuildMenu />} />
                </div>
              </div>

              <BuildSummary reorder={this.reorderBuild} build={this.state.builds[this.state.currentBuild].units} />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
