import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router";


class LoadingPanel extends Component {

  render(){
    return(
      <div className="text-center">
        <img src="/img/loading.gif"/>
        <h3>Loading...</h3>
      </div>
    );
  }
}

module.exports = LoadingPanel;
