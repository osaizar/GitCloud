import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router";

class CollabListItem extends Component {

  /*
  Props:
    index
    collab
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
          <div className="col-lg-11">
            <p><span className="glyphicon glyphicon-user" aria-hidden="true"></span> <b>{this.props.collab.username}</b></p>
            <p><b>Level:</b> {this.props.collab.level}</p>
          </div>
          <div className="col-lg-1">
            <input className="btn btn-danger btn-sm" type="button" value="remove" onClick={this.remove}/>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = CollabListItem;
