import React, { Component } from "react";

export default class LongUnitLabel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      descriptionForm: false,
      descriptionText: props.step.description,
    };
    this.unitDiv = React.createRef();
  }

  getResources = total => {
    const { food, wood, gold, stone } = total ? this.props.resources : this.props.step.unit;

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
  handleChange = e => {
    e.stopPropagation();
    this.setState({ descriptionText: e.target.value });
  };
  getDescription = () => {
    return (
      <React.Fragment>
        {this.state.descriptionForm ? (
          this.getDescriptionForm()
        ) : (
          <div>
            {this.props.main ? <em>{this.props.step.description}</em> : null}
            {this.props.selected ? (
              <div>
                <button style={{ marginLeft: "0.2em" }} onClick={() => this.setState({ descriptionForm: true })}>
                  {this.props.step.description === "" ? "Add" : "Edit"} Description
                </button>
                <button onClick={() => this.props.deleteStep(this.props.step.build_key)}>Remove Step</button>
              </div>
            ) : null}
          </div>
        )}
      </React.Fragment>
    );
  };
  getDescriptionForm = () => {
    return (
      <form
        onSubmit={e => {
          e.preventDefault();
          e.target.reset();
          this.props.setDescription(e, this.props.step);
          this.setState({ descriptionForm: false });
        }}>
        <textarea
          name="description"
          rows={3}
          style={{ width: "25em" }}
          onChange={this.handleChange}
          value={this.state.descriptionText}
        />
        <input type="submit" />
      </form>
    );
  };

  setImage = unit => {
    let ret = "";
    try {
      ret = require(`../icons/${unit.image}`);
    } catch (error) {
      if (unit.unit_type === "Technology") {
        ret = require("../icons/unique_tech_1.png");
      }
    }
    return ret;
  };
  handleClick = () => {
    this.props.selectStep(this.props.step);
  };

  getStyles = () => {
    let ret = {};
    const selected = { background: "gray", color: "white" };
    const top = { borderTop: "1px solid black" };
    if (this.props.selected) ret = { ...ret, ...selected };
    if (this.props.main) ret = { ...ret, ...top };
    return ret;
  };

  render() {
    const { order, unit } = this.props.step;
    const { name, build_time } = this.props.step.unit;
    return (
      <div onClick={this.handleClick} ref={this.unitDiv} className="row" style={this.getStyles()}>
        <div className="column">
          {this.props.main ? `${this.props.phase + 1}` : this.props.selected ? `[${order + 1}]` : null}
        </div>
        <div className="column">
          <img src={this.setImage(unit)} alt="X" />
        </div>
        <div className="two wide column">{name}</div>
        {this.props.main ? (
          <React.Fragment>
            <div className="three wide column">{this.getResources(true)}</div>
            <div className="column">{this.props.time} sec</div>
          </React.Fragment>
        ) : this.props.selected ? (
          <React.Fragment>
            <div className="three wide column">{this.getResources(false)} </div>
            <div className="column">{build_time} sec</div>
          </React.Fragment>
        ) : (
          <div className="four wide column" />
        )}
        <div className="four wide column">{this.getDescription()}</div>
      </div>
    );
  }
}
{
}
