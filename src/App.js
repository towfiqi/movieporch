import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actionCreators from './actions/actionCreators';
import './App.css';


class App extends Component {

  render() {
    
    return (
      <div className="App">
        {this.props.children}
        {/* {React.cloneElement(this.props.children, this.props)} */}
      </div>

    );
  }
}


function mapStateToProps(state){
 return {
    boxOffice: state.boxOffice,
    categories: state.categories,
    topMovies: state.topMovies
 }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(actionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
