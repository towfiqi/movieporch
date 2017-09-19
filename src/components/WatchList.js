import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actionCreators from '../actions/actionCreators';
import MovieGrid from './MovieGrid';
const jQuery = require('jquery');
const Sly = require('@rq/sly-scrolling')(jQuery, window);

class WatchList extends React.Component {
    constructor(){
        super();
        this.watchSly = {}
    }

    componentDidMount(){

        var slyoptions = { horizontal: 1, itemNav: 'basic', smart: 1, activateOn: 'click', mouseDragging: 1, touchDragging: 1, releaseSwing: 1, 
        startAt: 0, scrollBy: 0, activatePageOn: 'click', speed: 300,  elasticBounds: 1, dragHandle: 1, dynamicHandle: 1, clickBar: 1, };
   

                this.watchSly = new Sly('#movie-watchlist .movie-grid-inner', slyoptions).init();

    }

    componentDidUpdate(prevProps, prevState){
        this.watchSly.reload();
    }

    renderMovies = ()=> {
        var movies = this.props.watchList.watching || [];
        
        return <MovieGrid id="movie-watchlist" title="" movies={movies} />
    }

    render(){

        const addMessage = this.props.watchList.watching.length === 0 ?<div className="wlmessage"><p>Click the <i className="lnr lnr-heart"></i> button to add Movies to your Watchlist!</p></div>: '';
        const count = this.props.watchList.watching.length > 0 ? <span>{this.props.watchList.watching.length}</span> : '';
        return(
            <div id="watchlist">



                <h3 className="watch-title">Watchlist {count}</h3>
                {addMessage}

                <div className="watchlist-wrap">
                    {this.renderMovies()}
                </div>
                
            </div>
        );
    }
        
    
}

function mapStateToProps(state){
    return {
       settings: state.settings,
       watchList: state.watchList,
    }
   }

   function mapDispatchToProps(dispatch){
    return bindActionCreators(actionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(WatchList);

