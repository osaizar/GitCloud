import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router";

class ChangePasswordForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      oldPass : '',
      newPass : '',
      reNewPass : ''
    };

    this.updateOldPass = this.updateOldPass.bind(this);
    this.updateNewPass = this.updateNewPass.bind(this);
    this.updateRNewPass = this.updateReNewPass.bind(this);
    this.chPassword = this.chPassword.bind(this);
  }

  chPassword(e){
    e.preventDefault();
    if (this.state.password != this.state.rePassword){
      $("#chPassSuccess").css("display", "none");
      $("#chPassError").css("display", "block");
      $("#messagechPassErr").html("Passwords do not match");
    }else{
      $.ajax({
        contentType: 'application/json',
        headers:{
          "token" : localStorage.getItem("token")
        },
        data: JSON.stringify(this.state),
        success: function(data){
          if (data.success){
            $("#chPassSuccess").css("display", "block");
            $("#chPassError").css("display", "none");
            $("#messageChPassSucc").html(data.message);
            $("#chPassForm").trigger("reset");
          }else {
            $("#chPassSuccess").css("display", "none");
            $("#chPassError").css("display", "block");
            $("#messageChPassErr").html(data.error);
          }
        },
        error: function(data){
          $("#chPassSuccess").css("display", "none");
          $("#chPassError").css("display", "block");
          $("#messageChPassErr").html(data.responseJSON.error);
        },
        processData: false,
        type: 'POST',
        url: '/ajax/change_password'
      });
    }
  }

  updateOldPass(e){
    this.setState({oldPass : e.target.value});
  }

  updateNewPass(e){
    this.setState({newPass : e.target.value});
  }

  updateReNewPass(e){
    this.setState({reNewPass : e.target.value});
  }

  render(){
    return(
      <div>
        <form id="chPasswordForm" onSubmit={this.chPassword}>
          <div className="form-group">
            <label htmlFor="old_password">Old Password</label>
            <input value={this.state.oldPass} onChange={this.updateOldPass} className="form-control" id="ch_old_password" type="password" name="ch_old_password" required/>
          </div>
          <div className="form-group">
            <label htmlFor="new_password">New Password</label>
            <input value={this.state.newPass} onChange={this.updateNewPass} className="form-control" id="ch_new_password" type="password" name="ch_new_password" required pattern=".{6,}" title="6 characters minimum"/>
          </div>
          <div className="form-group">
            <label htmlFor="password">Repeat Password</label>
            <input value={this.state.rNewPass} onChange={this.updateRNewPass} className="form-control" id="ch_rnew_password" type="password" name="ch_rnew_password" required pattern=".{6,}" title="6 characters minimum"/>
          </div>
          <br/><input className="btn btn-default" type="submit" value="Change Password"/>
        </form>
        <div id="chPassError" className="alert alert-danger" style={{display: "none"}}>
          <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
          <span id="messageChPassErr"></span>
        </div>
        <div id="chPassSuccess" className="alert alert-success" style={{display: "none"}}>
          <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
          <span id="messageChPassSucc"></span>
        </div>
      </div>
    );
  }
}

module.exports = ChangePasswordForm;
