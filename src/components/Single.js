import React from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {getMonth, formatDate, truncString} from '../helpers';
import {tmdbkey} from '../keys'
import ISO6391 from 'iso-639-1';
import MovieGrid from './MovieGrid';
import Modal from './Modal';
import {Link} from 'react-router-dom';
import {TopscrollTo} from '../helpers'
const jQuery = require('jquery');
const Sly = require('@rq/sly-scrolling')(jQuery, window);


class Single extends React.Component {

    constructor(){
        super();

        this.state = {
            title:'', id:'', 
            backdrop_path: '', 
            poster_path: '',
            status: '', 
            release_date: '', 
            runtime: '',
            homepage: '',
            original_language: 'en',
            budget:'',
            revenue: '',
            content_rating: 'PG-13',
            recommendations: [],
            actors: [],
            directors: [],
            writers: [],
            trailer: [],
            myrating: '',
            rated_on: '',
            show_full_overview: false
        }
    }

    componentWillMount(){
        
        window.scrollTo(0, 0);
        this.fetchMovieData(this.props.match.params.movieID);
       
    }


    fetchUserRating = (movieId)=> {
        //Check and see if the User Rated this Movie. If did, assign the rating to state
        const allMovies = this.props.settings.allMovies || [];
        
            allMovies.forEach((item)=>{
                if(item.id === movieId){
                    var rated_on = formatDate(item.created, true);
                    this.setState({myrating:item.myrating, rated_on: rated_on})
                }
            });
        
    }


    componentWillReceiveProps(nextProps){
        if (nextProps.match.params.movieID !== this.props.match.params.movieID) {
            //console.log('Not Same!');
            this.setState({myrating:''});
            this.fetchMovieData(nextProps.match.params.movieID);
            //Scroll toTop
            TopscrollTo();
            this.callSly(true);

            console.log('Movie props Loaded!');
        }
        console.log('####THE PROPS:',nextProps);

    }


    callSly = (reload) => {
        //console.log('@@@### BEFORE: Movie Recommendations Loaded!!');

        if(this.state.recommendations.length > 0){
            //console.log('Movie Recommendations Loaded!!');
            //SLY Options
            var options = { horizontal: 1, itemNav: 'basic', smart: 1, activateOn: 'click', mouseDragging: 1, touchDragging: 1, releaseSwing: 1, 
            startAt: 0, scrollBy: 0, activatePageOn: 'click', speed: 300,  elasticBounds: 1, dragHandle: 1, dynamicHandle: 1, clickBar: 1, };
                     
            const recommedSLy = new Sly('#recommended-movies .movie-grid-inner', options)

            if(reload === true){
                recommedSLy.destroy();
            }else{
                recommedSLy.init();
            }

        }

    }

    fetchMovieData = (movieID) => {

        //const movieID = this.props.match.params.movieID;
        const year = this.state.release_date.split('-')[0];

        const request = axios.get(`https://api.themoviedb.org/3/movie/${movieID}?api_key=${tmdbkey}&language=en-US`).then(( results)=> { 
            console.log(results.data);
            this.setState(results.data);

            this.fetchUserRating(this.state.id);


        }).then( (results)=> {
            const recommendation = axios.get(`https://api.themoviedb.org/3/movie/${movieID}/similar?api_key=${tmdbkey}&language=en-US`).then(( results)=> { 
            const filteredRecomm = results.data.results.splice(0, 6);
            this.setState({recommendations: filteredRecomm});
            this.callSly(); 

            });
        }).then( (results)=> {
            const cast = axios.get(`https://api.themoviedb.org/3/movie/${movieID}/credits?api_key=${tmdbkey}&language=en-US`).then(( results)=> { 
                //const actors = results.data.results;
                const actors = results.data.cast.splice(0, 10);
                const directors = results.data.crew.filter( (crew)=> { return crew['job'] === 'Director' });

                this.setState({actors: actors, directors: directors});
            });
        }).then( (results)=> {

            const imdb = axios.get(`https://www.theimdbapi.org/api/movie?movie_id=${this.state.imdb_id}`).then( (results)=> {
                    if(results.data){
                        console.log(results.data);
                        const imdb_rating = results.data ? results.data.rating : '';
                        const imdb_votes = results.data ? results.data.rating_count: '';
                        const content_rating = results.data ? results.data.content_rating : '';
                        return this.setState({imdb_rating : imdb_rating, imdb_votes: imdb_votes, content_rating: content_rating });
                    }
                }).catch(function(thrown) {
                    if (axios.isCancel(thrown)) {
                      console.log('Request canceled', thrown.message);
                    } else {
                      // handle error
                    }
                });
        });

    }


