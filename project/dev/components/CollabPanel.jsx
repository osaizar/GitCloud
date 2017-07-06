import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router";

import CollabList from "./CollabList.jsx";
import CollabForm from "./CollabForm.jsx";

class CollabPanel extends Component {

  /*
  Props:
    owner
    repoName
  */

  constructor(props) {
    super(props);
    this.state = {
      collabs : [],
      found : false
    }

    this.getCollabs = this.getCollabs.bind(this);
    this.deleteCollab = this.deleteCollab.bind(this);
  }

  componentWillMount(){
    this.getCollabs();
  }

  getCollabs(){
    var that = this;
    $.ajax({
      contentType: 'application/json',
      headers : {
        "token" : localStorage.getItem("token")
      },
      data: JSON.stringify({
        "repo" : that.props.repoName,
        "owner" : that.props.owner
      }),
      success: function(data){
        if (data.success){
          that.setState({collabs : data.collabs, found : true});
        }else{
          that.setState({collabs : "", found : false});
        }
      },
      error: function(data){
        console.log("error! "+JSON.stringify(data));
        that.setState({found : false});
      },
      processData: false,
      type: 'POST',
      url: '/ajax/get_collaborators'
    });
  }

  deleteCollab(i){
    var that = this;
    $.ajax({
      contentType: 'application/json',
      headers:{
        "token" : localStorage.getItem("token")
      },
      data: JSON.stringify({
        "user" : that.state.collabs[i].username,
        "repo" : that.props.repoName,
        "owner" : that.props.owner
      }),
      success: function(data){
        if (data.success){
          var collabs = that.state.collabs;
          collabs.splice(i, 1);
          that.setState({"collabs" : collabs});
          //$("#sshKeySuccess").css("display", "block");
          //$("#sshKeyError").css("display", "none");
          //$("#messageSshKeySucc").html(data.message);
        }else{
          //$("#sshKeyError").css("display", "block");
          //$("#sshKeySuccess").css("display", "none");
          //$("#messageSshKeyErr").html(data.error);
        }
      },
      error: function(data){
        //$("#sshKeySuccess").css("display", "none");
        //$("#sshKeyError").css("display", "block");
        //$("#messageSshKeyErr").html(data.responseJSON.error);
      },
      processData: false,
      type: 'POST',
      url: '/ajax/remove_collaborator'
    });
    this.getCollabs();
  }

  render(){
    if(this.state.found){
      return(
        <div>
          <div className="page-header">
            <CollabList collList={this.state.collabs} onDelete={this.deleteCollab}/>
          </div>
          <CollabForm onAdd={this.getCollabs} repoName={this.props.repoName} owner={this.props.owner}/>
        </div>
      );
    }else{
      return (
        <div className="jumbotron text-center">
          There was an error, I guess...
        </div>
      );
    }
  }
}

module.exports = CollabPanel;
