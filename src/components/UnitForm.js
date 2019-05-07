import React, { Component } from "react";

export default class UnitForm extends Component {
  render() {
    return (
      <div>
        <form>
          <label>Name: </label>
          <input value={this.props.filters.name} onChange={e => this.props.handleFilter(e, "name")} />
          <label>Dark: </label>
          <input type="checkbox" onChange={e => this.props.handleFilter(e, "dark")} checked={this.props.filters.dark} />
          <label>Feudal: </label>
          <input type="checkbox" onChange={e => this.props.handleFilter(e, "feudal")} checked={this.props.filters.feudal} />
          <label>Castle: </label>
          <input type="checkbox" onChange={e => this.props.handleFilter(e, "castle")} checked={this.props.filters.castle} />
          <label>Imperial: </label>
          <input type="checkbox" onChange={e => this.props.handleFilter(e, "imperial")} checked={this.props.filters.imperial} />

          <label>Sort By: </label>
          <select onChange={this.props.handleSort}>
            <option value="age">Age</option>
            <option value="name">Name</option>
            <option value="food">Food Cost</option>
            <option value="wood">Wood Cost</option>
            <option value="gold">Gold Cost</option>
            <option value="stone">Stone Cost</option>
          </select>
        </form>
      </div>
    );
  }
}
