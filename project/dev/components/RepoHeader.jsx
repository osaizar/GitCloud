import React, { Component } from "react";
import ReactDOM from "react-dom";



class RepoHeader extends Component {

  /*
  Props:
    owner
    repoName
  */

  render() {
    var uri;
    if (localStorage.getItem("username") != "undefined" && localStorage.getItem("username") != null){
      uri = "ssh://"+localStorage.getItem("username")+"@localhost/gitCloud/"+this.props.owner+"/"+this.props.repoName+".git"
    }else{
      uri = "Login to clone this repository";
    }

    return(
      <div className="page-header">
        <div className="row">
          <div className="repo-title col-md-6">
            <h1>{this.props.owner} / {this.props.repoName}</h1>
          </div>
          <div className="repo-clone col-md-6">
            <h3>Clone Repository</h3>
            <div className="input-group">
              <span className="input-group-btn">
                <button className="btn btn-default" type="button">SSH</button>
              </span>
              <input type="text" className="form-control" value={uri} readOnly/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = RepoHeader;
