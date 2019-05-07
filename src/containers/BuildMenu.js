import React, { Component } from "react";
import LongUnitLabel from "../components/LongUnitLabel";
import JoinedUnitLabel from "../components/JoinedUnitLabel";
import BuildForm from "../components/BuildForm";

export default class BuildMenu extends Component {
  state = {
    selected: 0,
  };

  componentDidMount() {
    document.addEventListener("keydown", this.moveLabel);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.moveLabel);
  }

  buildDisplay = () => {
    //New Joined Unit Label each time a new explicit description is found
    // Steps without description added to current Joined Unit Label
    const units = this.getCurrentBuild().units;
    let currentSteps = [units[0]];
    let labels = [];
    for (let x = 1; x < units.length; x++) {
      const step = units[x];
      if (step.description !== "*" || x + 1 === units.length) {
        //New Joined Unit Label with current steps so far
        labels.push([...currentSteps]);
        currentSteps = [step];
      } else {
        currentSteps.push(step);
      }
    }
    return labels.map((l, i) => {
      return (
        <JoinedUnitLabel
          build={this.getCurrentBuild()}
          steps={l}
          phase={i}
          deleteStep={this.props.deleteStep}
          selected={this.state.selected}
          selectStep={this.selectStep}
          key={i}
          setDescription={this.props.setDescription}
        />
      );
    });
  };

  getCurrentBuild() {
    const build = this.props.builds.find(b => b.id === this.props.current);
    return build;
  }
  getCurrentIndex() {
    const something = this.props.builds.indexOf(this.getCurrentBuild());
    return something;
  }
  getSelectedIndex() {
    const unit = this.getCurrentBuild().units.find(u => u.build_key === this.state.selected);
    return this.getCurrentBuild().units.indexOf(unit);
  }
  selectStep = step => {
    this.setState({ selected: this.state.selected === step.build_key ? 0 : step.build_key });
  };
  moveLabel = e => {
    const key = e.key;
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();

      const build = this.getCurrentBuild();
      const unitIndex = this.getSelectedIndex();

      if (key === "ArrowUp" && unitIndex !== 0) {
        console.log(unitIndex, unitIndex - 2);
        this.props.reorder(unitIndex, unitIndex - 2);
      } else if (key === "ArrowDown" && !(unitIndex + 1 >= this.getCurrentBuild().units.length)) {
        console.log(unitIndex, unitIndex + 1);
        this.props.reorder(unitIndex, unitIndex + 1);
      }
    }
  };
  displayBuild() {
    return this.getCurrentBuild().units.map(u => (
      <LongUnitLabel
        deleteStep={this.props.deleteStep}
        selected={this.state.selected === u.build_key}
        selectStep={this.selectStep}
        setDescription={this.props.setDescription}
        key={u.build_key}
        step={u}
      />
    ));
  }
  handleSubmit = e => {
    e.preventDefault();
    const name = e.target.elements.name.value;
    const description = e.target.elements.description.value;
    this.props.newBuild(name, description);
  };
  render() {
    const { name, description } = this.getCurrentBuild();
    return (
      <div>
        <BuildForm
          handleSelectBuild={this.props.handleSelectBuild}
          handleSubmit={this.handleSubmit}
          builds={this.props.builds}
          current={this.props.current}
        />
        <h3>{name}</h3>
        <p>
          <em>{description}</em>
        </p>
        <div className="ui grid">{this.buildDisplay()}</div>
      </div>
    );
  }
}
