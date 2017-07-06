import React, { Component } from "react";
import ReactDOM from "react-dom";
import { browserHistory } from "react-router";

class SignInForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email : '',
      password : ''
    }

    this.updateEmail = this.updateEmail.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.submit = this.submit.bind(this);
  }

  submit(e){
    e.preventDefault();
    $.ajax({
      contentType: 'application/json',
      data: JSON.stringify(this.state),
      success: function(data){
        if (data.success){
          localStorage.setItem("token", data.token);
          localStorage.setItem("username", data.username);
          window.location.reload();
        }else{
          $("#signInError").css("display", "block");
          $("#messageSignInErr").html(data.error);
        }
      },
      error: function(data){
        $("#signInError").css("display", "block");
        $("#messageSignInErr").html(data.responseJSON.error);
      },
      processData: false,
      type: 'POST',
      url: '/ajax/sign_in'
    });
  }

  updateEmail(e){
    this.setState({email : e.target.value});
  }

  updatePassword(e){
    this.setState({password : e.target.value});
  }

  render(){
    return(
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Sign In</h3>
        </div>
        <form id="signInForm" onSubmit={this.submit}>
          <div className="form-group">
            <label htmlFor="Email">Email</label>
            <input value={this.state.email} onChange={this.updateEmail} className="form-control" type="email" name="su_email" required/>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input value={this.state.password} onChange={this.updatePassword} className="form-control" id="si_password" type="password" name="si_password" required pattern=".{6,}" title="6 characters minimum"/>
          </div>
          <br/><input className="btn btn-default" type="submit" value="Sign In"/>
        </form>
        <div id="signInError" className="alert alert-danger" style={{display: "none"}}>
          <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
          <span id="messageSignInErr"></span>
        </div>
      </div>
    );
  }
}

module.exports = SignInForm;
