import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actionCreators from '../actions/actionCreators';
import MovieGrid from './MovieGrid';
import axios from 'axios';
import {tmdbkey} from '../keys';
import Modal from './Modal';
import YouTubePlayer from 'youtube-player';
import Perf from 'react-addons-perf'; /// REMOVE IN PROD-----------


const jQuery = require('jquery');
const Sly = require('@rq/sly-scrolling')(jQuery, window);
if(typeof window !== undefined){
    window.Perf = Perf;
}

class Trailers extends React.Component {

    constructor(props){
        super(props);
    
        this.state = {theater : [], upcomming: [], backdrop:'', trailers:[], trailerLoading: false, trailerMessage: '' };
        this.renderMovies = this.renderMovies.bind(this);
        this.player = {}
        this.slyOptions = { horizontal: 1, itemNav: 'basic', smart: 1, activateOn: 'click', mouseDragging: 1, touchDragging: 1, releaseSwing: 1, 
        startAt: 0, scrollBy: 0, activatePageOn: 'click', speed: 300,  elasticBounds: 1, dragHandle: 1, dynamicHandle: 1, clickBar: 1, };
        this.theaterSly = {}
        this.trailerSly = {}
        this.upcommingSly = {}
    }
    


    componentWillMount(){
        
        if(this.props.boxOffice.count < 60){
            console.log('Fetching again!');
            const query = `movie/now_playing?language=en-EN`;
            this.props.fetchData(query, 1).then( ()=> {
            // console.log('Second page loading?');
                return this.props.fetchData(query, 2);
                
            }).then( ()=> {
                var  movies = [...this.props.boxOffice.actionMovies, ...this.props.boxOffice.horrorMovies, ...this.props.boxOffice.comedyMovies, ...this.props.boxOffice.dramaMovies]                
                this.setState({theater: movies});
            }).then(()=> {
                var movieID = this.state.theater[0].id;
                this.fetchTrailer(movieID,true);

            });
        }else{
            if(this.state.theater.length > 10){
                return
            }
            var  movies = [...this.props.boxOffice.actionMovies, ...this.props.boxOffice.horrorMovies, ...this.props.boxOffice.comedyMovies, ...this.props.boxOffice.dramaMovies]                
            this.setState({theater: movies}, ()=> {
                var movieID = this.state.theater[0].id;
                this.fetchTrailer(movieID,true);
            });           
        }

    }

    componentDidMount(){


        setImmediate( ()=> {   Perf.start();  });
        setTimeout( ()=> {  Perf.stop();   Perf.printWasted();   },5000);
        
        this.player =YouTubePlayer('video-player', { 
            videoId: '',
            playerVars: {  'html5': 1, 'rel': 0, 'autoplay': 0,'enablejsapi': 1, 'suggestedQuality': 'hd720','wmode': 'transparent'}
        });
        this.handleMovieClick();
        this.theaterSly = new Sly('#box-theater .movie-grid-inner', this.slyOptions).init();
        this.trailerSly = new Sly('.trailer-panels-inner', this.slyOptions).init();
        this.upcommingSly = new Sly('#box-upcomming .movie-grid-inner', this.slyOptions, { load: ()=> { jQuery('#box-upcomming').addClass('slyActive');}})
        
        this.player.on('stateChange', (event) => {
            //Show the All Trailers after video enede Loading
            if(event.data === 0){
                jQuery('.trailer-panels').removeClass('hide');
            }
        });
    }

    fetchTrailer = (movieID, sly)=> {
        axios.get(`https://api.themoviedb.org/3/movie/${movieID}/videos?api_key=${tmdbkey}&language=en-US`).then( (results)=> {
            
            //console.log('Movie Result:', results.data);
            if(results.data.results.length > 0){
                console.log('Movie Result:', results.data.results);
                this.player.loadVideoById(results.data.results[0].key);
                if(sly=== true){
                    this.theaterSly.reload();
                }
                return this.setState({backdrop: results.data.results[0].key, trailers:results.data.results}, ()=> {
                    this.trailerSly.reload();
                    jQuery('.trailer-thumb').removeClass('active');
                    jQuery('.trailer-thumb:eq(0)').addClass('active');
                    jQuery('.trailer-panels').removeClass('hide'); 
                    setTimeout( ()=> {  jQuery('.trailer-panels').addClass('hide');  }, 3000);
                    
                });
            }else{
                //console.log('No Trailers Found for this movie!');
                this.setState({trailerMessage: 'No Trailers Found for this movie!'});
            }

        });
    }



    renderMovies = (type,id)=> {
        //console.log(movies, this.props,this.props.boxOffice.allMoives);
        var movies;
        if(type === 'upcomming'){
            movies= this.state.upcomming || [];
        }else{
            movies= this.state.theater || [];
        }
        return <MovieGrid id={id} title="" movies={movies} trailer={true} />
    }


    handleTrailerClick = (event)=> {
        //console.log(event.target);
        var clickedElm = event.target;
        var videoKey = clickedElm.getAttribute("data-id");
        this.player.loadVideoById(videoKey);
        console.log(videoKey);
        this.setState({backdrop:videoKey});
        jQuery('.trailer-thumb').removeClass('active');
        jQuery('.trailer-thumb img[data-id="'+videoKey+'"]').parent().addClass('active');
    }

