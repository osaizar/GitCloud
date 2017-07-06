import React, {Component} from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, browserHistory } from 'react-router'


import IndexPage from "./IndexPage.jsx";
import UserPage from "./UserPage.jsx";
import NewRepoPage from "./NewRepoPage.jsx";
import RepoPage from "./RepoPage.jsx";
import ShowFilePage from "./ShowFilePage.jsx";
import ShowFolderPage from "./ShowFolderPage.jsx";
import SettingsPage from "./SettingsPage.jsx";
import RootPage from "./RootPage.jsx";

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={RootPage}>
      <IndexRoute component={IndexPage}/>
      <Route path="/newRepository" onEnter={checkLogged} component={NewRepoPage}/>
      <Route path="/settings" onEnter={checkLogged} component={SettingsPage}/>
      <Route path="/:username" component={UserPage}/>
      <Route path="/:username/:repository" component={RepoPage}/>
      <Route path="/:username/:repository/folder/*" component={ShowFolderPage}/>
      <Route path="/:username/:repository/file/*" component={ShowFilePage}/>
    </Route>
  </Router>
), document.getElementById("app"));

function checkLogged(nextState, replace, callback) {
  // if not logged RootPage should change token
  if (localStorage.getItem("token") == "undefined" ||  localStorage.getItem("token") == null){
    replace("/");
  }
  return callback();
}