    playTrailer =() => {
        this.refs.trailerBox.classList.add('active');
        const movieID = this.props.match.params.movieID;
        const getTrailer = axios.get(`https://api.themoviedb.org/3/movie/${movieID}/videos?api_key=${tmdbkey}&language=en-US`).then( (results)=> {
            if(results.data){
                console.log(results.data.results);
                const trailer = results.data.results? results.data.results : '';
                return this.setState({ trailer:trailer });
            }
        });

    }
    closeTrailers = () => {
        const trailerbox = this.refs.trailerClose.parentNode;
        trailerbox.classList.remove('active');
        this.setState({ trailer:[] });
        //trailerbox.innerHTML = '';
        
    }

    trailerNav = (direction) => {
        const trailerBox = this.refs.trailerBox;
        const counterBox = trailerBox.querySelector('.trailer_counter');
        const current = trailerBox.querySelectorAll('.active')[0];
        const cid = parseInt(current.getAttribute('data-id'));
        const limit = this.state.trailer.length;
        trailerBox.querySelectorAll('.active')[0].classList.remove('active');

        if(direction === 'right'){
            const nextId = (cid === limit - 1) ? limit - 1 : cid + 1;
            const nextElm =  trailerBox.querySelector('.trailers_wrap').childNodes[nextId];
            counterBox.textContent = `${nextId + 1}/${limit}`;
            nextElm.classList.add('active');

        }else{
            const prevId = (cid === 0) ? 0 : cid - 1;
            const prevElm =  trailerBox.querySelector('.trailers_wrap').childNodes[prevId];
            counterBox.textContent = `${prevId + 1}/${limit}`;
            prevElm.classList.add('active');
        }
    }
    
    showFullDesc = () => {  this.setState({show_full_overview: true}); }

