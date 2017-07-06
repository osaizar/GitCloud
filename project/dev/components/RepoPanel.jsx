import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router";


import RepoPanelItem from "./RepoPanelItem.jsx";

class RepoPanel extends Component {

  /*
  Props:
    user {username, email}
    repositories
    currentUser
    option (user or shared)
  */

  render() {
    var title;
    if (this.props.option == "shared"){
      title = (<h3 className="panel-title">Repositories shared with you:</h3>);
    }
    else if (this.props.currentUser == this.props.user.username){
      title = (<h3 className="panel-title">Your repositories <Link className="btn btn-default" to="/newRepository">New Repository</Link> </h3>);
    }else{
      title = (<h3 className="panel-title">{this.props.user.username+"'s repositories"}</h3>);
    }

    return(
      <div className="panel panel-default">
        <div className="panel-heading">
          {title}
        </div>
        <ul className="list-group">
          {
            this.props.repositories.map(function(repo, i){
              return (<RepoPanelItem key={i} repo={repo} />);
            })
          }
        </ul>
      </div>
    );
  }
}
module.exports = RepoPanel;