    handleMovieClick = ()=> {
        document.addEventListener("click", (e)=>{
            if(e.target.parentNode.className === "trailer-button"){
                //console.log('Match!');
                //console.log(e.target.parentNode.dataset.id);
                this.fetchTrailer(e.target.parentNode.dataset.id);
            }
        });
    }

    handleTrailerPanelClick = (e)=> {
            if(jQuery('.trailer-panels').hasClass('hide')){
                jQuery('.trailer-panels').removeClass('hide');
                jQuery('.trailer-panel-trigger i').removeClass('lnr-chevron-up').addClass('lnr-chevron-down');
            }else{
                jQuery('.trailer-panels').addClass('hide');
                jQuery('.trailer-panel-trigger i').removeClass('lnr-chevron-down').addClass('lnr-chevron-up');
            }
    }

    handleMoveTypeClick = (fetchUpcomming) => {
        if(fetchUpcomming === true){
            if(this.state.upcomming.length < 40){
                const date = new Date();
                let currentMonth = date.getMonth() + 1;  currentMonth = currentMonth < 10 ? Number("0"+currentMonth) : currentMonth;
                const currentDay = date.getDate();
                const currentYear = date.getFullYear();

                const futureYear = currentMonth > 9 ? currentYear + 1 : currentYear;
                const futureMonth = currentMonth > 9 ? (currentMonth + 3) - 12 : currentMonth + 3;

                const dateFrom = `${currentYear}-${currentMonth}-${currentDay}`
                const dateTo = `${futureYear}-${futureMonth}-1`

                jQuery('.movie-nav-box ul li').removeClass('current'); jQuery('.movie-nav-box ul li:eq(1)').addClass('current');
                jQuery('#box-theater').fadeOut(300); jQuery('#box-upcomming').delay(300).fadeIn(300);


                axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${tmdbkey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=${dateFrom}&primary_release_date.lte=${dateTo}`).then( (results)=> {
                    if(results.data){
                        const upcommingMovies = results.data.results.filter( (movie)=> { return movie.poster_path });

                        this.setState({upcomming: upcommingMovies});
                        
                        axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${tmdbkey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=${dateFrom}&primary_release_date.lte=${dateTo}`).then( (results)=> {
                            
                            const upcommingMoviesSec = results.data.results.filter( (movie)=> { return movie.poster_path });
                            const allUpcomming =  [...this.state.upcomming, ...upcommingMoviesSec]
                            
                            this.setState({upcomming: allUpcomming}, ()=> {
                                if(!jQuery('#box-upcomming').hasClass('slyActive')){
                                    this.upcommingSly.init();
                                }
                                
                            });
                        });
                    }
                    
                });
            }
        }else{
            jQuery('.movie-nav-box ul li').removeClass('current'); jQuery('.movie-nav-box ul li:eq(0)').addClass('current');
            jQuery('#box-upcomming').fadeOut(300); jQuery('#box-theater').delay(300).fadeIn(300);
        }
    }

    hideModal = (boolean)=> {
        if(boolean === true) {
            this.setState({trailerMessage: ''});
        }
    }


    renderTrailers = () => {
        const trailers = this.state.trailers;

        return trailers.map( (trailer, index)=> {
            return <div className="trailer-thumb" onClick={(event)=> this.handleTrailerClick(event)} key={index}><img data-id={trailer.key}  src={`https://img.youtube.com/vi/${trailer.key}/default.jpg`} alt="" /></div>
        })
    }

    render(){
        const backdrop = this.state.backdrop ? `https://img.youtube.com/vi/${this.state.backdrop}/sddefault.jpg` : ''; 
        const trailerMessage = this.state.trailerMessage ? <p>{this.state.trailerMessage}</p> : '';
        const visibility = this.state.trailerMessage ? true : false;

        return(
            <div id="trailers-page">

                <div className="page_wrap">

                    <div className="trailer-box">
                        <div className="trailer-box-inner">
                            <div className="trailer-video">
                                <div className="video-container"><div id="video-player"></div></div>
                            </div>
                            <div className="trailer-panels">
                                <div className="trailer-panel-trigger" onClick={(event)=> this.handleTrailerPanelClick(event)} ><i className="lnr lnr-chevron-up"></i></div>
                                <div className="trailer-panels-inner">
                                    <div className="trailer-thumbs">
                                        {this.renderTrailers()}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="trailer-backdrop"><div className="coveroverlay"></div><img alt="" src={backdrop} /></div>
                    </div>

                    

                    <div className="movie-nav-box">
                        <ul>
                            <li className="current"><a onClick={(event)=> this.handleMoveTypeClick(false)}>In Theater</a></li>
                            <li><a onClick={(event)=> this.handleMoveTypeClick(true)}>Upcomming</a></li>
                        </ul>

                    {this.renderMovies('theater','box-theater')}
                    {this.renderMovies('upcomming','box-upcomming')}

                    </div>

                </div>
                <Modal content={trailerMessage} visible={visibility} hideModal={this.hideModal} />  
            </div>
        );
    }
}


function mapStateToProps(state){
    return {
        boxOffice: state.boxOffice,
        settings: state.settings,
    }
   }
   
   function mapDispatchToProps(dispatch){
       return bindActionCreators(actionCreators, dispatch);
   }
   
export default connect(mapStateToProps, mapDispatchToProps)(Trailers);