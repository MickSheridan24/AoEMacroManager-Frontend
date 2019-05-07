import React, { Component } from "react";

export default class BuildForm extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      description: "",
      hidden: true,
    };
  }
  toggle = () => {
    this.setState({ hidden: !this.state.hidden });
  };
  displayBuilds = () => {
    return this.props.builds.map((b, i) => {
      return (
        <option key={b.id || Math.random()} value={b.id}>
          {b.name}
        </option>
      );
    });
  };
  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    return (
      <React.Fragment>
        <button onClick={this.toggle} style={{ boxShadow: "none", border: "0px solid black" }}>
          <i className={this.state.hidden ? "angle double down icon" : "angle double up icon"} />
        </button>
        {this.state.hidden ? null : (
          <div>
            <form onSubmit={this.props.handleSubmit}>
              <h4>Create a New Build</h4>
              <label>Build Name: </label>
              <input name="name" placeholder="Build Name" onChange={this.handleChange} value={this.state.name} />
              <br />
              <label>Build Description: </label>
              <input
                name="description"
                placeholder="Description"
                onChange={this.handleChange}
                value={this.state.description}
              />
              <br />
              <input type="submit" />
            </form>
            <label>Select Current Build</label>
            <select value={`${this.props.current}`} onChange={this.props.handleSelectBuild}>
              {this.displayBuilds()}
            </select>
          </div>
        )}
      </React.Fragment>
    );
  }
}
