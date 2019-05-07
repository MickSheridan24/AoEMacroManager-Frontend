import React, { Component } from "react";
import UnitCard from "../components/UnitCard";
import UnitModal from "../components/UnitModal";
import UnitForm from "../components/UnitForm";
import BuildSummary from "./BuildSummary";

export default class UnitList extends Component {
  constructor() {
    super();
    this.state = {
      currentUnit: null,
      filters: { name: "", dark: true, feudal: true, castle: true, imperial: true },
      sort: this.sortAge,
    };
  }
  componentWillUnmount() {
    console.log("list dismounting");
  }

  getUnitsByType = type => {
    const resources = {
      military: this.getMilitary(),
      production: this.getProduction(),
      technologies: this.getTechnologies(),
    };
    return resources[type];
  };
  getMilitary = () => {
    const ret = this.props.units.filter(
      u =>
        u.unit_type === "Fortification" ||
        u.unit_type === "Infantry" ||
        u.unit_type === "Cavalry" ||
        u.unit_type === "Archer" ||
        u.unit_type === "Seige" ||
        u.unit_type === "Monk",
    );
    return ret;
  };
  getProduction = () => {
    return this.props.units.filter(u => u.unit_type === "Structure" || u.unit_type === "Gatherer");
  };
  getTechnologies = () => {
    return this.props.units.filter(u => u.unit_type === "Technology");
  };
  getUnits = () => {
    const { name } = this.state.filters;
    let retUnits = this.getUnitsByType(this.props.match.params.listType);
    retUnits = retUnits.filter(u => {
      return u.name.toLowerCase().includes(name.toLowerCase()) && this.ageFilter(u);
    });
    retUnits = retUnits.sort((l, h) => {
      return this.state.sort(l, h);
    });
    return retUnits;
  };
  ageFilter = unit => {
    const { dark, feudal, castle, imperial } = this.state.filters;
    const { age } = unit;
    return (
      (dark && age === "Dark") ||
      (feudal && age === "Feudal") ||
      (castle && age === "Castle") ||
      (imperial && age === "Imperial")
    );
  };
  displayUnits = () => {
    return this.getUnits().map(u => (
      <UnitCard
        build={this.props.build}
        handleAddUnit={this.props.handleAddUnit}
        handleClick={this.setUnit}
        key={u.id}
        unit={u}
      />
    ));
  };
  setUnit = unit => {
    this.setState({ currentUnit: unit });
  };
  handleFilter = (event, filter) => {
    event.stopPropagation();
    let newFilters = { ...this.state.filters };
    newFilters[filter] = event.target.hasOwnProperty("checked") ? event.target.checked : event.target.value;
    this.setState({ filters: newFilters });
  };
  handleSort = event => {
    event.stopPropagation();
    let cb = () => {};
    switch (event.target.value) {
      case "age":
        cb = this.sortAge;
        break;
      case "name":
        cb = this.sortName;
        break;
      case "food":
        cb = this.sortFood;
        break;
      case "wood":
        cb = this.sortWood;
        break;
      case "gold":
        cb = this.sortGold;
        break;
      case "stone":
        cb = this.sortStone;
        break;
      default:
        break;
    }
    this.setState({ sort: cb }, () => console.log(this.state));
  };
  sortAge = (l, h) => {
    const ages = ["Dark", "Feudal", "Castle", "Imperial"];
    return ages.indexOf(l.age) - ages.indexOf(h.age);
  };
  sortName = (lu, hu) => {
    const l = lu.name;
    const h = hu.name;
    if (l > h) return 1;
    else if (l === h) return 0;
    else return -1;
  };
  sortFood = (l, h) => this.sortResource(l, h, "food");
  sortWood = (l, h) => this.sortResource(l, h, "wood");
  sortGold = (l, h) => this.sortResource(l, h, "gold");
  sortStone = (l, h) => this.sortResource(l, h, "stone");
  sortResource(l, h, r) {
    return l[r] - h[r];
  }

  render() {
    return (
      <React.Fragment>
        <div className="column" style={{ flex: 4, maxHeight: "100%" }}>
          <div className="ui segment" style={{ border: "0px solid red", boxShadow: "none", margin: "0.5em" }}>
            <div className="ui segment" style={{ border: "0px solid black", boxShadow: "none" }}>
              <UnitForm
                handleSort={this.handleSort}
                handleFilter={this.handleFilter}
                filters={this.state.filters}
                sort={this.state.sort}
              />
            </div>
            <div className="ui centered grid" style={{ maxHeight: "80vh", overflow: "scroll" }}>
              {this.displayUnits()}
            </div>
            <UnitModal unit={this.state.currentUnit} quit={() => this.setState({ currentUnit: null })} />
          </div>
        </div>
        <BuildSummary reorder={this.props.reorder} build={this.props.build} />
      </React.Fragment>
    );
  }
}
