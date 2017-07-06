import React, { Component } from "react";
import ReactDOM from "react-dom";

import Navbar from "./components/Navbar.jsx";
import NewRepoForm from "./components/NewRepoForm.jsx";

class NewRepoPage extends Component {
  render(){
    return(
      <div>
        <NewRepoForm currentUser={localStorage.getItem("username")}/>
      </div>
    );
  }
}


module.exports = NewRepoPage;
