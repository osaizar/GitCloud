import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router";

import RepoPanelItem from "./RepoPanelItem.jsx";

class Navbar extends Component {

  /*
  Props:
    logged
    currentUser
  */

  constructor(props) {
    super(props);
    this.state = {
      "repo" : "",
      "repositories" : []
    };
    this.signOut = this.signOut.bind(this);
    this.updateRepo = this.updateRepo.bind(this);
    this.searchRepo = this.searchRepo.bind(this);
  }

  updateRepo(e){
    this.setState({repo : e.target.value});
    if (e.target.value.length > 2){
      this.searchRepo();
    }
  }

  signOut(){
    $.ajax({
      contentType: 'application/json',
      headers : {
        "token" : localStorage.getItem("token")
      },
      success: function(data){
        if (data.success){
          localStorage.setItem("token", "undefined");
          localStorage.setItem("username", "undefined");
          location.reload();
        }else{
          location.reload();
        }
      },
      error: function(data){
        location.reload();
      },
      processData: false,
      type: 'GET',
      url: '/ajax/sign_out'
    });
  }

  searchRepo(){
    var repoList = [];
    var that = this;
    $.ajax({
      contentType : 'application/json',
      data: JSON.stringify({
        "repo" : that.state.repo
      }),
      success: function(data){
        if (data.success){
          data.repositories.map(function(repo,i) {
            repoList.push({"name" : repo.owner+" / "+repo.name, "url" : "/"+repo.owner+"/"+repo.name, "updated" : "10 days ago"});
          });
          that.setState({repositories : repoList});
        }else{
          console.log("error! "+JSON.stringify(data));
        }
      },
      error: function(data){
        that.setState({found : false});
      },
      processData: false,
      type: 'POST',
      url: '/ajax/search_repository'
    });
  }

  render() {
    if (this.props.logged){
      return (
        <nav className="navbar navbar-inverse">
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <Link className="navbar-brand" to="/">Git Cloud</Link>
            </div>
            <div className="navbar-collapse collapse">
              <div className="navbar-form navbar-left">
                  <input type="text" className="form-control" placeholder="Search Repository" value={this.state.repo} onChange={this.updateRepo}/>
                  <ul>
                    {
                      this.state.repositories.map(function(repo, i){
                        return (<RepoPanelItem key={i} repo={repo} />);
                      })
                    }
                  </ul>
              </div>
                <ul className="nav navbar-nav navbar-right">
                  <li className="dropdown">
                    <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><span className="glyphicon glyphicon-plus" aria-hidden="true"> </span><span className="caret"></span></a>
                    <ul className="dropdown-menu">
                      <li><Link to="/newRepository">New Repository</Link></li>
                    </ul>
                  </li>
                  <li className="dropdown">
                    <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{this.props.currentUser} <span className="caret"></span></a>
                    <ul className="dropdown-menu">
                      <li><Link to="/settings">Settings</Link></li>
                      <li role="separator" className="divider"></li>
                      <li><Link to="/" onClick={this.signOut}>Sign Out</Link></li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
      );
    }else{
      return (
        <nav className="navbar navbar-inverse">
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <Link className="navbar-brand" to="/">Git Cloud</Link>
            </div>
            <div className="navbar-collapse collapse">
              <div className="navbar-form navbar-left">
                  <input type="text" className="form-control" placeholder="Search Repository" value={this.state.repo} onChange={this.updateRepo}/>
                    <ul>
                      {
                        this.state.repositories.map(function(repo, i){
                          return (<RepoPanelItem key={i} repo={repo} />);
                        })
                      }
                    </ul>
              </div>
              <ul className="nav navbar-nav navbar-right">
                <li><Link to="/">Sign In</Link></li>
              </ul>
            </div>
          </div>
        </nav>
      );
    }
  }
}

module.exports = Navbar;
