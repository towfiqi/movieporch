import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actionCreators from '../actions/actionCreators';
import {get_genre_name, truncString, getMonth, formatDate} from '../helpers';
import {Link} from 'react-router-dom';
import fakePoster  from '../assets/poster.jpg';

class Movie extends React.Component {

    constructor(){
        super();
        
        this.state = {rating: '', myrating: '', rated_on:'', watchList:false}
    }



    componentDidMount() {
        //const movie = this.props.movie;
        //const year = movie.release_date? movie.release_date.split('-')[0] : '';
        // const rating = axios.get(`https://theimdbapi.org/api/find/movie?title=${movie.title}&year=${year}`).then( (results)=> {
        //     if(results.data){
        //         //console.log(results.data[0]);
        //         const rate = results.data[0] ? results.data[0].rating : '';
        //         return this.setState({rating : rate });
        //     }

        // });
        
        //Check and see if the User Rated this Movie. If did, assign the rating to state
        this.isRated();

        //Check if its in Users Watchlist
        this.inWatchList();
 
    }

    componentDidUpdate(prevProps, prevState){

        //When Movie is removed from Watchlist Auto Change the Heart Button to Delete button on All Movies instance in current page.
        if(prevState.watchList === true){
            setTimeout( ()=> {
                if(this.props.movie.id === this.props.watchList.justRemoved){
                    //console.log('Deleted Movie: ', this.props.movie.title, this.state);
                    if(this.state.watchList === true){
                        this.setState({watchList: false});
                    }
                }
            }, 1000);
        }

    }

    isRated = ()=> {
        const allMovies = this.props.settings.allMovies;
        if(!this.state.myrating){
            allMovies.forEach((item)=>{
                if(item.id === this.props.movie.id){
                    var rated_on = formatDate(item.created, true);
                    this.setState({myrating:item.myrating, rated_on: rated_on});
                }
            });
        }
    }

    inWatchList = () =>{
        const WLMovies = this.props.watchList.watching;
        WLMovies.forEach((item)=>{
            if(item.id === this.props.movie.id){
                this.setState({watchList: true});
            }
        });
    }

    addToWatchList = ()=> {
        var theMovie = [{...this.state, ...this.props.movie}]
        //console.log(theMovie);
        this.props.addToWatchlist(theMovie);
        this.setState({watchList: true});
    }

    removeFromWatchList = ()=> {
        var index;
        const WLMovies = this.props.watchList.watching;
        WLMovies.filter( (item)=> { return item.id === this.props.movie.id }).map((item, idx)=>{  return index = idx;  });
        //console.log(index);
        this.setState({watchList: false});
        this.props.removeFromWatchlist(index);
        
    }

    sliderBgChange = ()=> {
        if(this.props.slider === true ){
            return this.props.sliderBg(this.props.movie.poster_path);
        }
    }

    render(){
        const movie = this.props.movie;

        const year = movie.release_date? movie.release_date.split('-')[0] : '';
        const month = movie.release_date? movie.release_date.split('-')[1]: '';
        const date = movie.release_date? movie.release_date.split('-')[2]: '';
        const released = this.props.slider === true ? <div className="release_date"><i className="lnr lnr-clock"></i> {date} {getMonth(parseInt(month, 10))}</div> : ''; 
        
        const genres = movie.genre_ids ? <div className="genres"><i className="lnr lnr-list"></i> { movie.genre_ids.slice(0, 3).map( (id)=> { return (<span key={id}>{get_genre_name(id)} </span>) }) }</div> : '';
        const hasMyRating = this.state.myrating ? 'user_rated' : '';
        const userRating = this.state.myrating ? <div className="user_rating"><span>{this.state.myrating}</span></div> : ''; 
        const ratedOn = this.state.rated_on ? <span className="rated_on">Rated: {this.state.rated_on}</span> : ''
        const trailerButton  = this.props.trailer === true ? <a className="trailer-button" data-id={movie.id}><i></i></a> : '';
        const watchListButton = this.state.watchList === false ? <a className="add-watchlist-button" onClick={ ()=> this.addToWatchList()}><i className="lnr lnr-heart"></i></a> : <a className="remove-watchlist-button" onClick={ ()=> this.removeFromWatchList()}><i className="lnr lnr-heart"></i></a>
        const watchClass = this.state.watchList === true ? 'watching' : ''
        const poster = movie.poster_path ? <img src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`} alt={movie.title} /> : <img src={`${fakePoster}`} alt={movie.title} />
        
        return(
            <div id={`movie-${movie.id}`} className={`movie ${hasMyRating} ${watchClass}`} onClick={()=> this.sliderBgChange()}>
                {userRating}
                
                <div className="movie-item-wrap">
                    <div className="movie-content-wrap">
                        <div className="movie_rating"><span>{this.state.rating || movie.vote_average}</span></div>
                        
                        <h3><Link to={`/movie/${movie.id}`}>{movie.title} ({year})</Link>{ratedOn}</h3>
                        <div className="movie_content">
                            {released}
                            {genres}
                            <p>{truncString(movie.overview, 200, '...')}</p>
                            {trailerButton}
                            {watchListButton}
                            <Link to={`/movie/${movie.id}`} className="movie-button"><i className="lnr lnr-frame-contract"></i></Link>
                        </div>
                    </div>
                    
                    {poster}
                
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

export default connect(mapStateToProps, mapDispatchToProps)(Movie);