import React, { Component } from "react";
import ReactDOM from "react-dom";


class ErrorPanel extends Component {
  render(){
    return(
      <div>
        <div className="jumbotron">
          <h1>ERROR!</h1>
          <h3>{this.props.error}</h3>
        </div>
      </div>
    );
  }
}

module.exports = ErrorPanel;
