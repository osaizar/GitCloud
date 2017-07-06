import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router";


class RepoPanelItem extends Component {

  /*
  Props:
    repo
  */

  render() {
    return(
      <li className="list-group-item">
        <span className="glyphicon glyphicon-book" aria-hidden="true"> </span>
        <Link to={this.props.repo.url}> {this.props.repo.name} </Link>
        <p>{this.props.repo.updated}</p>
      </li>
    );
  }
}

module.exports = RepoPanelItem;
