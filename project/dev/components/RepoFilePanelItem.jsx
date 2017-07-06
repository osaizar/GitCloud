import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router";

class RepoFilePanelItem extends Component{

  /*
  Props:
    file
  */

  render() {
    var icon;

    if (this.props.file.type == "file"){
      icon = "glyphicon glyphicon-file";
    }else{
      icon = "glyphicon glyphicon-folder-close";
    }
    // I should use <Link> instead of <a> but the folders wouldn't work.
    // I couldn't find another solution
    return(
      <tr>
        <td><a  href={this.props.file.url}><span className={icon} aria-hidden="true"></span> {this.props.file.name} </a></td>
        <td>Commit #{this.props.file.commit}</td>
        <td>{this.props.file.updated}</td>
      </tr>
    );
  }
}

module.exports = RepoFilePanelItem;
