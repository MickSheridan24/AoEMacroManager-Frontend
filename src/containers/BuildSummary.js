import React, { Component } from "react";
import UnitLabel from "../components/UnitLabel";

export default class BuildSummary extends Component {
  state = {
    hidden: false,
    currentUnit: null,
    dragger: { props: null, index: -3, x: 0, y: 0, enterIndex: -3 },
  };
  toggle = () => {
    this.setState({ hidden: !this.state.hidden });
  };
  setUnit = unit => {
    this.setState({ currentUnit: unit });
  };
  setDragger = (e, labelProps) => {
    this.setState({
      dragger: { ...this.state.dragger, props: labelProps, index: parseInt(labelProps.index), x: e.pageX, y: e.pageY },
    });
  };
  dragElement = e => {
    const d = { ...this.state.dragger };
    d.x = e.pageX;
    d.y = e.pageY;
    this.setState({ dragger: d });
  };
  handleDragEnter = ind => {
    if (parseInt(ind) !== this.state.dragger.enterIndex) {
      this.setState({ dragger: { ...this.state.dragger, enterIndex: parseInt(ind) } });
    }
  };
  handleDrop = labelProps => {
    if (this.state.dragger.enterIndex >= 0) {
      this.props.reorder(labelProps.index, this.state.dragger.enterIndex);
      this.setState({ dragger: { props: null, index: -2, x: 0, y: 0, enterIndex: -2 } });
    }
  };

  displayUnits = () => {
    return this.props.build.map((u, i) => {
      const { enterIndex, index } = this.state.dragger;
      const isBDO = enterIndex === i || enterIndex + 1 === i || (enterIndex === index - 1 && enterIndex + 2 === i);

      return (
        <UnitLabel
          handleDrop={this.handleDrop}
          handleDragEnter={this.handleDragEnter}
          handleDrag={this.dragElement}
          setDragger={this.setDragger}
          index={i}
          unit={u.unit}
          key={u.build_key}
          isBeingDraggedOn={isBDO}
          handleClick={this.setUnit}
        />
      );
    });
  };

  render() {
    let icon = `angle double ${this.state.hidden ? "left" : "right"} icon`;
    return (
      <React.Fragment>
        <i
          onClick={this.toggle}
          className={icon}
          style={{ marginRight: "0.5em", marginTop: "0.5em", border: "0px solid green" }}
        />
        {this.state.hidden ? null : (
          <div className="column" style={{ flex: 1, padding: "0em" }}>
            <div
              className="ui segment"
              style={{
                maxHeight: "90vh",
                overflow: "scroll",
                margin: "0em",
                border: "0px solid black",
                boxShadow: "none",
                minHeight: "50vh",
              }}>
              {this.displayUnits()}
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}
