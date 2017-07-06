import React, { Component } from "react";
import ReactDOM from "react-dom";
import { browserHistory } from "react-router";

class CollabForm extends Component {

  /*
  Props:
    onAdd
    repoName
    owner
  */

  constructor(props) {
    super(props)
    this.state = {
      user : ''
    }

    this.updateUser = this.updateUser.bind(this);
    this.submit = this.submit.bind(this);
  }

  submit(e){
    e.preventDefault();
    var that = this;
    $.ajax({
      contentType: 'application/json',
      headers:{
        "token" : localStorage.getItem("token")
      },
      data: JSON.stringify({
        "user" : that.state.user,
        "level" : $("#valueSelector option:selected").val(),
        "repo" : that.props.repoName,
        "owner" : that.props.owner
      }),
      success: function(data){
        if (data.success){
          $("#collabSuccess").css("display", "block");
          $("#collabError").css("display", "none");
          $("#messagecCollabSucc").html(data.message);
          $("#collabForm").trigger("reset");
        }else{
          $("#collabError").css("display", "block");
          $("#collabSuccess").css("display", "none");
          $("#messagecCollabErr").html(data.error);
        }
      },
      error: function(data){
        $("#collabSuccess").css("display", "none");
        $("#collabError").css("display", "block");
        $("#messagecCollabErr").html(data.responseJSON.error);
      },
      processData: false,
      type: 'POST',
      url: '/ajax/add_collaborator'
    });
    this.props.onAdd();
  }

  updateUser(e){
    this.setState({user : e.target.value});
  }

  render(){
    return(
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Add Collaborator</h3>
        </div>
        <form id="collabForm" onSubmit={this.submit}>
          <div className="input-group">
            <span className="input-group-btn">
              <button className="btn btn-default" type="button">Username: </button>
            </span>
            <input value={this.state.user} onChange={this.updateUser} className="form-control" name="key" required/>
          </div>
          <br/>
          <div className="input-group">
            <span className="input-group-btn">
              <button className="btn btn-default" type="button">Level: </button>
            </span>
            <select id="valueSelector" className="form-control">
              <option value="write">read and write</option>
              <option value="read">read</option>
            </select>
          </div>
          <br/><input className="btn btn-success btn-md" type="submit" value="Add Collaborator"/>
        </form>
        <div id="collabError" className="alert alert-danger" style={{display: "none"}}>
          <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
          <span id="messagecCollabErr"></span>
        </div>
        <div id="collabSuccess" className="alert alert-success" style={{display: "none"}}>
          <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
          <span id="messagecCollabSucc"></span>
        </div>
      </div>
    );
  }
}

module.exports = CollabForm;
