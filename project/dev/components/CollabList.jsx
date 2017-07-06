import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router";

import CollabListItem from "./CollabListItem.jsx";

class CollabList extends Component {

  /*
  Props:
    collList
    onDelete
  */

  constructor(props){
    super(props);
      this.allListItems = this.allListItems.bind(this);
  }

  allListItems(col, i){
    return (<CollabListItem key={i} index={i} collab={col} onDelete={this.props.onDelete}/>);
  }

  render(){
    return(
     <div>
      {
         this.props.collList.map(this.allListItems)
      }
    </div>
    );
  }
}

module.exports = CollabList;
