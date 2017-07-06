import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router";

class SshKeyListItem extends Component {

  /*
  Props:
    index
    sshkey
    onDelete
  */

  constructor(props){
    super(props);
    this.remove = this.remove.bind(this);
  }

  remove(){
    this.props.onDelete(this.props.index);
  }

  render(){
    return(
      <div className="panel panel-default">
        <div className="row" id="SshKeyListItem">
          <div className="col-lg-1">
            <span className="glyphicon glyphicon-lock" aria-hidden="true"></span>
          </div>
          <div className="col-lg-10">
            <p><b>Key Name:</b> {this.props.sshkey.name}</p>
            <p><b>Hash:</b> {this.props.sshkey.hash}</p>
          </div>
          <div className="col-lg-1">
            <input className="btn btn-danger btn-sm" type="button" value="remove" onClick={this.remove}/>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = SshKeyListItem;
