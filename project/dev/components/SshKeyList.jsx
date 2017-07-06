import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router";

import SshKeyListItem from "./SshKeyListItem.jsx";

class SshKeyList extends Component {

  /*
  Props:
    keyList
    onDelete
  */

  constructor(props){
    super(props);
      this.allListItems = this.allListItems.bind(this);
  }

  allListItems(sshkey, i){
    return (<SshKeyListItem key={i} index={i} sshkey={sshkey} onDelete={this.props.onDelete}/>);
  }

  render(){
    return(
      <div>
        {
          this.props.keyList.map(this.allListItems)
        }
      </div>
    );
  }
}

module.exports = SshKeyList;
