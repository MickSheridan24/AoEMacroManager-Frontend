import React, { Component } from "react";

export default class UnitCard extends Component {
  state = {
    flipped: false,
  };
  componentWillUnmount() {
    console.log("unit unmounting");
  }

  resources = () => {
    const { food, wood, gold, stone } = this.props.unit;

    const foodSpan =
      food > 0 ? (
        <i className="tiny circle icon" style={{ color: "rgb(240, 100,100)", float: "left", padding: "0.5em" }} />
      ) : null;

    const woodSpan =
      wood > 0 ? (
        <i className="tiny circle icon" style={{ color: "rgb(104,57,20) ", float: "left", padding: "0.5em" }} />
      ) : null;

    const goldSpan =
      gold > 0 ? (
        <i className="tiny circle icon" style={{ color: "rgb(254,248,95)", float: "left", padding: "0.5em" }} />
      ) : null;

    const stoneSpan =
      stone > 0 ? (
        <i className="tiny circle icon" style={{ color: "rgb(186,186,186)", float: "left", padding: "0.5em" }} />
      ) : null;

    return (
      <span style={{ padding: "0.5em" }}>
        {foodSpan}
        {woodSpan}
        {goldSpan}
        {stoneSpan}
      </span>
    );
  };
  flip = () => {
    this.setState({ flipped: !this.state.flipped });
  };
  unitUnlocked = () => {
    const reqs = this.props.unit.prerequisites.map(p => p.id);
    const build = this.props.build.map(step => step.unit.id);

    return reqs.every(r => build.includes(r));
  };
  frontDisplay = () => {
    const { name, age, image, unit_type } = this.props.unit;
    let imageURL = "";
    try {
      imageURL = require(`../icons/${image}`);
    } catch (error) {
      if (unit_type === "Technology") {
        imageURL = require("../icons/unique_tech_1.png");
      }
    }

    return (
      <React.Fragment>
        <p style={{ fontSize: "0.75em", color: "rgb(150,150,150)" }}>{age}</p>
        <img className="ui centered tiny rounded image" src={imageURL} alt="X" />
        <h5 className="header" style={{ margin: "0.5em", height: "1em", fontSize: "1em" }}>
          {name}
        </h5>
      </React.Fragment>
    );
  };

  addUnit = e => {
    e.stopPropagation();
    this.props.handleAddUnit(this.props.unit);
  };

  handleClick = () => {
    this.props.handleClick(this.props.unit);
  };

  getStyles = () => {
    let ret = {
      margin: "0em",
      minWidth: "10em",
      maxWidth: "10em",
      minHeight: "12em",
      maxHeight: "12em",
      padding: "0px",
    };
    if (!this.unitUnlocked()) {
      ret = { ...ret, background: "gray" };
    }
    return ret;
  };
  render() {
    return (
      <React.Fragment>
        <div onClick={this.handleClick} className="ui segment" style={this.getStyles()}>
          <p>
            {this.resources()}
            <button
              className=" mini ui  icon right floated button"
              style={{ margin: "0px", padding: "0.5em" }}
              onClick={this.addUnit}>
              <i className="plus icon" />
            </button>
          </p>
          <div className="ui center aligned container">{this.frontDisplay()}</div>
        </div>
      </React.Fragment>
    );
  }
}
