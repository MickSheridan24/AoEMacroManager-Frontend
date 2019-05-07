import React, { Component } from "react";

export default class UnitLabel extends Component {
  constructor() {
    super();

    this.state = {
      dragon: false,
    };
  }
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

  handleDragStart = e => {
    this.props.setDragger(e, this.props);
  };
  handleDrag = event => {
    const img = document.createElement("img");
    img.className = "ui mini avatar image";
    img.alt = this.props.unit.name;
    img.src = this.props.unit.image;
    event.dataTransfer.setDragImage(img, 0, 0);
    event.stopPropagation();
    event.preventDefault();
    this.setState({ dragon: true });
    this.props.handleDrag(event);
  };
  handleDrop = e => {
    this.setState({ dragon: false });
    this.props.handleDrop(this.props);
  };
  handleEnter = e => {
    if (e.target.dataset.card) {
      this.props.handleDragEnter(e.target.dataset.index);
    }
  };
  handleLeave = e => {
    e.target.style.backgroundColor = "";
  };
  render() {
    return (
      <div
        data-index={this.props.index}
        data-card={true}
        draggable
        onDragStart={this.handleDragStart}
        onDragEnter={this.handleEnter}
        onDragEnd={this.handleDrop}
        onDrag={this.handleDrag}
        className="ui segment"
        style={
          this.state.dragon
            ? {
                display: "none",
              }
            : this.props.isBeingDraggedOn
            ? { backgroundColor: "gray" }
            : { userDrag: "none", draggable: false, userSelect: "all", margin: "0em" }
        }>
        <span
          style={
            this.state.dragon
              ? { display: "none" }
              : {
                  userDrag: "none",
                  draggable: false,
                  fontSize: "1.5em",
                  color: "rgb(150, 150, 150)",
                  marginRight: "0.2em",
                  userSelect: "none",
                }
          }>
          {this.props.index + 1}.
        </span>
        <img
          alt={this.props.unit.name}
          style={{ position: "relative", draggable: false, userDrag: "none", userSelect: false }}
          className="ui mini avatar image"
          src={this.setImage(this.props.unit)}
        />
        <span
          style={
            this.state.dragon
              ? { display: "none" }
              : { userDrag: "none", draggable: false, fontSize: "0.7em", userSelect: "none" }
          }>
          {this.props.unit.name}
        </span>
      </div>
    );
  }
}
