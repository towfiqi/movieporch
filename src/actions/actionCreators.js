import {tmdbkey} from '../keys'
import axios from 'axios';

export function fetchData(query, pagecount){
    
    const baseurl = 'https://api.themoviedb.org/3';
    //const discoverUrl = 'discover/movie?primary_release_date.gte=2017-07-15&primary_release_date.lte=2017-08-22';
    const request = axios.get(`${baseurl}/${query}&page=${pagecount}&api_key=${tmdbkey}`);

    return {
        type: "FETCH_DATA",
        payload: request
    }

}


//update Settings
export function updateSettings(settings){
   //console.log(settings);
    return {
        type: "UPDATE_SETTINGS",
        payload: settings
    }
}

export function fetchUserMovies(imdbId, allMovies){
    //console.log(imdbId);
    const request = axios.get(`http://api.themoviedb.org/3/find/${imdbId}?api_key=${tmdbkey}&language=en-US&external_source=imdb_id`);

     return {
         type: "FETCH_MOVIE",
         //payload: {request, allMovies},
         payload: request,
         meta: {allMovies}
     }
 }

 export function resetImportCounter(){
     return {
        type: "RESET_IMPORT_COUNTER",
        payload: 0
     }
 }

 export function syncImdbMovies(imdbId){
    const request = axios.get(`http://cors-anywhere.herokuapp.com/http://rss.imdb.com/user/ur14774441/ratings/`);

    return {
       type: "SYNC_USER_MOVIES",
       payload: request
    }
}

export function clearSyncJob(index){

    return {
       type: "RESET_IMDB_SYNC",
       payload: index
    }
}


//Add Movie to WatchList
export function addToWatchlist(movie){

    return {
        type: "ADD_TO_WATCHLIST",
        payload: movie
    }
}

//Delete Movie from WatchList
export function removeFromWatchlist(index){
    
    return {
        type: "REMOVE_FROM_WATCHLIST",
        payload: index
    }
}

//Reset WatchList Notification
export function resetWatchlistNoti(){
    
    return {
        type: "RESET_WATCHLIST_NOTIFICATION",
        payload: ''
    }
}