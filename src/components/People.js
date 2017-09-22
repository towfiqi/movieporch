import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import * as actionCreators from '../actions/actionCreators';
import {tmdbkey} from '../keys';
import {truncString, getMonth, calculate_age, get_genre_name, formatDate} from '../helpers';
import axios from 'axios';
import _ from 'lodash';
import jQuery from 'jquery';
import spinner from '../assets/Infinity.gif';


class People extends React.Component{

    constructor(props){
        super(props);

        this.state = {id:'', imdb_id:'', biography:'', birthday:'', place_of_birth:'', gender:'', homepage:'', name:'', profile_path:'', cast: [], crew: [], photos: [],show_full_bio: false, backdrop:''}

    }

    componentDidMount(){

        this.fetchPeopleData(this.props.match.params.peopleID);
        
        //Parrallax
        window.addEventListener("scroll", function(event){
            jQuery('.cover-photo').css({top: - window.pageYOffset / 3 +'px'})
        });
    }

    fetchPeopleData(id){
        axios.get(`https://api.themoviedb.org/3/person/${id}?api_key=${tmdbkey}&language=en-US`).then(( results)=> { 
            console.log(results.data);
            const {id, imdb_id, birthday, biography, place_of_birth, gender, homepage, name, profile_path} = results.data;
            this.setState({id, imdb_id, birthday, biography, place_of_birth, gender, homepage, name, profile_path});
            document.title =  this.state.name +' - Movie Proch';

        }).then( (results)=> {
            axios.get(`https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${tmdbkey}&language=en-US`).then(( results)=> { 
                console.log(results.data);
                const cast = results.data.cast.length > 0 ? results.data.cast : [];
                var crew = results.data.crew.length > 0 ? results.data.crew : [];
                
                this.modifyData(cast, crew); 
                
            });
        })
    }

    fetchGallery = ()=> {
        const id = this.props.match.params.peopleID;

        if(this.state.photos.length === 0 ){
            axios.get(`https://api.themoviedb.org/3/person/${id}/images?api_key=${tmdbkey}&language=en-US`).then(( results)=> { 
                console.log(results.data.profiles);
                this.setState( {photos: results.data.profiles});
            });
        }

        jQuery('.photo_gallery').addClass('active');

    }


    modifyData =(cast, crew) => {
        var cover = '';

        if(cast.length > 0){
            var movie = _.orderBy(cast, ['popularity'],['desc']);
            //console.log(movie[0].poster_path);
            cover = movie[0].poster_path ? movie[0].poster_path : ''

        }else if(crew.length > 0){
            if(!cover){
                console.log('Crew Backdrop function Ran!');
                var crewmovie = _.orderBy(crew, ['popularity'],['desc']);
                cover = crewmovie[0].poster_path ? crewmovie[0].poster_path : ''
            }
        }

        //Crew Contains Duplicate Movies. Merge them with comma sperated "Jobs" field.
        var valueArr = crew.map(function(item){ return item.id });
        var isDuplicate =_(valueArr).groupBy().pickBy(x => x.length > 1).keys().value()
        
        isDuplicate.forEach( (ditem)=> {
            var allJobs = [];
            crew.forEach( ( item, idx)=> {
                if(Number(ditem) === item.id ){
                    allJobs.push(item.job);
                    item.job = allJobs.toString();
                }
            });

        })
        crew = _.uniqBy(crew.reverse(), 'id');

            
        //Assign User Rating and Watchlist to current Actors Cast Movies
        cast.forEach( (castmovie)=> {
            this.isRated(castmovie);
            this.inWatchList(castmovie);
        });

        //Assign User Rating and Watchlist to current Actors Cast Movies
        crew.forEach( (crewmovie)=> {
            this.isRated(crewmovie);
            this.inWatchList(crewmovie);
        });

        cast.sort(function(a, b) { return new Date(b.release_date) - new Date(a.release_date); });
        crew.sort(function(a, b) { return new Date(b.release_date) - new Date(a.release_date); });


        this.setState({cast, crew, backdrop:cover});
    }


