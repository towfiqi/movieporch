import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actionCreators from '../actions/actionCreators';
import MovieGrid from './MovieGrid';
import {chunk, get_genre_name} from '../helpers';
import jQuery from 'jquery';
import _ from 'lodash';
import Modal from './Modal';
import avatar from '../assets/user.png';
import step1img from '../assets/step1.jpg'
import step2img from '../assets/step2.jpg'
import step3img from '../assets/step3.jpg'
import step4img from '../assets/step4.jpg'
import step5img from '../assets/step5.jpg'

class MyMovies extends React.Component {
    constructor(){
        super();

        this.state= {myMovies:[], currentPage: 0, syncMessage: ''}
    }

    componentDidMount(){

        this.loadMovies(0);
        this.moviesThisYear();
        this.showHideTabs();
        window.setTimeout( ()=> {
            this.loadMovies(1);
        }, 1000)


        jQuery(window).scroll(() => {
            if (jQuery(window).scrollTop() == jQuery(document).height() - jQuery(window).height()) {
              if(this.state.myMovies.length < this.props.settings.allMovies.length){
                
                    this.loadMovies(this.state.currentPage + 1);

              }
            }
        });
    }

    componentWillReceiveProps(nextProps){

        if(nextProps.settings.moviesToSync.length === 0){
            this.setState({syncMessage: 'Your Movies Are Already Synced!'});
        }

        if(nextProps.settings.moviesToSync.length > 1){

            const moviesPending = nextProps.settings.moviesToSync;
            const allCurrentMovies = nextProps.settings.allMovies;
            
            moviesPending.map((movie, idx)=> {
                    this.props.clearSyncJob(idx);

                    this.synceUserMoveis(movie, idx, allCurrentMovies).then( (syncedMovies)=> {
                        const syncedState = [allCurrentMovies[idx], ...this.state.myMovies];
                        this.setState({myMovies: syncedState});
                    }).then( ()=> {
                        this.props.resetImportCounter();
                    }); 
                    
            });

        }

    }


    synceUserMoveis =(movie, idx, allCurrentMovies) => {
        var promise = new Promise((resolve, reject)=> {

             window.setTimeout(()=> {
                resolve(this.props.fetchUserMovies(movie.imdb, allCurrentMovies));
            }, 333 * idx);

        });

        return promise;
    }

    loadMovies = (index)=> {
        var myMovies = this.props.settings.allMovies || [];
        var chunked = chunk(myMovies, 40);
        var index = index === 0 ? index : this.state.currentPage + 1;
        //console.log(chunked[index]);
        if(myMovies.length > 0){
            var newMovies = [...this.state.myMovies, ...chunked[index]]
            this.setState({myMovies:newMovies, currentPage: index });
        }
        
    }

    handleSyncMovies = ()=> {
        var imdbid = this.props.settings.currentUser.imdbid ? this.props.settings.currentUser.imdbid : '';
        if(!imdbid){
            return
        }

        this.props.syncImdbMovies(imdbid);
        console.log('Sync Function Triggered!');

    }

    getUserGenre = ()=> {
        var myMovies = this.props.settings.allMovies || [];
        var allgenres = [];
        if(myMovies.length == 0){
            return undefined;
        }

        myMovies.map( (item)=> {
            var genres = item.genre_ids;
            if(!genres){
                return
            }
            genres.map( (genre)=> {
                return allgenres.push(genre);
            });
            
        });

        var sortedGenres = _.chain(allgenres).countBy().toPairs().sortBy(1).reverse().map(0).value();
        var GenresMovies = _.chain(allgenres).countBy().toPairs().sortBy(1).reverse().map(1).value();
        var userGenres =[ [sortedGenres[0], GenresMovies[0] ] , [sortedGenres[1], GenresMovies[1] ] ]

        //console.log('Sorted Array: ', userGenres );

        return userGenres;

    }

    showHideTabs = ()=> {
        jQuery('.steps_nav li').click(function(e){
            e.preventDefault();
            var tab_id = jQuery(this).find('a').attr('href');
    
            jQuery('.steps_nav li').removeClass('current');
            jQuery('.step').removeClass('current');
    
            jQuery(this).addClass('current');
            jQuery(tab_id).addClass('current');
        }) 
    }

    moviesThisYear = () =>{
        var myMovies = this.props.settings.allMovies || [];
        var currentYear = new Date().getFullYear();
        if(myMovies.length == 0){
            return 'No';
        }
        
        var moviesCount = myMovies.filter( (movie)=> {var movieYear = new Date(movie.created); return movieYear.getFullYear() === currentYear} )

        return moviesCount.length;

    }

