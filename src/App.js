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
      builds: [{ id: 0, name: "", description: "", units: [] }],
      currentBuild: 0,
    };
  }
  componentDidMount() {
    this.initialRequests();
  }

  getCurrentBuild() {
    return this.state.builds.find(b => b.id === this.state.currentBuild);
  }
  setCurrentBuild(id) {
    this.setState({ currentBuild: id });
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
    console.log("initialRequests() called");
    await this.fetchUnits();
    await this.fetchBuilds();
  };
  fetchUnits = async () => {
    // console.trace("fetchUnits() called");
    const resp = await fetch("http://localhost:3000/units");
    const units = await resp.json();
    this.setState({ allUnits: units });
  };
  fetchBuilds = async () => {
    // console.trace("fetchBuilds() called");
    const resp = await fetch("http://localhost:3000/builds");
    const builds = await resp.json();
    this.setState({ builds: builds, currentBuild: builds[0].id });
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

  //TODO response should replace second fetch call
  reorderBuild = async (unitIndex, targetIndex) => {
    const req = await fetch(`http://localhost:3000/builds/rearrange/${this.state.currentBuild}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ unitIndex: unitIndex, targetIndex: targetIndex }),
    });
    const build = await req.json();
    const buildIndex = this.state.builds.indexOf(this.getCurrentBuild());
    const builds = [...this.state.builds];
    builds[buildIndex] = build;
    this.setState({ builds: builds });
  };

  newBuild = async (name, description) => {
    const req = await fetch("http://localhost:3000/builds", {
      method: "POST",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify({ name: name, description: description }),
    });
    const resp = await req.json();
    this.setState({ builds: [...this.state.builds, resp], currentBuild: parseInt(resp.id) });
  };

  addUnit = async u => {
    let unit = { ...u };
    const unitId = unit.id;

    const req = await fetch("http://localhost:3000/build_units", {
      method: "POST",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify({ unit_id: unitId, build_id: this.state.currentBuild }),
    });
    const newUnit = await req.json();
    const buildIndex = this.state.builds.indexOf(this.getCurrentBuild());
    const builds = [...this.state.builds];
    builds[buildIndex].units.push(newUnit);
    this.setState({ builds: builds });
  };

  setDescription = async (e, step) => {
    const descr = e.target.elements.description.value;

    const res = await fetch(`http://localhost:3000/build_units/${step.build_key}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...step, description: descr }),
    });
    const newStep = await res.json();
    console.log(newStep);
    const steps = this.getCurrentBuild().units;
    const ind = steps.indexOf(step);
    steps[ind] = newStep;
    const build = { ...this.getCurrentBuild() };
    build.units = steps;
    const builds = [...this.state.builds];
    builds[this.state.currentBuild] = build;
    this.setState({ builds: builds });
  };

  deleteStep = async id => {
    const req = await fetch(`http://localhost:3000/build_units/${id}`, {
      method: "DELETE",
    });
    const resp = await req.json();
    this.fetchBuild(resp.build_id);
  };

  handleSelectBuild = e => {
    e.preventDefault();
    const build = this.state.builds.find(b => b.id === parseInt(e.target.value));

    this.setState({ currentBuild: build.id });
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
                    deleteStep={this.deleteStep}
                    reorder={this.reorderBuild}
                    handleSelectBuild={this.handleSelectBuild}
                    setDescription={this.setDescription}
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
