import React, { Component } from "react";
import ReactDOM from "react-dom";

import RepoPanel from "./components/RepoPanel.jsx";
import UserHeader from "./components/UserHeader.jsx";
import ErrorPanel from "./components/ErrorPanel.jsx";
import LoadingPanel from "./components/LoadingPanel.jsx";


class UserPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      repositories : [],
      found : "loading",
      user : ""
    }

    this.getUser = this.getUser.bind(this);
  }

  componentWillMount(){
    this.getUser();
  }

  getUser(){
    var repoList = [];
    var user;
    var that = this;
    $.ajax({
      headers : {
        "token" : localStorage.getItem("token")
      },
      success: function(data){
        if (data.success){
          data.repositories.map(function(repo,i) {
            repoList.push({"name" : repo, "url" : "/"+that.props.params.username+"/"+repo, "updated" : "10 days ago"});
          });
          user = {"username" : that.props.params.username, "email" : data.email}
          that.setState({repositories : repoList, found : "true", user : user});
        }else{
          that.setState({found : "false"});
          console.log("error! "+JSON.stringify(data));
        }
      },
      error: function(data){
        that.setState({found : "false"});
      },
      processData: false,
      type: 'GET',
      url: '/ajax/get_user/'+that.props.params.username
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
          <UserHeader user={this.state.user}/>
          <RepoPanel user={this.state.user} currentUser={localStorage.getItem("username")} repositories={this.state.repositories} option={"user"}/>
        </div>
      );
    }else{
      return(
        <ErrorPanel error={"The user "+this.props.params.username+" doesn't exist"} />
      );
    }
  }
}

module.exports = UserPage;