    isRated = (movie)=> {
        const allMovies = this.props.settings.allMovies;
        
        if(!movie.myrating){
            allMovies.forEach((item)=>{
                if(item.id === movie.id){
                    var rated_on = formatDate(item.created, true);
                    movie.myrating = item.myrating;
                    movie.rated_on = rated_on
                }
            });
        }
    }

    inWatchList = (movie) =>{
        const WLMovies = this.props.watchList.watching;
        
        if(!movie.watchList){
            WLMovies.forEach((item)=>{
                if(item.id === movie.id){
                    //console.log(movie);
                    movie.watchList = true
                }
            });
        }

    }

    addToWatchList = (movie)=> {
        if(movie){ movie.watchList = true}
        //var theMovie = [{...this.state, ...movie}]
        console.log(movie);
        this.props.addToWatchlist([movie]);

        const cast = this.state.cast.length > 0 ? this.state.cast : [];
        const crew = this.state.crew.length > 0 ? this.state.crew : [];

        cast.forEach( (castmovie)=> {  this.isRated(castmovie);  this.inWatchList(castmovie);  });
        crew.forEach( (crewmovie)=> {  this.isRated(crewmovie);  this.inWatchList(crewmovie);  });

        this.setState({cast, crew});


    }

    removeFromWatchList = (movie)=> {
        var index;
        const WLMovies = this.props.watchList.watching;
        
        WLMovies.filter((item )=> { return item.id === movie.id }).map((item, idx)=>{  return index = idx;  });

        const cast = this.state.cast.length > 0 ? this.state.cast : [];
        const crew = this.state.crew.length > 0 ? this.state.crew : [];
        
        var cast_index, crew_index, inCast, inCrew, newcast = cast, newcrew = crew;
        cast.forEach( (castmovie, idx)=> { if(castmovie.id === movie.id){ cast_index =  idx; inCast = true } });
        crew.forEach( (crewmovie, idx)=> { if(crewmovie.id === movie.id){ crew_index =  idx; inCrew = true } });

        if(inCast){
            newcast = [ ...cast.slice(0, cast_index), {...cast[cast_index], ...{watchList: false}}, ...cast.slice(cast_index + 1) ]
        }
        if(inCrew){
            newcrew = [ ...crew.slice(0, crew_index), {...crew[crew_index], ...{watchList: false}}, ...crew.slice(crew_index + 1) ]
        }
        
        //console.log('In Cast: ', inCast);
        //console.log('In Crew: ', inCrew);
        //console.log(newcast);

        this.props.removeFromWatchlist(index);

        this.setState({cast:newcast, crew: newcrew});
    }


    expandMovie = (item) => {

        //console.log(document.getElementById(item));
        jQuery('.persons-movie-item').not(`#${item}`).removeClass('active');
        jQuery(`#${item}`).addClass('active');

        
    }

    selectPhoto = (id, photoUrl)=> {
        jQuery('.current_photo img').attr('src', spinner);
        setTimeout( ()=> {  jQuery('.current_photo img').attr('src', 'https://image.tmdb.org/t/p/w1000/'+photoUrl)  }, 100)
        jQuery('.photo_gallery ul li').not(`li#photo-${id}`).removeClass('active');
        jQuery(`.photo_gallery ul li#photo-${id}`).addClass('active');
    }

    renderPhotos = ()=> {
        const currentPhoto = this.state.photos.length > 0 ?<div className="current_photo"><img src={`https://image.tmdb.org/t/p/w1000/${this.state.photos[0].file_path}`} alt="" /></div> : '';
        const photoNav = this.state.photos.length > 0 ? <div className="photoSly"><ul>{this.state.photos.map( (photo, index)=> { return <li key={index} id={`photo-${index}`} onClick={()=> this.selectPhoto(index, photo.file_path)}><img src={`https://image.tmdb.org/t/p/w90/${photo.file_path}`} alt="" /></li>})}</ul></div> : '';
        return(
            <div className="photo_gallery">
                <span className="close_photos" onClick={ ()=> jQuery('.photo_gallery').removeClass('active')}>&times;</span>
                {currentPhoto}
                {photoNav}
            </div>
        )
    }

