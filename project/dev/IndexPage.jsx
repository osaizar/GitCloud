import React, { Component } from "react";
import ReactDOM from "react-dom";
//import { Router, Route, hashHistory } from 'react-router'

import Navbar from "./components/Navbar.jsx";

import RepoPanel from "./components/RepoPanel.jsx";

import SignInForm from "./components/SignInForm.jsx";
import SignUpForm from "./components/SignUpForm.jsx";

import LoadingPanel from "./components/LoadingPanel.jsx";


class IndexPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userRepoList : [],
      sharedRepoList: [],
      user : "",
      found : "loading"
    }

    this.getUser = this.getUser.bind(this);
    this.getSharedRepos = this.getSharedRepos.bind(this);
  }

  componentWillMount(){
    if (localStorage.getItem("token") != "undefined" && localStorage.getItem("token") != null){
      this.getUser();
      this.getSharedRepos();
    }
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
          user = {"username" : localStorage.getItem("username"), "email" : data.email}
          data.repositories.map(function(repo,i) {
            repoList.push({"name" : repo, "url" : user.username+"/"+repo, "updated" : "10 days ago"});
          });
          that.setState({userRepoList : repoList, user : user, found : "true"});
        }else{
          console.log("error! "+JSON.stringify(data));
          location.reload();
        }
      },
      error: function(data){
        console.log("request error! "+JSON.stringify(data));
        location.reload();
      },
      processData: false,
      type: 'GET',
      url: '/ajax/get_user/'+localStorage.getItem("username")
    });
  }

  getSharedRepos(){
    var repoList = [];
    var that = this;
    $.ajax({
      headers : {
        "token" : localStorage.getItem("token")
      },
      success: function(data){
        if (data.success){
          data.repositories.map(function(repo,i) {
            repoList.push({"name" : repo.owner+" / "+repo.name, "url" : repo.owner+"/"+repo.name, "updated" : "10 days ago"});
          });
          that.setState({sharedRepoList : repoList});
        }else{
          console.log("error! "+JSON.stringify(data));
          location.reload();
        }
      },
      error: function(data){
        location.reload();
      },
      processData: false,
      type: 'GET',
      url: '/ajax/get_repos_shared_to'
    });
  }

  render(){
    if(localStorage.getItem("token") != "undefined" && localStorage.getItem("token") != null){
      if(this.state.found == "loading"){
        return(
          <div>
            <LoadingPanel/>
          </div>
        );
      }else{
        return(
          <div>
            <RepoPanel option="user" user={this.state.user} currentUser={localStorage.getItem("username")} repositories={this.state.userRepoList}/>
            <RepoPanel option="shared" currentUser={localStorage.getItem("username")} repositories={this.state.sharedRepoList}/>
          </div>
        );
      }
    }else{
      return(
        <div>
          <div className="col-md-4 text-center">
            <img src="img/logo.png"/>
            <h2>Welcome To Git Cloud!</h2>
          </div>
          <div className="col-md-4">
            <SignUpForm/>
          </div>
          <div className="col-md-4">
            <SignInForm/>
          </div>
        </div>
      );
    }
  }
}

module.exports = IndexPage;
