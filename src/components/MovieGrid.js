import React from 'react';
import Movie from './Movie';

class MovieGrid extends React.PureComponent {

    constructor(props){
        super(props);

        this.state = {sliderBG: ''}
    }


    componentWillReceiveProps(nextProps){
        if(nextProps.slider === true){
            this.setState({sliderBG: nextProps.movies[1].poster_path});
        } 
    }

    componentDidMount(){
        if(this.props.movies.length > 0 && this.props.slider === true){
            this.setState({sliderBG: this.props.movies[1].poster_path});
        }
        
    }

    sliderBG = (imgpath)=> {
        //console.log(imgpath);
        this.setState({sliderBG: imgpath});
    }

    renderMovies =() =>{
        const movies = this.props.movies;
        const slider = this.props.slider === true ? true : false;
        const sliderBG = this.props.slider === true ? this.sliderBG : ''
        const trailer = this.props.trailer === true ? true : false;
        return Object.keys(this.props.movies).map( (movie, i)=> {
            
             return <Movie movie={movies[i]} key={movies[i].id + i} slider={slider} trailer={trailer} sliderBg={sliderBG}  />
         });
    }


    render(){
        const movies = this.props.movies;
        const title = this.props.title;
        const id = this.props.id;
        const firstWord = title.split(' ')[0];
        const otherWords = title.substr(title.indexOf(" ") + 1);
        const sliderClass = this.props.slider === true ? 'slider' : '';
        const firstMovieHeader = this.props.movies.length > 1 && this.state.sliderBG  ? <img src={`https://image.tmdb.org/t/p/w300/${this.state.sliderBG}`} alt={title} />  : ''
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