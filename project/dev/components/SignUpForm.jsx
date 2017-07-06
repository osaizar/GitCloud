import React, { Component } from "react";
import ReactDOM from "react-dom";

// TODO: Clear form after success

class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username : '',
      email : '',
      password : '',
      rePassword : ''
    };

    this.updateUsername = this.updateUsername.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.updateRePassword = this.updateRePassword.bind(this);
    this.submit = this.submit.bind(this);
  }

  submit(e){
    e.preventDefault();
    if (this.state.password != this.state.rePassword){
      $("#signUpSuccess").css("display", "none");
      $("#signUpError").css("display", "block");
      $("#messageSignUpErr").html("Passwords do not match");
    }else{
      $.ajax({
        contentType: 'application/json',
        data: JSON.stringify(this.state),
        success: function(data){
          if (data.success){
            $("#signUpSuccess").css("display", "block");
            $("#signUpError").css("display", "none");
            $("#messageSignUpSucc").html(data.message);
            $("#signUpForm").trigger("reset");
          }else {
            $("#signUpSuccess").css("display", "none");
            $("#signUpError").css("display", "block");
            $("#messageSignUpErr").html(data.error);
          }
        },
        error: function(data){
          $("#signUpSuccess").css("display", "none");
          $("#signUpError").css("display", "block");
          $("#messageSignUpErr").html(data.responseJSON.error);
        },
        processData: false,
        type: 'POST',
        url: '/ajax/sign_up'
      });
    }
  }

  updateUsername(e){
    this.setState({username : e.target.value});
  }

  updateEmail(e){
    this.setState({email : e.target.value});
  }

  updatePassword(e){
    this.setState({password : e.target.value});
  }

  updateRePassword(e){
    this.setState({rePassword : e.target.value});
  }

  render(){
    return(
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Sign Up</h3>
        </div>
        <form id="signUpForm" onSubmit={this.submit}>
          <div className="form-group">
            <label htmlFor="Username">Username</label>
            <input value={this.state.username} onChange={this.updateUsername} className="form-control" name="su_username" required/>
          </div>
          <div className="form-group">
            <label htmlFor="Email">Email</label>
            <input value={this.state.email} onChange={this.updateEmail} className="form-control" type="email" name="su_email" required/>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input value={this.state.password} onChange={this.updatePassword} className="form-control" id="su_password" type="password" name="su_password" required pattern=".{6,}" title="6 characters minimum"/>
          </div>
          <div className="form-group">
            <label htmlFor="Rpassword">Repeat Password</label>
            <input value={this.state.rePassword} onChange={this.updateRePassword} className="form-control" id="su_rpassword" type="password" name="su_rpassword" required/>
          </div>
          <br/><input className="btn btn-default" type="submit" value="Sign Up"/>
        </form>
        <div id="signUpError" className="alert alert-danger" style={{display: "none"}}>
          <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
          <span id="messageSignUpErr"></span>
        </div>
        <div id="signUpSuccess" className="alert alert-success" style={{display: "none"}}>
          <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
          <span id="messageSignUpSucc"></span>
        </div>
      </div>
    );
  }
}

module.exports = SignUpForm;
