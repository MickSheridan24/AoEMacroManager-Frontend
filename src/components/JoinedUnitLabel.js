import React, { Component } from "react";
import LongUnitLabel from "./LongUnitLabel";

export default class JoinedUnitLabel extends Component {
  jointResources = () => {
    const reduceFunc = resource => {
      return (sum, step) => {
        return sum + step.unit[resource];
      };
    };
    const food = this.props.steps.reduce(reduceFunc("food"), 0);
    const wood = this.props.steps.reduce(reduceFunc("wood"), 0);
    const gold = this.props.steps.reduce(reduceFunc("gold"), 0);
    const stone = this.props.steps.reduce(reduceFunc("stone"), 0);
    return { food: food, wood: wood, gold: gold, stone: stone };
  };
  totalTime = () => {
    return this.props.steps.reduce((sum, step) => sum + step.unit.build_time, 0);
  };
  getLabels = () => {
    return this.props.steps.map((s, i) => {
      return (
        <LongUnitLabel
          main={i === 0}
          final={i === this.props.steps.length - 1}
          time={this.totalTime()}
          phase={this.props.phase}
          resources={this.jointResources()}
          step={s}
          deleteStep={this.props.deleteStep}
          selected={this.props.selected === s.build_key}
          selectStep={this.props.selectStep}
          key={s.build_key}
          setDescription={this.props.setDescription}
        />
      );
    });
  };
  render() {
    return this.getLabels();
  }
}
