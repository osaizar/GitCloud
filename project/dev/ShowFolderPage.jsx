import React, { Component } from "react";
import ReactDOM from "react-dom";

import RepoHeader from "./components/RepoHeader.jsx"
import ShowFolderPanel from "./components/ShowFolderPanel.jsx"
import ErrorPanel from "./components/ErrorPanel.jsx";
import LoadingPanel from "./components/LoadingPanel.jsx";

class RepoFolderPage extends Component{

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
        "path" : that.props.params.splat,
        "repoName" : that.props.params.repository,
        "owner" : that.props.params.username
      }),
      success: function(data){
        if (data.success){
          data.files.map(function(file,i) {
            var url = "/"+that.props.params.username+"/"+that.props.params.repository+"/"+file.type+"/"+file.name;
            fileList.push({type : file.type, name : file.name, updated : "10 days ago", commit : "02100", url : url});
          });
          that.setState({found : "true", files : fileList});
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
    if (this.state.found == "loading"){
      return(
        <LoadingPanel/>
      );
    }else if (this.state.found == "true"){
      return(
        <div>
          <RepoHeader owner={this.props.params.username} repoName={this.props.params.repository} />
          <ShowFolderPanel files={this.state.files} owner={this.props.params.username} repoName={this.props.params.repository} path={this.props.params.splat}/>
        </div>
      );
    }else{
      return(
        <ErrorPanel error={"The path "+this.props.params.username+"/"+this.props.params.repository+"/"+this.props.params.splat+" doesn't exist"}/>
      );
    }
  }
}

module.exports = RepoFolderPage;
