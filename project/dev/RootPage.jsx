import React, {Component} from "react";
import ReactDOM from "react-dom";

import Navbar from "./components/Navbar.jsx";

class RootPage extends Component{
  constructor(props) {
    super(props);
    this.state = {
      logged : false,
      username : ""
    }
    this.getCurrentUser = this.getCurrentUser.bind(this);
  }

  componentWillMount(){
    if (localStorage.getItem("token") != "undefined" && localStorage.getItem("token") != null){
      this.getCurrentUser();
    }else{
      localStorage.setItem("username", "undefined");
    }
  }

  getCurrentUser(){
    var that = this;
    $.ajax({
      headers : {
        "token" : localStorage.getItem("token")
      },
      success: function(data){
        if(data.success){
          localStorage.setItem("username", data.username);
          that.setState({logged : true, username: data.username});
        }else{
          localStorage.setItem("token", "undefined");
          localStorage.setItem("username", "undefined");
          that.setState({logged : false, username: ""});
        }
      },
      error: function(data){
        console.log("error! "+JSON.stringify(data));
      },
      processData: false,
      type: 'GET',
      url: '/ajax/get_current_user'
    });
  }

  render(){
    return(
      <div>
        <Navbar logged={this.state.logged} currentUser={this.state.username}/>
        <div className="container">
          {this.props.children}
        </div>
      </div>
    );
  }
}

module.exports = RootPage;
