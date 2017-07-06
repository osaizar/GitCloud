import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router";


import RepoFilePanelItem from "./RepoFilePanelItem.jsx";


class ShowFolderPanel extends Component {

  /*
  Props:
    owner
    repoName
    path
  */
  
  render() {
    var dir = "";
    var prevDir = "";
    var currDir = "";
    var prevDirLink = "";
    var upFolder = (<span></span>);

    dir = this.props.path;
    var split = dir.split("/");
    for (var i = 0; i < split.length-1; i++)
      prevDir += "/"+split[i];

    if(prevDir == ""){
      prevDirLink = "/"+this.props.owner+"/"+this.props.repoName;
    }else{
      prevDirLink = "/"+this.props.owner+"/"+this.props.repoName+"/folder"+prevDir;
    }

    currDir = split[split.length-1];

    upFolder = (<tr>
                  <td><Link to={prevDirLink}><span className="glyphicon glyphicon-folder-open" aria-hidden="true"></span> .. </Link></td>
                  <td></td>
                  <td></td>
                </tr>
    );

    return(
      <div className="panel panel-default">
        <div className="panel-heading">
          <div className="panel-title">
            <Link to={prevDirLink}>{prevDir+"/"}</Link> {currDir}
          </div>
        </div>
        <table className="table">
          <tbody>
            {upFolder}
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

module.exports = ShowFolderPanel;
