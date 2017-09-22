import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import _ from 'lodash';
import * as actionCreators from '../actions/actionCreators';
import MovieGrid from './MovieGrid';
const jQuery = require('jquery');
const Sly = require('@rq/sly-scrolling')(jQuery, window);


class BoxOffice extends Component {
  
  constructor(props){
    super(props);

    this.state = ({boFetched : false, boxOffice: [] });
  }


  componentWillMount(){

    document.title = 'Movie Proch - Box Office';

    if(this.props.boxOffice.count < 60){
        const query = `movie/now_playing?language=en-EN`;
        this.props.fetchData(query, 1).then( ()=> {
        // console.log('Second page loading?');
          return this.props.fetchData(query, 2);
          
        }).then( ()=> {
          return this.props.fetchData(query, 3);
        }).then( ()=> {
          this.callSly();


          if ( navigator.userAgent.match(/Mobi/) ) {
            // We are in a mobile device
            console.log('Is Mobile!', "https://image.tmdb.org/t/p/w300/"+this.props.boxOffice.actionMovies[0].poster_path);
            //jQuery('#root').addClass('Mobile').css('background-image', 'url(https://image.tmdb.org/t/p/w300/' + this.props.boxOffice.actionMovies[0].poster_path + ')');
          }

        });
    }
  }


  componentDidMount(){

    if(this.props.boxOffice.count > 50){
      this.callSly();
    }


    
  }

  callSly = () => {

    //SLY Options
    var options = { horizontal: 1, itemNav: 'basic', smart: 1, activateOn: 'click', mouseDragging: 1, touchDragging: 1, releaseSwing: 1, 
    startAt: 0, scrollBy: 0, activatePageOn: 'click', speed: 300,  elasticBounds: 1, dragHandle: 1, dynamicHandle: 1, clickBar: 1, };

    var Heroptions = { horizontal: 1, activateOn: 'click',itemNav: 'forceCentered', smart: 1, activateMiddle: 1, mouseDragging: 1,
    touchDragging: 1, releaseSwing: 1, moveBy: 600, startAt: 1, scrollBy: 0, activatePageOn: 'click',speed: 300, elasticBounds: 1,
    dragHandle: 1, dynamicHandle: 1, clickBar: 1,};
    
    const topMovSly = jQuery('#box-topMovies .movie-grid-inner');

    const actionSly = new Sly('#box-action .movie-grid-inner', options).init();
    new Sly('#box-drama .movie-grid-inner', options).init();
    new Sly('#box-comedy .movie-grid-inner', options).init();
    new Sly('#box-horror .movie-grid-inner', options).init();
    new Sly('#box-fantasy .movie-grid-inner', options).init();
    new Sly('#box-rommantic .movie-grid-inner', options).init();
    
      if(navigator.userAgent.match(/Mobi/)){
        actionSly.on('moveEnd', function(){
          console.log(jQuery('#box-action .movie.active').find('.movie-item-wrap img').attr('src'));
          
          //jQuery('.mobileBg img').attr('src', `https://image.tmdb.org/t/p/w300/${this.props.boxOffice.actionMovies[0].poster_path}`)
        });
      }
      var topFrame = new Sly(topMovSly, Heroptions, {load: topMovSly.addClass('sly')});
      var heroImg = jQuery('.hero_header img');
      topFrame.on('active', function(){ 
        heroImg.attr('src', topMovSly.find('.active > img').attr('src'));
        heroImg.fadeOut(0).delay(100).fadeIn(200);
      });
      topFrame.init();

    
  }

  renderMovies = (movies, title, id)=> {

    //console.log(movies);

    return <MovieGrid id={id} title={title} movies={movies || []} />
  }


  render() {
    const mobileBG = navigator.userAgent.match(/Mobi/) && this.props.boxOffice.actionMovies.length > 1 ? <div className="mobileBg"><img src={`https://image.tmdb.org/t/p/w300/${this.props.boxOffice.actionMovies[0].poster_path}`} /></div> : '';
    const topBoMovies = this.props.boxOffice.allMovies.slice(0, 10);
   
    return (
      <div className="BoxOffice">
          <div id="boxoffice_head">
            <MovieGrid id="box-topMovies" title="" movies={topBoMovies || [] } slider={true} />
          </div>
          <div className="boxoffice_content">
              {this.renderMovies(this.props.boxOffice.actionMovies, 'ACTION MOVIES', 'box-action')}
              {this.renderMovies(this.props.boxOffice.comedyMovies, 'COMEDY MOVIES', 'box-comedy')}
              {this.renderMovies(this.props.boxOffice.dramaMovies, 'DRAMA MOVIES', 'box-drama')}
              {this.renderMovies(this.props.boxOffice.rommanceMovies, 'ROMMANTIC MOVIES', 'box-rommantic')}
              {this.renderMovies(this.props.boxOffice.horrorMovies, 'HORROR MOVIES', 'box-horror')}
              {this.renderMovies(this.props.boxOffice.fantasyMovies, 'FANTASY MOVIES', 'box-fantasy')}
              {mobileBG}
          </div>
      </div>

    );
  }
}



function mapStateToProps(state){
  return {
     boxOffice: state.boxOffice,
     settings: state.settings
  }
 }
 
 function mapDispatchToProps(dispatch){
     return bindActionCreators(actionCreators, dispatch);
 }
 
 export default connect(mapStateToProps, mapDispatchToProps)(BoxOffice);