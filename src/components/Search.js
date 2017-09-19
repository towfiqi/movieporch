import React from 'react';
import {Link} from 'react-router-dom';
import debounce from 'lodash/debounce';
import {get_genre_name} from '../helpers';
import {tmdbkey} from '../keys'
import axios from 'axios';
const jQuery = require('jquery');
const Sly = require('@rq/sly-scrolling')(jQuery, window);

class SearchBar extends React.PureComponent {
    
    constructor(){
        super();

        this.state = {search_term: '', search_results:[]}
    }

    componentDidMount(){
        this.searchMovies = debounce(function(){  console.log('Debounced:', this.state.search_term); this.getSearchItems();   }, 350);
    }


    getSearchItems = ()=> {
        var term =this.state.search_term;

        if(term){
            axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${tmdbkey}&language=en-US&query=${term}&page=1&include_adult=false`).then(( results)=> { 
                console.log(results.data.results);
                this.setState({search_results: results.data.results});
    
            }).then( (results)=> {
                var $frame  = jQuery('.search_results_wrap');
                var $scroll  = jQuery('.search_results .scrollbar');
                $frame.sly({
                    itemNav: 'basic',
                    smart: 1,
                    activateOn: 'click',
                    mouseDragging: 1,
                    touchDragging: 1,
                    releaseSwing: 1,
                    startAt: 0,
                    scrollBar: $scroll,
                    scrollBy: 1,
                    activatePageOn: 'click',
                    speed: 300,
                    elasticBounds: 1,
                    dragHandle: 1,
                    dynamicHandle: 1,
                    clickBar: 1,
                });
            });
        }else{
            this.setState({search_results: []});
        }

    }

    handleSearch = (e)=> {
        
        this.setState({search_term: e.target.value});
        
        //debounce(function(){  console.log('Debounced:')   }, 250);
        this.searchMovies(e.target.value)

    }

    clearSearch = ()=> {

        this.setState({search_term: '', search_results: []});
        jQuery('.search_bar input').val('');
    }

    render(){
        const search_visib = this.state.search_results.length < 1 ? 'hide_search': ''; 
        return(
            <div className="search">
                <div className="search_bar">
                    <input type="text" onChange={this.handleSearch} value={this.state.serch_term} placeholder="Search Movies.." />
                    <button className={`clear_search ${search_visib}`} onClick={this.clearSearch}>&times;</button>
                </div>

                <div className={`search_results ${search_visib}`}>

                    {/* ScrollBar */}
                    <div className="scrollbar">
                        <div className="handle">
                            <div className="mousearea"></div>
                        </div>
                    </div>

                    <div className="search_results_wrap">
                        <div className="search_results_inner">
                        {
                            this.state.search_results.map( (movie, idx)=> {
                                return (
                                    <div className="movie-search" key={movie.id + idx} >
                                        <div className="poster_wrap">{movie.poster_path? <img src={`https://image.tmdb.org/t/p/w90/${movie.poster_path}`} alt=""/>: ''}</div>
                                        <div className="search-movie-content">
                                            <Link to={`/movie/${movie.id}`} onClick={this.clearSearch}>
                                                <div className="search-movie-title" >{movie.title} ({movie.release_date.split('-')[0]})</div>
                                                <div className="search-movie-genres">
                                                    { movie.genre_ids.slice(0, 3).map( (id)=> { return (<span key={id}>{get_genre_name(id)} </span>) }) }
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                    )
                            })
                        }
                        </div>
                    </div>
                </div>

            </div>
        );
    }

}

export default SearchBar;