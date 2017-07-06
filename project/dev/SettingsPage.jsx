import React, { Component } from "react";
import ReactDOM from "react-dom";

import ChangePasswordForm from "./components/ChangePasswordForm.jsx";
import SshKeyPanel from "./components/SshKeyPanel.jsx";

class SettingsPage extends Component{
  render(){
    return(
      <div>
        <ul className="nav nav-tabs">
          <li role="presentation" className="active"><a data-toggle="tab" href="#password">Change Password</a></li>
          <li role="presentation"><a data-toggle="tab" href="#ssh">SSH keys</a></li>
        </ul>
        <div className="tab-content" style={{margin: "10px"}}>
          <div id="password" className="tab-pane fade in active">
            <ChangePasswordForm/>
          </div>
          <div id="ssh" className="tab-pane fade">
            <SshKeyPanel/>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = SettingsPage;