    hideModal = () => {  this.setState({show_full_overview: false});  }

    
    render(){
        const backdrop = this.state.backdrop_path ? <img className="cover-photo" src={`https://image.tmdb.org/t/p/w1000/${this.state.backdrop_path}`} alt={this.state.title} /> : '';
        const year = this.state.release_date.split('-')[0];
        const title = this.state.title? <h1>{this.state.title} ({year})</h1> : '';
        const poster = this.state.poster_path ? <img src={`https://image.tmdb.org/t/p/w300/${this.state.poster_path}`} alt={this.state.title} /> : '';
        const length = this.state.runtime ? <div className="length"><i className="lnr lnr-clock"></i> {this.state.runtime} mins</div> : '';
        const genres = this.state.genres? <div className="genres"><i className="lnr lnr-list"></i> { this.state.genres.slice(0, 3).map( (genre)=> { return (<span key={genre.id}>{genre.name} </span>) }) }</div> : '';
        const rdate = this.state.release_date.split('-');
        const release_date = this.state.release_date ?  <div className="release_date"><i className="lnr lnr-calendar-full"></i> {`${rdate[2]} ${getMonth(parseInt(rdate[1], 10))} ${rdate[0]}`}</div>: '';
        const play_button = <span onClick={this.playTrailer} className="trailer_button"><i></i> Watch Trailer</span>
        const trailer_counter = this.state.trailer.length? <div className="trailer_counter">1/{this.state.trailer.length}</div> : '';
        const recomm = this.state.recommendations.length > 0 ? <MovieGrid id={"recommended-movies"} title="Similar Movies" movies={this.state.recommendations} /> : <p>No Recommendataions Found for this Movie!</p>
        const _director = this.state.directors.length > 1 ? 'Directors' : 'Director' ;
        const hasMyRating = this.state.myrating ? 'user_rated' : '';
        const userRating = this.state.myrating ? this.state.myrating : 'N/R'; 
        const ratedOn = this.state.rated_on ? <span className="rated_on">Rated On: {this.state.rated_on}</span> : ''
        const descButton = this.state.overview && this.state.overview.length > 350 ? <span className="descButton" onClick={()=> this.showFullDesc()}>...</span> : ''
        const showFullOverview = this.state.show_full_overview === true ? <p><strong>Overview:</strong>{this.state.overview}</p> : '';
        const visibility = this.state.show_full_overview === true? true : false;

        return(
            <div id="single-movie" className={`single ${hasMyRating}`}>
                <div className="movie-cover">
                    <div className="movie-header">
                        <div className="movie-header-left">
                            <div className="movie-poster">{play_button}{poster}</div>
                        </div>
                        <div className="movie-header-right">
                            {title}
                            <div className="movie-meta">
                                {release_date}
                                {length}
                                {genres}
                            </div>
                            <p>{truncString(this.state.overview, 350, '')}{descButton}</p>

                            <div className={`creators ${_director ==='Director'? 'one_director': ''}`}>
                                {this.state.directors ? _director : ''} : {Object.keys(this.state.directors).map( (drctr, idx)=> {
                                    return <span key={idx}>{this.state.directors[drctr].name}</span>
                                })}
                            </div>

                            <div className="movie-ratings">
                                <div className="imdb_rating">
                                    <span>{this.state.imdb_rating}</span>
                                    <div className="vote_count">
                                        <a href={`http://imdb.com/title/${this.state.imdb_id}`} target="_blank">
                                        <span>{this.state.imdb_votes} votes</span>IMDB Rating
                                        </a>
                                    </div>
                                </div>

                                <div className="tmdb_rating">
                                    <span>{this.state.vote_average}</span>
                                    <div className="vote_count">
                                        <a href={`https://www.themoviedb.org/movie/${this.state.id}`} target="_blank">
                                        <span>{this.state.vote_count} votes</span>TMDB Rating
                                        </a>
                                    </div>
                                </div>
                                <div className="your_rating">
                                    <div className="user_rating">
                                        <span>{userRating}</span>
                                    </div>
                                    <div className="vote_count">
                                        <a href={`http://imdb.com/title/${this.state.imdb_id}`} target="_blank">{ratedOn}</a> Your Rating
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>


                    <div className="coveroverlay"></div>
                    {backdrop}
                </div>
                <div className="movie-content">
                    {/* Trailers */}
                    <div className="trailers" ref="trailerBox">
                        <div className="trailers_wrap">
                            {this.state.trailer.map( (item, index)=> {
                                const active = (index === 0) ? 'active' : '';
                                return <Trailer index={index} name={item.name} key={item.key} active={active} youtube={item.key} />
                            })}
                        </div>
                        {trailer_counter}
                        <div className="close_trailer" onClick={this.closeTrailers} ref="trailerClose">&times;</div>
                        <div className="trailer_nav">
                            <span className="nav_left" onClick={()=> {this.trailerNav('left')} }>&#8249;</span>
                            <span className="nav_right" onClick={()=> {this.trailerNav('right')} }>&#8250;</span>
                        </div>
                        
                    </div>

                    {/* Facts */}
                    <div className="movie-cast">
                        <h2>CAST</h2>
                        <ul>
                            {
                                Object.keys(this.state.actors).map( (actor, idx)=> {
                                    return (
                                        <li key={idx}>
                                            <div className="profile_holder">{this.state.actors[actor].profile_path ? <img src={`https://image.tmdb.org/t/p/w150/${this.state.actors[actor].profile_path}`} alt={this.state.actors[actor].name} />: ''}</div>
                                            {this.state.actors[actor].name}
                                            <span>{this.state.actors[actor].character}</span>
                                        </li>
                                        )
                                })
                            }
                        </ul>
                    </div>

                        
                    {/* Facts */}
                    <div className="movie-facts">
                        <h2>Facts</h2>
                        <ul>
                            <li>Status<span>{this.state.status}</span></li>
                            <li>Release<span>{this.state.release_date}</span></li>
                            <li>Language<span>{ISO6391.getName(this.state.original_language)}</span></li>
                            <li>Runtime<span>{this.state.runtime} mins</span></li>
                            <li>Budget<span>${this.state.budget}</span></li>
                            <li>Revenue<span>${this.state.revenue}</span></li>
                            <li>Content Rating<span className="content_rating_span">{this.state.content_rating}</span></li>
                            <li>Website<span><a href={this.state.homepage} target="_blank">{this.state.title} <i className="lnr lnr-location"></i></a></span></li>
                        </ul>
                    </div>

                    {/* Recommendataions */}
                    <div className="movie-recommendations">
                        {recomm}
                    </div>

                    
                </div>
                
                <Modal content={showFullOverview} visible={visibility} hideModal={this.hideModal} /> 

            </div>
        );
    }
}


//TRAILER Component
function Trailer(props) {
    return (
        <div className={`trlr ${props.active}`} data-id={props.index}>
            <div className="video-container">
                <iframe title={props.name} width="1280" height="720" src={`https://www.youtube.com/embed/${props.youtube}`} frameBorder="0" allowFullScreen></iframe>
            </div>
        </div>
    );
}
function mapStateToProps(state){
    return {
       settings: state.settings,
    }
   }

export default connect(mapStateToProps)(Single);