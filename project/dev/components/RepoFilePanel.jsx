import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router";


import RepoFilePanelItem from "./RepoFilePanelItem.jsx";


class RepoFilePanel extends Component {

  /*
  Props:
    files
    commit
  */

  render() {    
    return(
      <div className="panel panel-default">
        <div className="panel-heading">
          <div className="panel-title">
            Commit #{this.props.commit}
          </div>
        </div>
        <table className="table">
          <tbody>
            {
              this.props.files.map(function(file, i){
                return (<RepoFilePanelItem key={i} file={file}/>);
              })
            }
          </tbody>
        </table>
      </div>
    );
  }
}

module.exports = RepoFilePanel;
