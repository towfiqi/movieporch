import React from 'react';
import MovieGrid from './MovieGrid';
import {get_genre_name} from '../helpers';
import axios from 'axios';
import {tmdbkey} from '../keys';
import jQuery from 'jquery';
const Sly = require('@rq/sly-scrolling')(jQuery, window);

class TopMovies extends React.Component {

    constructor(){
        super();
        this.state = { year: this.currentYear, genres: '', movies: [], page:1}

        this.filterMovies = this.filterMovies.bind(this);
    }

    componentWillMount(){

        this.fetchTopMovies();
        
    }

    componentDidMount(){
        this.callSly();
    }

    currentYear = new Date().getFullYear();

    
    fetchTopMovies =(genres, year=this.currentYear, page=1)=> {

        if(genres){genres = `&with_genres=${genres}`}else{ genres=''}

        axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${tmdbkey}&language=en-US&sort_by=popularity.desc&page=${page}${genres}&primary_release_year=${year}`).then((results)=> {
           // console.log(results.data);
            const fetchedMovies = results.data.results;
            const newMovies = [...this.state.movies, ...fetchedMovies];
            this.setState({movies: newMovies, page: page});
        });

    }


    filterYears = ()=> {
        var date = new Date();
        var year = parseInt(date.getFullYear()) + 2;
        var years = [] 
        for (var i=1930; i < year; i++){
            years.push(i);
        }
        
        return years;
    }


    callSly = () => {

        const start = ( this.currentYear - 1930);
        //SLY Options
        var options = { horizontal: 1, itemNav: 'forceCentered', smart: 1, activateOn: 'click', mouseDragging: 1, touchDragging: 1, releaseSwing: 1, 
        startAt: start, scrollBy: 0, activatePageOn: 'click', speed: 300,  elasticBounds: 1, dragHandle: 1, dynamicHandle: 1, clickBar: 1, activateMiddle: 1 };
        var frame = new Sly('.filter_years_wrap', options).init();
        
        
        
            jQuery(window).scroll(() => {
                if (jQuery(window).scrollTop() == jQuery(document).height() - jQuery(window).height()) {
                  if(this.state.movies.length < 200){
                    this.fetchTopMovies(this.state.genres, this.state.year, this.state.page + 1);
                  }
                }
            });
        

    }

    
    filterMovies = ()=> {
        const year = jQuery('.filter_years_wrap li.active').text();

        var selectedGenres = jQuery('.filter-genre-item input:checkbox:checked').map(function() {
            return this.value;
        }).get();
        
        selectedGenres = selectedGenres.join(",");

        this.setState({movies:[], year: year, genres: selectedGenres});
        this.fetchTopMovies(selectedGenres, year, 1);
        jQuery('.top_options').removeClass('active');

    }
    
    clearFilter =()=> {
        this.setState({ genres:'', year:this.currentYear, movies: [] }, ()=> {
            this.fetchTopMovies(this.state.genres, this.state.year, this.state.page);
            jQuery('.filter-genre-item input:checkbox:checked').map(function() {
                return jQuery(this).prop('checked', false); 
            });
            jQuery('.filter_years_wrap ul li').removeClass('active');
            jQuery('.filter_years_wrap ul li:contains('+this.currentYear+')').addClass('active');

        });
        

    }

    render(){
        const loadedMsg = this.state.movies.length === 200 ? <p>Loaded All 200 Movies!</p> : '' ;
        const filtYear = this.state.year;
        const genresarray = this.state.genres ? this.state.genres.split(',') : [] ;
        const filtgenres = this.state.genres ? genresarray.map( (genre)=> { return <a key={`filterd-${genre}`}>{get_genre_name(parseInt(genre))}</a> }) : 'All'
        const clearfilterbutton  = this.state.genres || this.state.year != this.currentYear ? <button onClick={()=> this.clearFilter()}>&times;</button> : '';
        return(
            <div className="topmovies">
                <div className="topmovies_wrapper">
                    
                    <div className="topmovies_header">
                        <div className="page_title">
                            <h2><span>TOP</span> 200 MOVIES</h2>
                        </div>
                        <div className="top_options">
                            <div className="filter_query">{clearfilterbutton} Year: <span>{filtYear}</span> / Genres: <span>{filtgenres}</span></div>
                            <div className="top_opt_trigger" onClick={()=> jQuery('.top_options').toggleClass("active")}><i className="lnr lnr-cog"></i> Filter</div>
                            <div className="filter_box">
                                <div className="filter_year">
                                    
                                    <div className="filter_years_wrap">
                                        <ul>
                                            {this.filterYears().map( (year)=> {
                                                return <li key={year}>{year}</li>
                                            })}
                                        </ul>
                                    </div>
                                </div>
                                <input className="range-slider" type="hidden" defaultValue="2017" />
                                <div className="filter_genres">
                                    <div className="filter-genre-item"><input type="checkbox" value="28" id="genre-28"/><label htmlFor="genre-28">Action</label></div>
                                    <div className="filter-genre-item"><input type="checkbox" value="12" id="genre-12" /><label htmlFor="genre-12">Adventure</label></div>
                                    <div className="filter-genre-item"><input type="checkbox" value="16" id="genre-16" /><label htmlFor="genre-16"> Animation</label></div>
                                    <div className="filter-genre-item"><input type="checkbox" value="35" id="genre-35" /><label htmlFor="genre-35"> Comedy</label></div>
                                    <div className="filter-genre-item"><input type="checkbox" value="80" id="genre-80" /><label htmlFor="genre-80"> Crime</label></div>
                                    <div className="filter-genre-item"><input type="checkbox" value="99" id="genre-99" /><label htmlFor="genre-99"> Documentary</label></div>
                                    <div className="filter-genre-item"><input type="checkbox" value="18" id="genre-18" /><label htmlFor="genre-18"> Drama</label></div>
                                    <div className="filter-genre-item"><input type="checkbox" value="10751" id="genre-10751" /><label htmlFor="genre-10751"> Family</label></div>
                                    <div className="filter-genre-item"><input type="checkbox" value="14" id="genre-14" /><label htmlFor="genre-14"> Fantasy</label></div>
                                    <div className="filter-genre-item"><input type="checkbox" value="36" id="genre-36" /><label htmlFor="genre-36"> History</label></div>
                                    <div className="filter-genre-item"><input type="checkbox" value="27" id="genre-27" /><label htmlFor="genre-27"> Horror</label></div>
                                    <div className="filter-genre-item"><input type="checkbox" value="10402" id="genre-10402" /><label htmlFor="genre-10402"> Music</label></div>
                                    <div className="filter-genre-item"><input type="checkbox" value="9648" id="genre-9648" /><label htmlFor="genre-9648"> Mystery</label></div>
                                    <div className="filter-genre-item"><input type="checkbox" value="10749" id="genre-10749" /><label htmlFor="genre-10749"> Romance</label></div>
                                    <div className="filter-genre-item"><input type="checkbox" value="878" id="genre-878" /><label htmlFor="genre-878"> Science Fiction</label></div>
                                    <div className="filter-genre-item"><input type="checkbox" value="10770" id="genre-10770" /><label htmlFor="genre-10770"> TV Movie</label></div> 
                                    <div className="filter-genre-item"><input type="checkbox" value="53" id="genre-53" /><label htmlFor="genre-53"> Thriller</label></div>
                                    <div className="filter-genre-item"><input type="checkbox" value="10752" id="genre-10752" /><label htmlFor="genre-10752"> War</label></div>
                                    <div className="filter-genre-item"><input type="checkbox" value="37" id="genre-37" /><label htmlFor="genre-37"> Western</label></div>   
                                </div>

                                <button className="filter_button" onClick={()=> this.filterMovies()}>Apply</button>
                            </div>
                        </div>
                    </div>

                    <div className="topmovies_movies">
                        <MovieGrid movies={this.state.movies} title="" />
                        {loadedMsg}
                    </div>

                </div>
            </div>
        );
    }
}

export default TopMovies;