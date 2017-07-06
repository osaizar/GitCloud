import React, { Component } from "react";
import ReactDOM from "react-dom";

// TODO: add dynamic information

class UserHeader extends Component {

  /*
  Props:
    user {username , email}
  */

  render(){
    return(
      <div className="page-header">
        <div className="row">
          <div className="col-md-6">
            <img src="/img/profile.png" height="150px"/>
          </div>
          <div className="col-md-6">
            <div className="row">
              <h1><span className="glyphicon glyphicon-user"></span> {this.props.user.username}</h1>
            </div>
            <div className="row">
              <h2><span className="glyphicon glyphicon-envelope"></span> {this.props.user.email}</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = UserHeader;
