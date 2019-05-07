import React, { Component } from "react";
import EconSummary from "../containers/EconSummary";
import { NavLink } from "react-router-dom";

export default class NavBar extends Component {
  render() {
    return (
      <div className="ui fluid right tabular menu">
        <NavLink className="item" to="/menu/military">
          Units
        </NavLink>
        <NavLink className="item" to="/menu/production">
          Production
        </NavLink>
        <NavLink className="item" to="/menu/technologies">
          Upgrades
        </NavLink>
        <NavLink className="item" to="/builds">
          Build
        </NavLink>
        <div className="right menu">
          <div className="item">
            <EconSummary />
          </div>
        </div>
      </div>
    );
  }
}
