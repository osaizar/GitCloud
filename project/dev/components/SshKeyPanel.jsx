import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router";

import SshKeyList from "./SshKeyList.jsx";
import SshKeyForm from "./SshKeyForm.jsx";

class SshKeyPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      keys : [],
      found : false
    }

    this.getSSHKeys = this.getSSHKeys.bind(this);
    this.deleteSshKey = this.deleteSshKey.bind(this);
  }

  componentWillMount(){
    this.getSSHKeys();
  }

  getSSHKeys(){
    var that = this;
    $.ajax({
      headers : {
        "token" : localStorage.getItem("token")
      },
      success: function(data){
        if (data.success){
          that.setState({keys : data.keys, found : true});
        }else{
          that.setState({keys : "", found : false});
        }
      },
      error: function(data){
        console.log("error! "+JSON.stringify(data));
        that.setState({found : false});
      },
      processData: false,
      type: 'GET',
      url: '/ajax/get_user_keys'
    });
  }

  deleteSshKey(i){
    var that = this;
    $.ajax({
      contentType: 'application/json',
      headers:{
        "token" : localStorage.getItem("token")
      },
      data: JSON.stringify({
        "key" : that.state.keys[i]
      }),
      success: function(data){
        if (data.success){
          var keys = that.state.keys;
          keys.splice(i, 1);
          that.setState({"keys" : keys});
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
      url: '/ajax/remove_user_key'
    });
    this.getSSHKeys();
  }

  render(){
    if(this.state.found){
      return(
        <div>
          <div className="page-header">
            <SshKeyList keyList={this.state.keys} onDelete={this.deleteSshKey}/>
          </div>
          <SshKeyForm onAdd={this.getSSHKeys}/>
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

module.exports = SshKeyPanel;