    hideModal = (boolean)=> {
        if(boolean === true) {
            this.setState({syncMessage: ''});
        }
    }

    renderError =() => {

        return(
            <div className="ph_inner">
                <h2>Import Your Movies from IMDB</h2>
                <div className="import_steps">
                    <div className="steps_nav">
                        <ul>
                            <li className="current"><a href="#step1">Step 1</a></li>
                            <li><a href="#step2">Step 2</a></li>
                            <li><a href="#step3">Step 3</a></li>
                            <li><a href="#step4">Step 4</a></li>
                            <li><a href="#step5">Step 5</a></li>
                        </ul>
                    </div>
                    <div className="steps_wrap">
                        <div id="step1" className="step current">
                            <p>Go to <a target="_blank" href="https://www.imdb.com/">imdb.com</a> and then navigate to Your Profile > My Ratings.</p> 
                            <img alt="Step 1" src={step1img} />
                        </div>
                        <div id="step2" className="step">
                            <p>When you are in your Ratings page, Copy the IMDB User ID</p> 
                            <img alt="Step 2" src={step3img} />
                        </div>
                        <div id="step3" className="step">
                            <p>Then Make sure your Ratings List is Public.</p> 
                            <img alt="Step 3" src={step2img} />
                        </div>
                        <div id="step4" className="step">
                            <p>Now Scroll to the bottom of the Ratings List and click the "Export This list" link and you will recieve a "ratings.csv" file.</p> 
                            <img alt="Step 4" src={step4img} />
                        </div>
                        <div id="step5" className="step">
                            <p>Now go to Movie Porch <a target="_blank" href="http://localhost:3000/settings">Settings Page</a> and insert your IMDB user Id and select ratings.csv in respective Fields and click Save. Your Movies will be imported within a few Minutes.</p>
                            <img alt="Step 5" src={step5img} />
                        </div>
                    </div>
                </div>
            </div>
        );

    }

    renderUserContent = ()=> {
        if(this.props.settings.allMovies.length > 0){

            const ppimg = this.props.settings.currentUser.photo ? <img src={this.props.settings.currentUser.photo} /> : <img src={avatar} alt="" />;
            const ppname = this.props.settings.currentUser.name ? <span>{this.props.settings.currentUser.name}</span> : '';
            const movieCount = this.props.settings.allMovies ? this.props.settings.allMovies.length : '0';
            const myGenres = this.getUserGenre() || [];
            const genresLove = myGenres.length > 1 ? get_genre_name(parseInt(myGenres[0][0])) +' & '+ get_genre_name(parseInt(myGenres[1][0])): '??'; 
            const watchedthisYear = this.moviesThisYear() ? this.moviesThisYear() : 'No';
            
            return(
                <div className="ph_inner">
                    <div className="avatar">
                    <div className="pp_holder">
                        {ppimg}
                        
                    </div>
                    {ppname}

                    </div>

                    <h2>My Movies<a className="syncBtn" onClick={()=> this.handleSyncMovies()}><i className="lnr lnr-sync"></i></a></h2>

                    <div className="my_stats">
                        <ul>
                            <li><i className="lnr lnr-film-play"></i> {movieCount} Movies</li>
                            <li><i className="lnr lnr-heart"></i> {genresLove} Lover</li>
                            <li><i className="lnr lnr-clock"></i> {watchedthisYear} Movies Watched in 2017</li>
                        </ul>
                            
                    </div>
                </div>
            );
        }else{
            return this.renderError()
        }
    }

    render(){

        const theSyncMessage = this.state.syncMessage ? <p>{this.state.syncMessage}</p> : '';
        const visibility = this.state.syncMessage ? true : false;
        return(
            <div id="mymovies-page">
                <div className="page_wrap">
                    <div className="page_header">
                        
                        {this.renderUserContent()}
                        
                    </div>
                    

                    <MovieGrid id="my-movie-grid" title="" movies={this.state.myMovies || []} />
                </div>

                <Modal content={this.state.syncMessage} visible={visibility} hideModal={this.hideModal} /> 
                
            </div>


        );
    }
}

function mapStateToProps(state){
    return {
       settings: state.settings,
    }
   }
   
   function mapDispatchToProps(dispatch){
       return bindActionCreators(actionCreators, dispatch);
   }
   
export default connect(mapStateToProps, mapDispatchToProps)(MyMovies);