import React, { Component } from "react";
import ReactDOM from "react-dom";

import RepoHeader from "./components/RepoHeader.jsx"
import ShowFilePanel from "./components/ShowFilePanel.jsx"
import ErrorPanel from "./components/ErrorPanel.jsx";
import LoadingPanel from "./components/LoadingPanel.jsx";

class ShowFilePage extends Component{

  constructor(props){
    super(props);
    this.state = {
      fileContent: "",
      found : "loading"
    }
      this.getFileContent = this.getFileContent.bind(this);
  }

  componentWillMount(){
    this.getFileContent();
  }

  getFileContent(){
    var fileList = [];
    var that = this;
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
          that.setState({found : "true", fileContent : data.fcontent})
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
      url: '/ajax/get_file_content'
    });
  }

  render(){
    if (this.state.found == "loading"){
      return(
        <LoadingPanel/>
      );
    }
    if (this.state.found == "true"){
      return(
        <div>
          <RepoHeader owner={this.props.params.username} repoName={this.props.params.repository}/>
          <ShowFilePanel owner={this.props.params.username} repoName={this.props.params.repository} file={this.props.params.splat} fileContent={this.state.fileContent}/>
        </div>
      );
    }else{
      return(
        <ErrorPanel error={"The file "+this.props.params.splat+" doesn't exist"}/>
      );
    }
  }
}

module.exports = ShowFilePage;
