import React, { Component } from "react";
import ReactDOM from "react-dom";

import RepoHeader from "./components/RepoHeader.jsx"
import RepoFilePanel from "./components/RepoFilePanel.jsx"
import CollabPanel from "./components/CollabPanel.jsx"
import ErrorPanel from "./components/ErrorPanel.jsx";
import LoadingPanel from "./components/LoadingPanel.jsx";

class RepoPage extends Component{

  constructor(props){
    super(props);
    this.state = {
      files: [],
      found : "loading"
    }
      this.getRepoFiles = this.getRepoFiles.bind(this);
  }

  componentWillMount(){
    this.getRepoFiles();
  }

  getRepoFiles(){
    var fileList = [];
    var that = this;
    var user;
    $.ajax({
      headers : {
        "token" : localStorage.getItem("token")
      },
      contentType : 'application/json',
      data : JSON.stringify({
        "path" : "/",
        "repoName" : that.props.params.repository,
        "owner" : that.props.params.username
      }),
      success: function(data){
        if (data.success){
          data.files.map(function(file,i) {
            var url = "/"+that.props.params.username+"/"+that.props.params.repository+"/"+file.type+"/"+file.name;
            fileList.push({type : file.type, name : file.name, updated : "10 days ago", commit : "02100", url : url});
          });
          that.setState({files : fileList, found : "true"});
        }else{
          that.setState({found : "false"});
        }
      },
      error: function(data){
        console.log("error! "+JSON.stringify(data));
        that.setState({found : "false"});
      },
      processData: false,
      type: 'POST',
      url: '/ajax/get_repository_files'
    });
  }

  render(){
    if(this.state.found == "loading"){
      return(
        <LoadingPanel/>
      );
    }else if (this.state.found == "true"){
      var colClass = "";
      var colData = "tab";
      if (localStorage.getItem("username") != this.props.params.username){
        colClass = "disabled";
        colData = "";
      }

      return(
        <div>
          <RepoHeader owner={this.props.params.username} repoName={this.props.params.repository}/>
          <ul className="nav nav-tabs">
            <li role="presentation" className="active"><a data-toggle="tab" href="#files">Files</a></li>
            <li role="presentation" className={colClass}><a data-toggle={colData} href="#collaborators">Collaborators</a></li>
          </ul>
          <div className="tab-content" style={{margin: "10px"}}>
            <div id="files" className="tab-pane fade in active">
              <RepoFilePanel files={this.state.files} commit="10001"/>
            </div>
            <div id="collaborators" className="tab-pane fade">
              <CollabPanel owner={this.props.params.username} repoName={this.props.params.repository}/>
            </div>
          </div>
        </div>
      );
    }else{
      return(
        <ErrorPanel error={"The repository "+this.props.params.username+"/"+this.props.params.repository+" doesn't exist"}/>
      );
    }
  }
}

module.exports = RepoPage;
