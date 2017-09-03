import React from 'react';
import Movie from './Movie';


class MovieGrid extends React.Component {

    renderMovies =() =>{
        const movies = this.props.movies;
        const slider = this.props.slider === true ? true : false;
        return Object.keys(this.props.movies).map( (movie, i)=> {
            
             return <Movie movie={movies[i]} key={movies[i].id + i} slider={slider} />
         });
    }


    render(){
        const movies = this.props.movies;
        const title = this.props.title;
        const id = this.props.id;
        const firstWord = title.split(' ')[0];
        const otherWords = title.substr(title.indexOf(" ") + 1);
        const sliderClass = this.props.slider === true ? 'slider' : '';
        const firstMovieHeader = this.props.movies.length > 1 ? <img src={`https://image.tmdb.org/t/p/w300/${this.props.movies[0].poster_path}`} alt={title} />  : ''
        const heroHeader = this.props.slider === true ? <div className="hero_header">{firstMovieHeader}</div> : ''
        const no_movies = movies.length ===0 ? 'no_movies' : '';
        return(
            <div id={id} className={`movie-grid ${sliderClass} ${no_movies}`}>
                <h2 className="grid-title"><span>{firstWord}</span> {otherWords}</h2>
                <div className="movie-grid-inner">
                    <div className="slidee">
                        {this.renderMovies()}
                    </div>
                </div>
                {heroHeader}
            </div>
        );
    }

}

export default MovieGrid;