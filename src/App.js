import React, { Component } from "react";
import { Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import UnitList from "./containers/UnitList";
import BuildMenu from "./containers/BuildMenu";
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

  getCurrentBuild() {
    return this.state.builds[this.state.currentBuild];
  }
  setCurrentBuild(id) {
    this.setState({ currentBuild: this.state.builds.indexOf(this.state.builds.find(b => b.id === id)) });
  }

  setImage = unit => {
    let str = unit.name.toLowerCase();
    str = str.replace(/ /g, "_");
    let ret = "";
    try {
      ret = require(`./icons/${str}.png`);
    } catch (error) {
      if (unit.unit_type === "Technology") {
        ret = require("./icons/unique_tech_1.png");
      }
    }
    unit.image = ret;
  };
  initialRequests = async () => {
    console.trace("initialRequests() called");
    await this.fetchUnits();
    await this.fetchBuilds();
  };
  fetchUnits = async () => {
    // console.trace("fetchUnits() called");
    const resp = await fetch("http://localhost:3000/units");
    const units = await resp.json();
    units.forEach(unit => {
      this.setImage(unit);
    });
    this.setState({ allUnits: units });
  };
  fetchBuilds = async () => {
    // console.trace("fetchBuilds() called");
    const resp = await fetch("http://localhost:3000/builds");
    const builds = await resp.json();
    this.setState({ builds: builds });
  };
  fetchBuild = async id => {
    // console.trace("fetchBuild() called");
    const req = await fetch(`http://localhost:3000/builds/${id}`);
    const build = await req.json();
    const index = this.state.builds.indexOf(this.state.builds.find(b => b.id === id));
    const builds = [...this.state.builds];
    builds[index] = build;
    this.setState({ builds: [...builds] });
  };

  reorderBuild = async (unit, unitIndex, targetIndex) => {
    // console.trace("reorderBuild() called");
    const req = await fetch(`http://localhost:3000/builds/rearrange/${this.getCurrentBuild().id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ unitIndex: unitIndex, targetIndex: targetIndex }),
    });
    await req.json();
    this.fetchBuild(this.getCurrentBuild().id);
  };

  newBuild = async (name, description) => {
    const req = await fetch("http://localhost:3000/builds", {
      method: "POST",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify({ name: name, description: description }),
    });
    const resp = await req.json();
    if (resp) {
      await this.fetchBuilds();
      this.setCurrentBuild(resp.id);
    }
  };

  addUnit = async u => {
    // console.trace("addUnit() called");
    let unit = { ...u };
    const unitId = unit.id;
    const buildId = this.getCurrentBuild().id;

    const req = await fetch("http://localhost:3000/build_units", {
      method: "POST",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify({ unit_id: unitId, build_id: buildId }),
    });
    await req.json();
    this.fetchBuild(buildId);
  };

  handleSelectBuild = e => {
    e.preventDefault();
    const build = this.state.builds.find(b => b.id === parseInt(e.target.value));

    this.setState({ currentBuild: this.state.builds.indexOf(build) });
  };

  render() {
    return (
      <div style={{ maxHeight: "100vh" }}>
        <h2 className="ui header" style={{ margin: "0.5em" }}>
          <div className="content">Empires Macro-Manager</div>
        </h2>
        <div className="ui segment" style={{ margin: "0.5em", minHeight: "80%" }}>
          <div className="ui grid">
            <div className="row" style={{ padding: "0em" }}>
              <NavBar />
            </div>
            <div className="row" style={{ padding: "0em" }}>
              <Route
                exact
                path="/menu/:listType"
                render={rProps => (
                  <UnitList
                    reorder={this.reorderBuild}
                    build={this.getCurrentBuild().units}
                    handleAddUnit={this.addUnit}
                    units={this.state.allUnits}
                    {...rProps}
                  />
                )}
              />
              <Route
                exact
                path="/builds"
                render={() => (
                  <BuildMenu
                    handleSelectBuild={this.handleSelectBuild}
                    newBuild={this.newBuild}
                    current={this.state.currentBuild}
                    builds={this.state.builds}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
