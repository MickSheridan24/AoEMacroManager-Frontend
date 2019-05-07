import React, { Component } from "react";

export default class UnitModal extends Component {
  constructor() {
    super();
    this.el = React.createRef();
  }

  componentDidUpdate() {
    if (this.props.unit) {
      this.show();
    }
  }
  show = () => {
    this.el.current.style = "display: block;";
  };
  hide = e => {
    e.stopPropagation();
    this.el.current.style = "display:none;";
    this.props.quit();
  };
  fetchImage = unit => {
    let ret = "";
    try {
      ret = require(`../icons/${this.props.unit.image}`);
    } catch (error) {
      if (unit.unit_type === "Technology") {
        ret = require("../icons/unique_tech_1.png");
      }
    }
    return ret;
  };

  resources = () => {
    const { food, wood, gold, stone } = this.props.unit;

    const foodSpan =
      food > 0 ? (
        <span>
          <img
            className="ui middle aligned avatar image"
            style={{ paddingLeft: "0.5em" }}
            src={require("../icons/food.png")}
            alt="food"
          />
          {food}
        </span>
      ) : null;

    const woodSpan =
      wood > 0 ? (
        <span>
          <img
            className="ui  middle aligned avatar image"
            style={{ paddingLeft: "0.5em" }}
            src={require("../icons/wood.png")}
            alt="wood"
          />
          {wood}
        </span>
      ) : null;

    const goldSpan =
      gold > 0 ? (
        <span>
          <img
            className="ui  middle aligned avatar image"
            style={{ paddingLeft: "0.5em" }}
            src={require("../icons/gold.png")}
            alt="gold"
          />
          {gold}
        </span>
      ) : null;

    const stoneSpan =
      stone > 0 ? (
        <span>
          <img
            className="ui middle aligned  avatar image"
            style={{ paddingLeft: "0.5em" }}
            src={require("../icons/stone.png")}
            alt="stone"
          />
          {stone}
        </span>
      ) : null;

    return (
      <React.Fragment>
        {foodSpan}
        {woodSpan}
        {goldSpan}
        {stoneSpan}
      </React.Fragment>
    );
  };

  display = () => {
    const { build_time, name, age, unit_type, description } = this.props.unit;
    return (
      <div className="ui grid">
        <div className="row">
          <div className="five wide stretched column">
            <img
              className="ui top aligned small rounded image"
              src={this.fetchImage(this.props.unit)}
              alt={this.props.unit.name}
            />
          </div>
          <div className="four wide stretched column">
            <h2>{name}</h2>
            <p>{age} Age</p>
            <p>{unit_type}</p>
            <p>Build Time: {build_time}</p>
          </div>
          <div className="three wide stretched column">{this.resources()}</div>
        </div>
        <div className="row">
          <div className="twelve wide stretched column">
            <p>
              <em>{description}</em>
            </p>
          </div>
          <div className="column"> Requirements</div>
        </div>
        <div className="row" />
      </div>
    );
  };

  render() {
    return (
      <div ref={this.el} className="modal" onClick={this.hide}>
        <div onClick={e => e.stopPropagation()} className="modal-content">
          {this.props.unit ? this.display() : null}
        </div>
      </div>
    );
  }
}
