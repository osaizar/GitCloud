import React, { Component } from "react";
import ReactDOM from "react-dom";

import {Link, browserHistory} from "react-router";

class NewRepoForm extends Component{

  /*
  Props:
    currentUser
  */

  constructor(props){
    super(props);
    this.state = {
      repoName : "",
      repoDesc : "",
      private : false
    };

    this.updateDesc = this.updateDesc.bind(this);
    this.updateName = this.updateName.bind(this);
    this.updateShare = this.updateShare.bind(this);
    this.submit = this.submit.bind(this);
  }

  checkRadio(){
    var share;
    if ($("#radioPub").prop("checked", true)){
      share = "public";
    }else if ($("#radioPriv").prop("checked", true)){
      share = "private"
    }else{
      $("#createRepoError").css("display", "block");
      $("#messageCreateRepoErr").html("Select Private or Public");
      share = false;
    }
  }

  submit(e){
    e.preventDefault();
    var that = this;
    $.ajax({
      contentType: 'application/json',
      data: JSON.stringify(this.state),
      headers : {
        "token" : localStorage.getItem("token")
      },
      success: function(data){
        if (data.success){
          browserHistory.push("/"+that.props.currentUser+"/"+that.state.repoName);
        }else{
          $("#createRepoError").css("display", "block");
          $("#messageCreateRepoErr").html(data.error);
        }
      },
      error: function(data){
        $("#createRepoError").css("display", "block");
        $("#messageCreateRepoErr").html(data.responseJSON.error);
      },
      processData: false,
      type: 'POST',
      url: '/ajax/create_repository'
    });
  }

  updateName(e){
    this.setState({repoName : e.target.value});
  }

  updateDesc(e){
    this.setState({repoDesc : e.target.value});
  }

  updateShare(e){
    var s = (e.target.value == "private");
    this.setState({private : s});
  }

  render(){
    return(
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">New Repository</h3>
        </div>
        <form id="newProjectForm" onSubmit={this.submit}>
          <div className="form-group">
            <label>Project Name</label>
            <div className="input-group">
              <span className="input-group-addon">gitcloud.com/{this.props.currentUser}/</span>
              <input value={this.state.name} onChange={this.updateName} className="form-control" type="text" name="p_name" required/>
            </div>
          </div>
          <div className="form-group">
            <label>Description (optional)</label>
            <textarea value={this.state.desc} onChange={this.updateDesc} className="form-control" id="p_desc" type="text-area" name="p_desc"/>
          </div>

          <div className="form-group">
            <label>Sharing</label>
            <div className="radio">
              <label>
                <input type="radio" value="public" checked={!this.state.private} onChange={this.updateShare}/>
                <span className="glyphicon glyphicon-resize-full"/> Public
              </label>
            </div>
            <div className="radio">
              <label>
                <input type="radio" value="private" checked={this.state.private} onChange={this.updateShare}/>
                <span className="glyphicon glyphicon-resize-small"/> Private
              </label>
            </div>
          </div>

          <Link className="btn btn-danger btn-md" to="/">Cancel</Link>
          <input className="btn btn-success btn-md pull-right" type="submit" value="Create"/>

        </form>
        <div id="createRepoError" className="alert alert-danger" style={{display: "none"}}>
          <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
          <span id="messageCreateRepoErr"></span>
        </div>
      </div>
    );
  }
}

module.exports = NewRepoForm;
