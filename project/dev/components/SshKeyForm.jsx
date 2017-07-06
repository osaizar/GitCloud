import React, { Component } from "react";
import ReactDOM from "react-dom";
import { browserHistory } from "react-router";

class SshKeyForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      key : ''
    }

    this.updateKey = this.updateKey.bind(this);
    this.submit = this.submit.bind(this);
  }

  submit(e){
    e.preventDefault();
    $.ajax({
      contentType: 'application/json',
      headers:{
        "token" : localStorage.getItem("token")
      },
      data: JSON.stringify(this.state),
      success: function(data){
        if (data.success){
          $("#sshKeySuccess").css("display", "block");
          $("#sshKeyError").css("display", "none");
          $("#messageSshKeySucc").html(data.message);
          $("#sshKeyForm").trigger("reset");
        }else{
          $("#sshKeyError").css("display", "block");
          $("#sshKeySuccess").css("display", "none");
          $("#messageSshKeyErr").html(data.error);
        }
      },
      error: function(data){
        $("#sshKeySuccess").css("display", "none");
        $("#sshKeyError").css("display", "block");
        $("#messageSshKeyErr").html(data.responseJSON.error);
      },
      processData: false,
      type: 'POST',
      url: '/ajax/add_user_key'
    });
    this.props.onAdd();
  }

  updateKey(e){
    this.setState({key : e.target.value});
  }

  render(){
    return(
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Add SSH key</h3>
        </div>
        <form id="sshKeyForm" onSubmit={this.submit}>
          <div className="input-group">
            <span className="input-group-btn">
              <button className="btn btn-default" type="button">SSH Key</button>
            </span>
            <input value={this.state.key} onChange={this.updateKey} className="form-control" name="key" required/>
          </div>
          <br/><input className="btn btn-success btn-md" type="submit" value="Add Key"/>
        </form>
        <div id="sshKeyError" className="alert alert-danger" style={{display: "none"}}>
          <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
          <span id="messageSshKeyErr"></span>
        </div>
        <div id="sshKeySuccess" className="alert alert-success" style={{display: "none"}}>
          <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
          <span id="messageSshKeySucc"></span>
        </div>
      </div>
    );
  }
}

module.exports = SshKeyForm;
