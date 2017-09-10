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


//update Categories
// export function updateCategories(){
    
// }


// //Update Top Movies
// export function updateTopMovies(){
    
// }


// //Add Newuser to DB
// export function updateUsers(){
    
// }


// //Update user account
// export function updateAccount(){
    
// }


// //Sync user IMDB rating and watchlist when clicked Sync Button
// export function forceSyncImdb(){
    
// }