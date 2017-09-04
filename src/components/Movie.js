import React from 'react';
import {get_genre_name, truncString, getMonth} from '../helpers';
import {Link} from 'react-router-dom';
import axios from 'axios';


class Movie extends React.Component {

    constructor(){
        super();
        
        this.state = {rating: ''}
    }



    componentDidMount() {
        const movie = this.props.movie;
        const year = movie.release_date.split('-')[0];
        // const rating = axios.get(`https://theimdbapi.org/api/find/movie?title=${movie.title}&year=${year}`).then( (results)=> {
        //     if(results.data){
        //         //console.log(results.data[0]);
        //         const rate = results.data[0] ? results.data[0].rating : '';
        //         return this.setState({rating : rate });
        //     }

        // });
        
    }


    render(){
        const movie = this.props.movie;
        const year = movie.release_date.split('-')[0];
        const month = movie.release_date.split('-')[1];
        const date = movie.release_date.split('-')[2];
        const released = this.props.slider === true ? <div className="release_date"><i className="lnr lnr-clock"></i> {date} {getMonth(parseInt(month, 10))}</div> : ''; 
        const genres = <div className="genres"><i className="lnr lnr-list"></i> { movie.genre_ids.slice(0, 3).map( (id)=> { return (<span key={id}>{get_genre_name(id)} </span>) }) }</div>
        return(
            <div id={`movie-${movie.id}`} className="movie">
                
                <div className="movie-content-wrap">
                    <div className="movie_rating"><span>{this.state.rating || movie.vote_average}</span></div>
                    
                    <h3><Link to={`/movie/${movie.id}`}>{movie.title} ({year})</Link></h3>
                    <div className="movie_content">
                        {released}
                        {genres}
                        <p>{truncString(movie.overview, 200, '...')}</p>
                        <Link to={`/movie/${movie.id}`} className="movie-button"><i className="lnr lnr-frame-contract"></i></Link>
                    </div>
                </div>
                
                <img src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`} alt={movie.title} />
            </div>
        );
    }
}

export default Movie;