    renderMovies = (array, type)=> {

        return array.map( (movie)=> {

            const genres = movie.genre_ids ? <div className="genres"><i className="lnr lnr-list"></i> { movie.genre_ids.slice(0, 3).map( (id)=> { return (<span key={id}>{get_genre_name(id)} </span>) }) }</div> : '';
            
            const year = movie.release_date? movie.release_date.split('-')[0] : '';
            const movbackdrop = movie.poster_path ? <div className='movie-backdrop'><img src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`} alt={movie.name} /></div> : '';
            const movposter = movie.poster_path ? <img src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`} alt="" /> : <i className="lnr lnr-film-play"></i>;
            const myrating = movie.myrating  ? <div className="user_rating"><span>{movie.myrating}</span></div>  : '';
            const watchListButton = movie.watchList === true ? <a className="remove-watchlist-button" onClick={ ()=> this.removeFromWatchList(movie)}><i className="lnr lnr-heart"></i></a> : <a className="add-watchlist-button" onClick={ ()=> this.addToWatchList(movie)}><i className="lnr lnr-heart"></i></a> ;
            const ratedClass = movie.myrating  ? 'user_rated' : '';
            const watchingClass = movie.watchList  ? 'watching' : '';
            var role; 
            if(type === 'cast'){
                role = movie.character ? <span className="role"><i>as</i> {movie.character}</span>: ''; 
            }else{
                role = movie.job ? <span className="role"><i>as</i> {movie.job}</span>: ''; 
            }


            return(
                <div className={`persons-movie-item ${ratedClass} ${watchingClass}`} key={movie.credit_id} id={`${type}-${movie.id}`} onClick={()=> this.expandMovie(`${type}-${movie.id}`)}>

                        <div className="movie_preview">
                            {myrating}

                            <div className="movie_preview_left">
                                <div className='movie-poster'>{movposter}</div>
                                <h3><Link to={`/movie/${movie.id}`}>{movie.title} ({year}){role}</Link></h3>
                                {genres}
                                <div className="movie_full">
                                    <p>{truncString(movie.overview, 200, '...')}</p>
                                    <Link to={`/movie/${movie.id}`} className="movie-button"><i className="lnr lnr-frame-contract"></i></Link>
                                </div>
                            </div>

                            <div className="movie_preview_right">
                                {watchListButton}
                                <div className={`movie_rating movie-rank${Math.round(movie.vote_average)}`}><span>{movie.vote_average}</span></div>
                            </div>

                            
                        </div>

                        {movbackdrop}

                </div>
            );
        })
    }


    showFullDesc = () => {  this.setState({show_full_bio: true}); }
    
    hideModal = () => {  this.setState({show_full_bio: false});  }

    sortMovies =(sortBy, event)=> {
        
        const cast = this.state.cast;
        const crew = this.state.crew;
        if(sortBy === 'popularity'){
            cast.sort(function(a, b) { return b.popularity - a.popularity; });
            crew.sort(function(a, b) { return b.popularity - a.popularity; });
        }
        if(sortBy === 'date'){
            cast.sort(function(a, b) { return new Date(b.release_date) - new Date(a.release_date); });
            crew.sort(function(a, b) { return new Date(b.release_date) - new Date(a.release_date); });
        }
        jQuery('.people-movies-wrap, .people-movies-wrap ul li').removeClass('showWatched active');

        event.target.parentNode.className = 'active';
        this.setState({ cast, crew });
    }

    sortedByWatched = (event)=> {
        jQuery('.people-movies-wrap ul li').removeClass('active');
        event.target.parentNode.className = 'active';
        jQuery('.people-movies-wrap').addClass('showWatched');
    }

    render(){
        const descButton = this.state.biography && this.state.biography.length > 350 ? <span className="descButton" onClick={()=> this.showFullDesc()}>...</span> : ''        
        const name = this.state.name && !navigator.userAgent.match(/Mobi/) ? <h1>{this.state.name}</h1> : '';
        const mobileName = this.state.name && navigator.userAgent.match(/Mobi/)  ? <h1>{this.state.name}</h1> : '';
        const poster = this.state.profile_path ? <img src={`https://image.tmdb.org/t/p/w300/${this.state.profile_path}`} alt={this.state.name} /> : '';        
        const gallery_button = <span onClick={this.fetchGallery} className="gallery_button"><i className="lnr lnr-picture"></i> Photo Gallery</span>
        const coverPhoto = this.state.backdrop ? <img className="cover-photo" src={`https://image.tmdb.org/t/p/w1000/${this.state.backdrop}`} alt={this.state.name} /> : '';
        
        const bdate = this.state.birthday ? this.state.birthday.split('-') : '';
        const birthday = this.state.birthday ? <div className="birthday"><i className="lnr lnr-calendar-full"></i> {`${bdate[2]} ${getMonth(parseInt(bdate[1], 10))} ${bdate[0]}`} <span>{calculate_age(new Date(this.state.birthday))} yrs</span></div>: '';
        
        const pob = this.state.place_of_birth ? this.state.place_of_birth.split(',') : '';
        const location = this.state.place_of_birth ? <div className="location"><i className="lnr lnr-earth"></i> {pob.slice(-1)[0]}</div>: '';
        
        const genders = ['x','Female', 'Male', 'other'];
        const gender = this.state.gender ? <div className="gender"><i className="lnr lnr-user"></i> {genders[this.state.gender]}</div>: '';

        var MoviesCount = [...this.state.cast, ...this.state.crew];
        MoviesCount = _.uniqBy(MoviesCount, 'id');

        var moviesWatched = MoviesCount.length > 0 ? MoviesCount.filter( (movie)=> { return movie.myrating }).length : '0';
        moviesWatched = moviesWatched > 0 && moviesWatched < 10  ? '0'+moviesWatched : moviesWatched;
        var moviesWatching = MoviesCount.length > 0 ? MoviesCount.filter( (movie)=> { return movie.watchList }).length : '0';
        moviesWatching = moviesWatching > 0 && moviesWatching < 10  ? '0'+moviesWatching : moviesWatching;

        const totalMovies = <div className="total_movies">{MoviesCount.length.toString()} <span>Total Movies</span></div>
        const watchedMovies = <div className="watched_movies">{moviesWatched} <span>Movies Watched</span></div>
        const watchingMovies = <div className="watching_movies">{moviesWatching} <span>Movies Watching</span></div>

        const castMovies = this.state.cast.length > 0 ? <div className="castMovies"><h2>Actor <span>{this.state.cast.length || 0}</span></h2><div className="people-movies-cast">{this.renderMovies(this.state.cast || [], 'cast')}</div></div> : ''
        const crewMovies = this.state.crew.length > 0 ? <div className="crewMovies"><h2>Crew <span>{this.state.crew.length || 0}</span></h2><div className="people-movies-crew">{this.renderMovies(this.state.crew || [], 'crew')}</div></div> : ''


        return(
            <div id="people-page">
                <div className="people-cover">
                    <div className={`people-header`}>
                        <div className="people-header-left">
                            {mobileName}
                            <div className="people-poster">{gallery_button}{poster}</div>
                        </div>
                        <div className="people-header-right">
                            {name}
                            <div className="people-meta">
                                {gender}
                                {birthday}
                                {location}
                                
                            </div>
                            <p>{truncString(this.state.biography, 350, '')}{descButton}</p>

                            <div className="user_person_stats">
                                {totalMovies}
                                {watchedMovies}
                                {watchingMovies}
                            </div>
                        </div>
                    </div>


                    <div className="coveroverlay"></div>
                    {coverPhoto}
                </div>

                {this.renderPhotos()}

                <div className="people-content">
                    <div className="people-movies-wrap">
                        <ul>
                            <li><a onClick={ (event)=> this.sortedByWatched(event)} >Watched</a></li>
                            <li><a onClick={ (event)=> this.sortMovies('popularity', event)} >Popularity</a></li>
                            <li className="active"><a onClick={ (event)=> this.sortMovies('date', event)}>Date</a></li>
                        </ul>

                        {castMovies}
                        {crewMovies}
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(People);