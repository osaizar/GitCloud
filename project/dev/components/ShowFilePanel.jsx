import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router";


class ShowFilePanel extends Component {

  /*
  Props:
    owner
    repoName
    file
    fileContent
  */

  render(){
    var currDir = "";
    var prevDir = "";
    var split = "";

    split = this.props.file.split("/");
    for (var i = 0; i < split.length-1; i++)
      prevDir += "/"+split[i];

    if (prevDir != "")
      prevDir = "/folder" + prevDir;

    currDir = split[split.length-1];

    return(
      <div className="panel panel-default">
        <div className="panel-heading">
          <div className="panel-title">
            <Link to={"/"+this.props.owner+"/"+this.props.repoName+prevDir}>{prevDir+"/"}</Link> {currDir}
          </div>
        </div>
        <div>
          <pre>
            {this.props.fileContent.replace("<", "&lt")}
          </pre>
        </div>
      </div>
    );
  }
}

module.exports = ShowFilePanel;
